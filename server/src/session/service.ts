import { SessionRepository } from "./repository";

/**
 * 会话服务
 * 负责会话的创建、获取、删除等操作
 */
export class SessionService {
  constructor(private readonly repo: SessionRepository) {}

  /** 创建会话 */
  async createSession(companionId: string, userId: string) {
    const session = {
      id: crypto.randomUUID(),
      companion_id: companionId,
      user_id: userId,
      title: "",
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    return this.repo.create(session);
  }

  /** 获取用户会话 */
  async getSessionsByUserId(userId: string) {
    return this.repo.getByUserId(userId);
  }

  /** 获取用户会话分页 */
  async getSessionsByUserIdPage(userId: string, page: number, pageSize: number) {
    return this.repo.getByUserIdPage(userId, page, pageSize);
  }

  /** 删除会话 */
  async deleteSession(sessionId: string) {
    return this.repo.delete(sessionId);
  }
}
