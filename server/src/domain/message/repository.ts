import { Env } from "@/index";
import { MessageDto } from "./type";

export class MessageRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 创建消息 */
  async insert(message: MessageDto) {
    return this.db
      .prepare(
        "INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(message.id, message.session_id, message.role, message.content, message.created_at)
      .all();
  }

  /** 批量创建消息 */
  async insertBatch(messages: MessageDto[]) {
    const segments = messages.map((message) => {
      return this.db
        .prepare(
          "INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(message.id, message.session_id, message.role, message.content, message.created_at);
    });

    return this.db.batch(segments);
  }

  /** 删除消息 */
  async delete(sessionId: string) {
    return this.db.prepare("DELETE FROM messages WHERE session_id = ?").bind(sessionId).all();
  }

  /** 获取会话消息 */
  async getBySession(sessionId: string) {
    return this.db
      .prepare("SELECT * FROM messages WHERE session_id = ?")
      .bind(sessionId)
      .all<MessageDto>();
  }

  async getBySessionPage(sessionId: string, page: number, pageSize: number) {
    return this.db
      .prepare(
        "SELECT * FROM messages WHERE session_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      )
      .bind(sessionId, pageSize, (page - 1) * pageSize)
      .all<MessageDto>();
  }
}
