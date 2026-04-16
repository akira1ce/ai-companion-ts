/* 「service-type」 */

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface ApiMessage {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  created_at: number;
}

export interface ApiGetMessagesReq {
  sessionId: string;
  page?: number;
  pageSize?: number;
}

export interface ApiMessageListRes {
  data: ApiMessage[];
}

/* 「controller-type」 */

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}
