import { MessageRepository } from "./repository";
import { MessageDto } from "./schema";

/** 消息服务 */
export class MessageService {
  constructor(private readonly repo: MessageRepository) {}

  /** 批量插入消息 */
  async appendMessages(messages: MessageDto[]) {
    await this.repo.insertBatch(messages);
  }

  /** 获取会话消息 */
  async getMessagesBySession(sessionId: string) {
    const { results } = await this.repo.findBySessionId(sessionId);
    return results;
  }

  /** 获取会话消息分页 */
  async getMessagesBySessionPage(sessionId: string, page: number, pageSize: number) {
    const { results } = await this.repo.findBySessionIdPage(sessionId, page, pageSize);
    return results;
  }
}
