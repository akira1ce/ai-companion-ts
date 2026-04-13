import { Env } from "@/index";
import { UserDto } from "./type";

/**
 * 用户仓库
 * 负责用户的读写操作 - d1 的读写
 */
export class UserRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 获取用户信息 */
  async findById(userId: string) {
    return this.db.prepare(`SELECT * FROM users WHERE id = ?`).bind(userId).first<UserDto>();
  }

  /** 创建用户 */
  async insert(user: UserDto) {
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
        JSON.stringify(user.interests),
        JSON.stringify(user.recent_events),
        Date.now(),
        Date.now(),
      )
      .run();
  }

  /** 更新用户信息 */
  async update(user: UserDto) {
    return this.db
      .prepare(
        `UPDATE users SET name = ?, username = ?, password = ?, occupation = ?, interests = ?, recent_events = ?, updated_at = ? WHERE id = ?`,
      )
      .bind(
        user.name,
        user.username,
        user.password,
        user.occupation,
        JSON.stringify(user.interests),
        JSON.stringify(user.recent_events),
        Date.now(),
        user.id,
      )
      .run();
  }

  /** 删除用户 */
  async deleteById(userId: string) {
    return this.db.prepare(`DELETE FROM users WHERE id = ?`).bind(userId).run();
  }
}
