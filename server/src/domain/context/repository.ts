import { Env } from "@/index";
import { Context, contextSchema } from "./schema";

/**
 * 上下文仓库：封装 KV 读写与序列化，对外只暴露领域类型。
 */
export class ContextRepository {
  constructor(private readonly kv: Env["KV"]) {}

  /** 按会话读取上下文；数据损坏时清理并返回 null */
  async findById(sessionId: string): Promise<Context | null> {
    const raw = await this.kv.get(`context:${sessionId}`);
    if (!raw) return null;

    try {
      const parsed: unknown = JSON.parse(raw);
      const result = contextSchema.safeParse(parsed);
      if (!result.success) {
        await this.deleteById(sessionId);
        return null;
      }
      return result.data;
    } catch {
      await this.deleteById(sessionId);
      return null;
    }
  }

  /** 写入会话上下文 */
  async insert(context: Context): Promise<void> {
    await this.kv.put(`context:${context.sessionId}`, JSON.stringify(context), {
      expirationTtl: 60 * 60 * 24 * 30,
    });
  }

  /** 删除会话上下文 */
  async deleteById(sessionId: string): Promise<void> {
    await this.kv.delete(`context:${sessionId}`);
  }
}
