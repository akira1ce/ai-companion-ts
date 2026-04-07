/** 记忆类型 */
export type MemoryType =
  | "profile" // user profile facts
  | "event" // D1 + Vectorize: life events
  | "fact" // D1: explicit facts
  | "summary" // D1: time-range summaries
  | "keyword"; // full-text index

export interface MemoryMetadata {
  sessionId: string;
  type: MemoryType;
  content: string;
  created_at: number;
}

/** 记忆文档 */
export interface MemoryDocument {
  id: string;
  type: MemoryType;
  content: string;
  metadata: MemoryMetadata;
  created_at: number;
  score?: number;
}

/** D1记忆数据 */
export interface MemoryDTO {
  id: string;
  type: MemoryType;
  content: string;
  metadata: string;
  created_at: number;
}

export interface RetrieveQuery {
  sessionId: string;
  query: string;
  limit: number;
}

export interface VectorizeMatch {
  id: string;
  type: MemoryType;
  content: string;
  metadata: MemoryMetadata;
  created_at: number;
}
