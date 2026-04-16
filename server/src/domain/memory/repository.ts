import { Env } from "../..";
import { Embeddings } from "../../llm/embeddings";
import { MemoryDocument, MemoryDto, MemoryType } from "./schema";

/**
 * 记忆仓库
 * 负责记忆的读写操作 - d1 与 vectorize 的读写
 */
export class MemoryRepository {
  constructor(
    private readonly vectorize: Env["VECTORIZE"],
    private readonly db: Env["DB"],
    private readonly embeddings: Embeddings,
  ) {}

  /** 向量检索 */
  async findByVectorize(query: string, limit: number) {
    const vector = await this.embeddings.embedQuery(query);
    return this.vectorize.query(vector, { topK: limit, returnMetadata: "all" });
  }

  /** 类型检索 */
  async findByTypes(sessionId: string, types: MemoryType[], limit: number) {
    return this.db
      .prepare(
        `SELECT id, type, content, metadata, created_at
         FROM memories
         WHERE session_id = ? AND type IN (${types.map((type) => `'${type}'`).join(",")})
         ORDER BY created_at DESC
         LIMIT ?`,
      )
      .bind(sessionId, limit)
      .all<MemoryDto>();
  }

  /** 关键词全文检索 */
  async findByKeyword(sessionId: string, query: string, limit: number) {
    const terms = query.split(/\s+/).filter(Boolean).slice(0, 5);
    if (terms.length === 0) return [];

    const conditions = terms.map(() => "content LIKE ?").join(" OR ");
    const bindings = terms.map((t) => `%${t}%`);

    return this.db
      .prepare(
        `SELECT id, type, content, metadata, created_at
         FROM memories
         WHERE session_id = ? AND (${conditions})
         ORDER BY created_at DESC
         LIMIT ?`,
      )
      .bind(sessionId, ...bindings, limit)
      .all<MemoryDto>();
  }

  /** 单条写入向量 */
  async insertVectorize(id: string, doc: MemoryDocument) {
    const vector = await this.embeddings.embedQuery(doc.content);
    return this.vectorize.upsert([{ id, values: vector, metadata: { ...doc.metadata } }]);
  }

  /** 批量插入记忆 */
  async insertMemoryBatch(sessionId: string, docs: MemoryDocument[]) {
    const dbSegments: D1PreparedStatement[] = [];
    const promises: Promise<any>[] = [];
    docs.forEach(async (doc) => {
      promises.push(this.insertVectorize(doc.id, doc));
      dbSegments.push(
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
    });

    await Promise.allSettled([this.db.batch(dbSegments), ...promises]);
  }

  /** 删除记忆 */
  async deleteBySessionId(sessionId: string) {
    return this.db.prepare(`DELETE FROM memories WHERE session_id = ?`).bind(sessionId).all();
  }
}
