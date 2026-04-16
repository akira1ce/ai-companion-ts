import { SessionRepository } from "./repository";
import { Session } from "./schema";

/**
 * 会话领域服务：编排创建、查询与删除，不涉及存储细节。
 */
export class SessionService {
  constructor(private readonly repo: SessionRepository) {}

  /** 创建会话 */
  async createSession(companionId: string, userId: string): Promise<void> {
    const session: Session = {
      id: crypto.randomUUID(),
      companion_id: companionId,
      user_id: userId,
      title: "",
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await this.repo.insert(session);
  }

  /** 获取或创建会话（每个伴侣对每个用户仅一个会话） */
  async getOrCreateSession(companionId: string, userId: string): Promise<Session> {
    const existing = await this.repo.findByUserAndCompanion(userId, companionId);
    if (existing) return existing;

    const session: Session = {
      id: crypto.randomUUID(),
      companion_id: companionId,
      user_id: userId,
      title: "",
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await this.repo.insert(session);
    return session;
  }

  /** 获取用户下全部会话 */
  async getSessionsByUserId(userId: string): Promise<Session[]> {
    return this.repo.findByUserId(userId);
  }

  /** 分页获取用户会话 */
  async getSessionsByUserIdPage(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<Session[]> {
    return this.repo.findByUserIdPage(userId, page, pageSize);
  }

  /** 删除会话 */
  async deleteSession(sessionId: string): Promise<void> {
    await this.repo.deleteById(sessionId);
  }
}
