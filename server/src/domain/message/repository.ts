import { Env } from "@/index";
import { Message } from "./schema";

/**
 * 消息仓库：封装 D1 读写，对外只暴露领域类型。
 */
export class MessageRepository {
  constructor(private readonly db: Env["DB"]) {}

  /** 插入单条消息 */
  async insert(message: Message): Promise<void> {
    await this.db
      .prepare(
        "INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(message.id, message.session_id, message.role, message.content, message.created_at)
      .run();
  }

  /** 批量插入 */
  async insertBatch(messages: Message[]): Promise<void> {
    if (messages.length === 0) return;

    const segments = messages.map((message) =>
      this.db
        .prepare(
          "INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(message.id, message.session_id, message.role, message.content, message.created_at),
    );

    await this.db.batch(segments);
  }

  /** 按会话删除全部消息 */
  async deleteBySessionId(sessionId: string): Promise<void> {
    await this.db.prepare("DELETE FROM messages WHERE session_id = ?").bind(sessionId).run();
  }

  /** 查询会话下全部消息 */
  async findBySessionId(sessionId: string): Promise<Message[]> {
    const res = await this.db
      .prepare(
        "SELECT id, session_id, role, content, created_at FROM messages WHERE session_id = ?",
      )
      .bind(sessionId)
      .all<Message>();

    return res.results;
  }

  /** 分页查询会话消息（按创建时间倒序） */
  async findBySessionIdPage(sessionId: string, page: number, pageSize: number): Promise<Message[]> {
    const res = await this.db
      .prepare(
        "SELECT id, session_id, role, content, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC LIMIT ? OFFSET ?",
      )
      .bind(sessionId, pageSize, (page - 1) * pageSize)
      .all<Message>();

    return res.results;
  }
}
