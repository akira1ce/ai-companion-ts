import { MessageRepository } from "./repository";
import { Message } from "./schema";

/**
 * 消息领域服务：编排读写，不涉及存储细节。
 */
export class MessageService {
  constructor(private readonly repo: MessageRepository) {}

  /** 批量追加消息 */
  async appendMessages(messages: Message[]): Promise<void> {
    await this.repo.insertBatch(messages);
  }

  /** 获取会话全部消息 */
  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return this.repo.findBySessionId(sessionId);
  }

  /** 分页获取会话消息 */
  async getMessagesBySessionPage(
    sessionId: string,
    page: number,
    pageSize: number,
  ): Promise<Message[]> {
    return this.repo.findBySessionIdPage(sessionId, page, pageSize);
  }
}
