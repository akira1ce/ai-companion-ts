import { MessageRepository } from "./repository";
import { MessageDto } from "./type";

export class MessageService {
  constructor(private readonly repo: MessageRepository) {}

  appendMessages(messages: MessageDto[]) {
    return this.repo.insertBatch(messages);
  }

  getMessagesBySession(sessionId: string) {
    return this.repo.getBySession(sessionId);
  }

  getMessagesBySessionPage(sessionId: string, page: number, pageSize: number) {
    return this.repo.getBySessionPage(sessionId, page, pageSize);
  }
}
