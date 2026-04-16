import { Env } from "@/index";
import { Embeddings } from "@/llm/embeddings";
import { MemoryDocument, MemoryMetadata, MemoryType, memoryTypeSchema } from "./schema";

/** D1 查询行（含未解析的 metadata JSON） */
interface MemoryD1Row {
  id: string;
  session_id: string;
  type: MemoryType;
  content: string;
  metadata: string;
  created_at: number;
}

/**
 * 记忆仓库：封装 D1、Vectorize 与嵌入调用，对外只返回领域类型。
 */
export class MemoryRepository {
  constructor(
    private readonly vectorize: Env["VECTORIZE"],
    private readonly db: Env["DB"],
    private readonly embeddings: Embeddings,
  ) {}

  /**
   * 向量语义检索，将 Vectorize 命中转换为记忆文档。
   */
  async findByVectorize(query: string, limit: number): Promise<MemoryDocument[]> {
    const vector = await this.embeddings.embedQuery(query);
    const res = await this.vectorize.query(vector, { topK: limit, returnMetadata: "all" });
    const out: MemoryDocument[] = [];

    for (const item of res.matches) {
      const doc = this.memoryDocumentFromVectorizeMatch(item);
      if (doc) out.push(doc);
    }
    return out;
  }

  /**
   * 按类型从 D1 拉取记忆（已解析 metadata）。
   */
  async findByTypes(sessionId: string, types: MemoryType[], limit: number): Promise<MemoryDocument[]> {
    if (types.length === 0) return [];

    const placeholders = types.map(() => "?").join(", ");
    const res = await this.db
      .prepare(
        `SELECT id, session_id, type, content, metadata, created_at
         FROM memories
         WHERE session_id = ? AND type IN (${placeholders})
         ORDER BY created_at DESC
         LIMIT ?`,
      )
      .bind(sessionId, ...types, limit)
      .all<MemoryD1Row>();

    return res.results.map((row) => this.memoryDocumentFromD1Row(row));
  }

  /**
   * 关键词模糊检索。
   */
  async findByKeyword(sessionId: string, query: string, limit: number): Promise<MemoryDocument[]> {
    const terms = query.split(/\s+/).filter(Boolean).slice(0, 5);
    if (terms.length === 0) return [];

    const conditions = terms.map(() => "content LIKE ?").join(" OR ");
    const bindings = terms.map((t) => `%${t}%`);

    const res = await this.db
      .prepare(
        `SELECT id, session_id, type, content, metadata, created_at
         FROM memories
         WHERE session_id = ? AND (${conditions})
         ORDER BY created_at DESC
         LIMIT ?`,
      )
      .bind(sessionId, ...bindings, limit)
      .all<MemoryD1Row>();

    return res.results.map((row) => this.memoryDocumentFromD1Row(row));
  }

  /**
   * 单条写入向量索引。
   */
  async insertVectorize(id: string, doc: MemoryDocument): Promise<void> {
    const vector = await this.embeddings.embedQuery(doc.content);
    await this.vectorize.upsert([
      {
        id,
        values: vector,
        metadata: this.vectorizeMetadataFromDocument(doc),
      },
    ]);
  }

  /**
   * 批量写入 D1 与 Vectorize。
   */
  async insertMemoryBatch(sessionId: string, docs: MemoryDocument[]): Promise<void> {
    if (docs.length === 0) return;

    const statements: D1PreparedStatement[] = [];
    const vectorTasks: Promise<void>[] = [];

    for (const doc of docs) {
      vectorTasks.push(this.insertVectorize(doc.id, doc));
      statements.push(
        this.db
          .prepare(
            "INSERT OR REPLACE INTO memories (id, session_id, type, content, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          )
          .bind(
            doc.id,
            sessionId,
            doc.type,
            doc.content,
            JSON.stringify(doc.metadata),
            doc.created_at,
          ),
      );
    }

    await Promise.allSettled([this.db.batch(statements), ...vectorTasks]);
  }

  /**
   * 按会话删除 D1 中的记忆行。
   */
  async deleteBySessionId(sessionId: string): Promise<void> {
    await this.db.prepare(`DELETE FROM memories WHERE session_id = ?`).bind(sessionId).run();
  }

  /** 将 D1 行转为领域文档，metadata JSON 解析失败时使用显式兜底对象。 */
  private memoryDocumentFromD1Row(row: MemoryD1Row): MemoryDocument {
    const metadata = this.parseMetadataJson(row.metadata, {
      sessionId: row.session_id,
      type: row.type,
      content: row.content,
      created_at: row.created_at,
    });

    return {
      id: row.id,
      type: row.type,
      content: row.content,
      metadata,
      created_at: row.created_at,
    };
  }

  /** 解析 D1 / 历史遗留 JSON；失败时返回完整兜底的 MemoryMetadata。 */
  private parseMetadataJson(raw: string, fallback: MemoryMetadata): MemoryMetadata {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object") return fallback;
      return { ...fallback, ...(parsed as MemoryMetadata) };
    } catch {
      return fallback;
    }
  }

  /**
   * Vectorize 元数据多为扁平字符串，归一化为 MemoryMetadata。
   */
  private memoryDocumentFromVectorizeMatch(item: VectorizeMatch): MemoryDocument | null {
    const raw = item.metadata;
    if (!raw) return null;

    const m = this.flattenVectorizeMetadata(raw);
    const sessionId = this.coerceString(m.sessionId);
    const typeParsed = memoryTypeSchema.safeParse(
      Array.isArray(m.type) ? m.type[0] : m.type,
    );
    const content = this.coerceString(m.content);
    const created_at = this.coerceNumber(m.created_at);

    if (!sessionId || !typeParsed.success || !content || created_at === undefined) return null;

    const type = typeParsed.data;

    const metadata: MemoryMetadata = {
      sessionId,
      type,
      content,
      created_at,
    };

    const reply = this.coerceOptionalString(m.reply);
    const message = this.coerceOptionalString(m.message);
    if (reply !== undefined) metadata.reply = reply;
    if (message !== undefined) metadata.message = message;

    return {
      id: item.id,
      type,
      content,
      metadata,
      created_at,
      score: item.score,
    };
  }

  /** 将 Vectorize 嵌套 metadata 摊平为 string / number 便于读取 */
  private flattenVectorizeMetadata(
    raw: Record<string, VectorizeVectorMetadata>,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(raw)) {
      if (Array.isArray(val)) out[key] = val.join(",");
      else out[key] = val;
    }
    return out;
  }

  private vectorizeMetadataFromDocument(doc: MemoryDocument): Record<string, string | number | boolean> {
    const flat: Record<string, string | number | boolean> = {
      sessionId: doc.metadata.sessionId,
      type: doc.metadata.type,
      content: doc.metadata.content,
      created_at: doc.metadata.created_at,
    };
    if (doc.metadata.reply !== undefined) flat.reply = doc.metadata.reply;
    if (doc.metadata.message !== undefined) flat.message = doc.metadata.message;
    return flat;
  }

  private coerceString(v: unknown): string | undefined {
    if (v === null || v === undefined) return undefined;
    return String(v);
  }

  private coerceOptionalString(v: unknown): string | undefined {
    if (v === null || v === undefined) return undefined;
    const s = String(v);
    return s === "" ? undefined : s;
  }

  private coerceNumber(v: unknown): number | undefined {
    if (v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
}
