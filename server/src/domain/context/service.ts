import { ContextRepository } from "./repository";
import { Context } from "./type";

/** 上下文服务 */
export class ContextService {
  constructor(private readonly repo: ContextRepository) {}

  /** 获取上下文 */
  async getContext(sessionId: string): Promise<Context> {
    const raw = await this.repo.findById(sessionId);
    return raw;
  }

  /** 插入上下文 */
  async insertContext(context: Context) {
    await this.repo.insert(context);
  }
}
