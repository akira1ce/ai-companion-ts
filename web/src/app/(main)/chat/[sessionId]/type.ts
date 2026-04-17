/* 「service-type」 */

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface MessageDto {
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

export interface ApiChatReq {
  userId: string;
  sessionId: string;
  companionId: string;
  message: string;
}

export interface EmotionDto {
  state: string;
  intensity: number;
  intimacy: number;
}

export interface ApiChatRes {
  data: {
    reply: string;
    emotion: EmotionDto | null;
  };
}

/* 「controller-type」 */

export interface MessageSchema {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}
