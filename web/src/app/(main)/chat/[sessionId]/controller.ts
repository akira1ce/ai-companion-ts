/* 「controller」 */

import { apiGetMessages, apiSendMessage } from "@/services";
import type { ChatMessage, ApiChatReq, ApiEmotion } from "@/types";

export async function getMessages(
  sessionId: string,
  page = 1,
  pageSize = 50,
): Promise<ChatMessage[]> {
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
): Promise<{ reply: string; emotion: ApiEmotion | null }> {
  const { data } = await apiSendMessage(params);
  return data;
}
