import { SessionRepository } from "./repository";
import { SessionDto } from "./schema";

/**
 * 会话服务
 * 负责会话的创建、获取、删除等操作
 */
export class SessionService {
  constructor(private readonly repo: SessionRepository) {}

  /** 创建会话 */
  async createSession(companionId: string, userId: string) {
    const session: SessionDto = {
      id: crypto.randomUUID(),
      companion_id: companionId,
      user_id: userId,
      title: "",
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await this.repo.insert(session);
  }

  /** 获取用户会话 */
  async getSessionsByUserId(userId: string) {
    const { results } = await this.repo.findByUserId(userId);
    return results;
  }

  /** 获取用户会话分页 */
  async getSessionsByUserIdPage(userId: string, page: number, pageSize: number) {
    const { results } = await this.repo.findByUserIdPage(userId, page, pageSize);
    return results;
  }

  /** 删除会话 */
  async deleteSession(sessionId: string) {
    await this.repo.deleteById(sessionId);
  }
}
