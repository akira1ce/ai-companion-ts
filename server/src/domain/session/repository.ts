import { Env } from "../..";
import { SessionDto } from "./type";

/**
 * 会话仓库
 * 负责会话的读写操作 - d1 的读写
 */
export class SessionRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 创建会话 */
  async create(session: SessionDto) {
    return this.db
      .prepare(
        "INSERT INTO sessions (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(session.id, session.user_id, session.title, session.created_at, session.updated_at)
      .all();
  }

  /** 更新会话 */
  async update(session: SessionDto) {
    return this.db
      .prepare("UPDATE sessions SET title = ?, updated_at = ? WHERE id = ?")
      .bind(session.title, session.updated_at, session.id)
      .all();
  }

  /** 删除会话 */
  async delete(id: string) {
    return this.db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).all();
  }

  /** 获取会话 */
  async get(id: string) {
    return this.db.prepare("SELECT * FROM sessions WHERE id = ?").bind(id).all<SessionDto>();
  }

  /** 获取用户会话 */
  async getByUserId(userId: string) {
    return this.db
      .prepare("SELECT * FROM sessions WHERE user_id = ?")
      .bind(userId)
      .all<SessionDto>();
  }

  /** 获取用户会话分页 */
  async getByUserIdPage(userId: string, page: number, pageSize: number) {
    return this.db
      .prepare("SELECT * FROM sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?")
      .bind(userId, pageSize, (page - 1) * pageSize)
      .all<SessionDto>();
  }
}
