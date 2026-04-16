import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string().describe("会话ID"),
  companion_id: z.string().describe("伴侣ID"),
  user_id: z.string().describe("用户ID"),
  title: z.string().describe("会话标题"),
  created_at: z.number().describe("创建时间"),
  updated_at: z.number().describe("更新时间"),
});
export type Session = z.infer<typeof sessionSchema>;
