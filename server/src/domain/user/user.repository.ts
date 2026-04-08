import { Env } from "@/index";
import { UserProfile } from "./type";

/**
 * 用户仓库
 * 负责用户的读写操作 - d1 的读写
 */
export class UserRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 获取用户信息 */
  async get(userId: string) {
    return this.db.prepare(`SELECT * FROM users WHERE id = ?`).bind(userId).all<UserProfile>();
  }

  /** 创建用户 */
  async create(user: UserProfile) {
    return this.db
      .prepare(
        `INSERT INTO users (id, name, username, password, occupation, interests, recent_events, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        user.id,
        user.name,
        user.username,
        user.password,
        user.occupation,
        user.interests,
        user.recent_events,
        user.created_at,
        user.updated_at,
      )
      .all();
  }

  /** 更新用户信息 */
  async update(user: UserProfile) {
    return this.db
      .prepare(
        `UPDATE users SET name = ?, username = ?, password = ?, occupation = ?, interests = ?, recent_events = ?, updated_at = ? WHERE id = ?`,
      )
      .bind(
        user.name,
        user.username,
        user.password,
        user.occupation,
        user.interests,
        user.recent_events,
        user.updated_at,
        user.id,
      )
      .all();
  }

  /** 删除用户 */
  async delete(userId: string) {
    return this.db.prepare(`DELETE FROM users WHERE id = ?`).bind(userId).all();
  }
}
