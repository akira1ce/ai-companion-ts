import { Env } from "../..";
import { SessionDto } from "./type";

/**
 * 会话仓库
 * 负责会话的读写操作 - d1 的读写
 */
export class SessionRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 创建会话 */
  async insert(session: SessionDto) {
    return await this.db
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

  /** 更新会话 */
  async update(session: SessionDto) {
    return await this.db
      .prepare("UPDATE sessions SET title = ?, updated_at = ? WHERE id = ?")
      .bind(session.title, session.updated_at, session.id)
      .run();
  }

  /** 删除会话 */
  async deleteById(id: string) {
    return await this.db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
  }

  /** 获取会话 */
  async findById(id: string) {
    return await this.db
      .prepare("SELECT * FROM sessions WHERE id = ?")
      .bind(id)
      .first<SessionDto>();
  }

  /** 获取用户会话 */
  async findByUserId(userId: string) {
    return await this.db
      .prepare("SELECT * FROM sessions WHERE user_id = ?")
      .bind(userId)
      .all<SessionDto>();
  }

  /** 获取用户会话分页 */
  async findByUserIdPage(userId: string, page: number, pageSize: number) {
    return await this.db
      .prepare("SELECT * FROM sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?")
      .bind(userId, pageSize, (page - 1) * pageSize)
      .all<SessionDto>();
  }
}
