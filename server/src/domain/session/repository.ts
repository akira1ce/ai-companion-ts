import { Env } from "@/index";
import { Session } from "./schema";

/**
 * 会话仓库：封装 D1 读写，对外只暴露领域类型。
 */
export class SessionRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 插入会话 */
  async insert(session: Session): Promise<void> {
    await this.db
      .prepare(
        "INSERT INTO sessions (id, companion_id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(
        session.id,
        session.companion_id,
        session.user_id,
        session.title,
        session.created_at,
        session.updated_at,
      )
      .run();
  }

  /** 更新会话标题与更新时间 */
  async update(session: Session): Promise<void> {
    await this.db
      .prepare("UPDATE sessions SET title = ?, updated_at = ? WHERE id = ?")
      .bind(session.title, session.updated_at, session.id)
      .run();
  }

  /** 按主键删除 */
  async deleteById(id: string): Promise<void> {
    await this.db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
  }

  /** 按 ID 查询单条 */
  async findById(id: string): Promise<Session | null> {
    return this.db
      .prepare(
        "SELECT id, companion_id, user_id, title, created_at, updated_at FROM sessions WHERE id = ?",
      )
      .bind(id)
      .first<Session>();
  }

  /** 按用户查询全部会话 */
  async findByUserId(userId: string): Promise<Session[]> {
    const res = await this.db
      .prepare(
        "SELECT id, companion_id, user_id, title, created_at, updated_at FROM sessions WHERE user_id = ?",
      )
      .bind(userId)
      .all<Session>();

    return res.results;
  }

  /** 按用户分页查询（按更新时间倒序） */
  async findByUserIdPage(userId: string, page: number, pageSize: number): Promise<Session[]> {
    const res = await this.db
      .prepare(
        "SELECT id, companion_id, user_id, title, created_at, updated_at FROM sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?",
      )
      .bind(userId, pageSize, (page - 1) * pageSize)
      .all<Session>();

    return res.results;
  }
}
