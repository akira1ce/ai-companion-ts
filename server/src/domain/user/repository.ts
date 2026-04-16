import { Env } from "@/index";
import { User } from "./schema";

/**
 * 用户仓库：封装 D1 读写，对外只暴露领域类型。
 */
export class UserRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 按主键查询 */
  async findById(userId: string): Promise<User | null> {
    return this.db
      .prepare(
        `SELECT id, name, username, password, occupation, interests, recent_events, created_at, updated_at FROM users WHERE id = ?`,
      )
      .bind(userId)
      .first<User>();
  }

  /** 插入用户 */
  async insert(user: User): Promise<void> {
    await this.db
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
      .run();
  }

  /** 全量更新用户行 */
  async update(user: User): Promise<void> {
    await this.db
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
      .run();
  }

  /** 按用户名查询 */
  async findByUsername(username: string): Promise<User | null> {
    return this.db
      .prepare(
        `SELECT id, name, username, password, occupation, interests, recent_events, created_at, updated_at FROM users WHERE username = ?`,
      )
      .bind(username)
      .first<User>();
  }

  /** 按主键删除 */
  async deleteById(userId: string): Promise<void> {
    await this.db.prepare(`DELETE FROM users WHERE id = ?`).bind(userId).run();
  }
}
