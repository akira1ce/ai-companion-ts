import { z } from "zod";

export const memoryTypeSchema = z.enum([
  "profile",
  "event",
  "fact",
  "summary",
  "keyword",
]);
export type MemoryType = z.infer<typeof memoryTypeSchema>;

export const memoryMetadataSchema = z
  .object({
    sessionId: z.string().describe("会话ID"),
    type: memoryTypeSchema,
    content: z.string().describe("内容"),
    created_at: z.number().describe("创建时间"),
  })
  .describe("记忆元数据");
export type MemoryMetadata = z.infer<typeof memoryMetadataSchema>;

export const memoryDocumentSchema = z.object({
  id: z.string().describe("记忆ID"),
  type: memoryTypeSchema,
  content: z.string().describe("内容"),
  metadata: memoryMetadataSchema,
  created_at: z.number().describe("创建时间"),
  score: z.number().optional().describe("相关性分数"),
});
export type MemoryDocument = z.infer<typeof memoryDocumentSchema>;

export const memoryDtoSchema = z.object({
  id: z.string().describe("记忆ID"),
  type: memoryTypeSchema,
  content: z.string().describe("内容"),
  metadata: z.string().describe("元数据 JSON 字符串"),
  created_at: z.number().describe("创建时间"),
});
export type MemoryDto = z.infer<typeof memoryDtoSchema>;

export const retrieveQuerySchema = z.object({
  sessionId: z.string().describe("会话ID"),
  query: z.string().describe("检索查询"),
  limit: z.number().describe("条数上限"),
});
export type RetrieveQuery = z.infer<typeof retrieveQuerySchema>;

export const vectorizeMatchSchema = z.object({
  id: z.string().describe("向量 ID"),
  type: memoryTypeSchema,
  content: z.string().describe("内容"),
  metadata: memoryMetadataSchema,
  created_at: z.number().describe("创建时间"),
});
export type VectorizeMatch = z.infer<typeof vectorizeMatchSchema>;
