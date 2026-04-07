export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface MessageDto {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  created_at: number;
}
