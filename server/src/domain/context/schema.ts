import { z } from "zod";
import { messageSchema } from "../message/schema";

export const contextSchema = z.object({
  sessionId: z.string().describe("会话ID"),
  messages: z.array(messageSchema).describe("消息列表"),
});
export type Context = z.infer<typeof contextSchema>;
