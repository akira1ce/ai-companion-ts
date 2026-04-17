/* 「controller」 */

import { apiGetMessages, apiSendMessage } from "./service";
import type { MessageSchema, ApiChatReq, EmotionDto } from "./type";

export async function getMessages(
  sessionId: string,
  page = 1,
  pageSize = 50,
): Promise<MessageSchema[]> {
  const { data } = await apiGetMessages({ sessionId, page, pageSize });
  return data.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: m.created_at,
  }));
}

export async function sendMessage(
  params: ApiChatReq,
): Promise<{ reply: string; emotion: EmotionDto | null }> {
  const { data } = await apiSendMessage(params);
  return data;
}
