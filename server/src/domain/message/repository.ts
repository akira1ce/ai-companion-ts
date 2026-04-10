import { Env } from "@/index";
import { MessageDto } from "./type";

/** 消息仓库 */
export class MessageRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 创建消息 */
  async insert(message: MessageDto) {
    return this.db
      .prepare(
        "INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(message.id, message.session_id, message.role, message.content, message.created_at)
      .run();
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

    return this.db.batch<MessageDto>(segments);
  }

  /** 删除消息 */
  async deleteById(sessionId: string) {
    return this.db.prepare("DELETE FROM messages WHERE session_id = ?").bind(sessionId).run();
  }

  /** 获取会话消息 */
  async findBySessionId(sessionId: string) {
    return this.db
      .prepare("SELECT * FROM messages WHERE session_id = ?")
      .bind(sessionId)
      .all<MessageDto>();
  }

  async findBySessionIdPage(sessionId: string, page: number, pageSize: number) {
    return this.db
      .prepare(
        "SELECT * FROM messages WHERE session_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      )
      .bind(sessionId, pageSize, (page - 1) * pageSize)
      .all<MessageDto>();
  }
}
