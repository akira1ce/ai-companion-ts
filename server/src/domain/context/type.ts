import { MessageDto } from "../message/schema";

export interface Context {
  sessionId: string;
  messages: MessageDto[];
}
