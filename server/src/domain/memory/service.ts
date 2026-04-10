import { MemoryRepository } from "./repository";
import { MemoryDocument, MemoryMetadata, MemoryType, RetrieveQuery } from "./type";

/** 融合权重接口 */
export interface FusionWeights {
  semantic: number;
  structured: number;
  summary: number;
  keyword: number;
}

/** 默认融合权重 */
const DEFAULT_WEIGHTS: FusionWeights = {
  semantic: 0.35,
  structured: 0.3,
  summary: 0.2,
  keyword: 0.15,
};

export class MemoryService {
  constructor(
    private readonly repo: MemoryRepository,
    private readonly weights: FusionWeights = DEFAULT_WEIGHTS,
  ) {}

  /** 写入记忆 */
  async write(sessionId: string, docs: MemoryDocument[]) {
    await this.repo.insertMemoryBatch(sessionId, docs);
  }

  /**
   * 检索记忆
   * 四通道检索，融合结果： 语义检索 + 结构化检索 + 摘要检索 + 关键词检索
   */
  async retrieve(query: RetrieveQuery) {
    const [semantic, structured, summary, keyword] = await Promise.allSettled([
      this.semanticChannel(query),
      this.structuredChannel(query),
      this.summaryChannel(query),
      this.keywordChannel(query),
    ]);

    const results: Map<string, { doc: MemoryDocument; score: number }> = new Map();

    // 合并结果
    const merge = (docs: MemoryDocument[], weight: number) => {
      for (const doc of docs) {
        const base = doc.score ?? 0;
        const existing = results.get(doc.id);
        if (existing) {
          existing.score += base * weight;
        } else {
          results.set(doc.id, { doc, score: base * weight });
        }
      }
    };

    // 合并结果
    if (semantic.status === "fulfilled") merge(semantic.value, this.weights.semantic);
    if (structured.status === "fulfilled") merge(structured.value, this.weights.structured);
    if (summary.status === "fulfilled") merge(summary.value, this.weights.summary);
    if (keyword.status === "fulfilled") merge(keyword.value, this.weights.keyword);

    return [...results.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, query.limit)
      .map(({ doc, score }) => ({ ...doc, score }));
  }

  /** 语义检索 */
  async semanticChannel(query: RetrieveQuery): Promise<MemoryDocument[]> {
    const res = await this.repo.findByVectorize(query.query, query.limit * 2);

    return res.matches.map((item) => ({
      id: item.id,
      type: item.metadata?.type as MemoryType,
      content: String(item.metadata?.content),
      metadata: item.metadata as unknown as MemoryMetadata,
      created_at: Number(item.metadata?.created_at),
      score: item.score,
    }));
  }

  /** 结构化检索 */
  async structuredChannel(query: RetrieveQuery): Promise<MemoryDocument[]> {
    const { results } = await this.repo.findByTypes(
      query.sessionId,
      ["event", "keyword"],
      query.limit * 2,
    );

    return results.map((item) => ({
      id: item.id,
      type: item.type,
      content: item.content,
      metadata: JSON.parse(item.metadata || "{}") as MemoryMetadata,
      created_at: item.created_at,
    }));
  }

  /** 摘要检索 */
  async summaryChannel(query: RetrieveQuery): Promise<MemoryDocument[]> {
    const { results } = await this.repo.findByTypes(query.sessionId, ["summary"], query.limit * 2);

    return results.map((item) => ({
      id: item.id,
      type: item.type,
      content: item.content,
      metadata: JSON.parse(item.metadata || "{}") as MemoryMetadata,
      created_at: item.created_at,
    }));
  }
  /** 关键词检索 */
  async keywordChannel(query: RetrieveQuery): Promise<MemoryDocument[]> {
    const { results } = await this.repo.findByTypes(query.sessionId, ["keyword"], query.limit * 2);

    return results.map((item) => ({
      id: item.id,
      type: item.type,
      content: item.content,
      metadata: JSON.parse(item.metadata || "{}") as MemoryMetadata,
      created_at: item.created_at,
    }));
  }
}
