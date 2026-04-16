import { ContextRepository } from "./repository";
import { Context } from "./schema";

/**
 * 上下文领域服务：编排读写，不涉及 KV 键名与序列化。
 */
export class ContextService {
  constructor(private readonly repo: ContextRepository) {}

  /** 获取会话上下文；不存在时返回空消息列表 */
  async getContext(sessionId: string): Promise<Context> {
    return (await this.repo.findById(sessionId)) ?? { sessionId, messages: [] };
  }

  /** 持久化上下文 */
  async insertContext(context: Context): Promise<void> {
    await this.repo.insert(context);
  }
}
