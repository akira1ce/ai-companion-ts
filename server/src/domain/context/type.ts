import { MessageDto } from "../message/type";

export interface Context {
  sessionId: string;
  messages: MessageDto[];
}
