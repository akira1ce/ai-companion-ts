import { z } from "zod";

export const messageSchema = z.object({
  id: z.string().describe("消息ID"),
  session_id: z.string().describe("会话ID"),
  role: z.enum(["user", "assistant", "system", "tool"]).describe("消息角色"),
  content: z.string().describe("消息内容"),
  created_at: z.number().describe("创建时间"),
});
export type MessageDto = z.infer<typeof messageSchema>;
