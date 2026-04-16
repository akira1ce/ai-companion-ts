import { MemoryRepository } from "./repository";
import { MemoryDocument, RetrieveQuery } from "./schema";

/** 融合权重 */
export interface FusionWeights {
  semantic: number;
  structured: number;
  summary: number;
  keyword: number;
}

const DEFAULT_WEIGHTS: FusionWeights = {
  semantic: 0.35,
  structured: 0.3,
  summary: 0.2,
  keyword: 0.15,
};

/**
 * 记忆领域服务：多通道检索融合与写入编排，不涉及存储序列化细节。
 */
export class MemoryService {
  constructor(
    private readonly repo: MemoryRepository,
    private readonly weights: FusionWeights = DEFAULT_WEIGHTS,
  ) {}

  /** 写入记忆 */
  async write(sessionId: string, docs: MemoryDocument[]): Promise<void> {
    await this.repo.insertMemoryBatch(sessionId, docs);
  }

  /**
   * 四通道检索并融合：语义 + 结构化 + 摘要 + 关键词。
   */
  async retrieve(query: RetrieveQuery): Promise<MemoryDocument[]> {
    const [semantic, structured, summary, keyword] = await Promise.allSettled([
      this.semanticChannel(query),
      this.structuredChannel(query),
      this.summaryChannel(query),
      this.keywordChannel(query),
    ]);

    const results: Map<string, { doc: MemoryDocument; score: number }> = new Map();

    const merge = (docs: MemoryDocument[], weight: number): void => {
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
    return this.repo.findByVectorize(query.query, query.limit * 2);
  }

  /** 结构化检索（事件 + 关键词类型） */
  async structuredChannel(query: RetrieveQuery): Promise<MemoryDocument[]> {
    return this.repo.findByTypes(query.sessionId, ["event", "keyword"], query.limit * 2);
  }

  /** 摘要检索 */
  async summaryChannel(query: RetrieveQuery): Promise<MemoryDocument[]> {
    return this.repo.findByTypes(query.sessionId, ["summary"], query.limit * 2);
  }

  /** 关键词通道（与「结构化」类型部分重叠，保留为独立加权通道） */
  async keywordChannel(query: RetrieveQuery): Promise<MemoryDocument[]> {
    return this.repo.findByTypes(query.sessionId, ["keyword"], query.limit * 2);
  }
}
