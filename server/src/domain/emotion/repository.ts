import { Env } from "@/index";
import { emotionContextSchema, type EmotionContext } from "./schema";

/**
 * 情绪仓库：封装 KV 读写与序列化，对外只暴露领域类型。
 */
export class EmotionRepository {
  constructor(private readonly kv: Env["KV"]) {}

  /** 按会话读取情绪快照；数据损坏时清理并返回 null */
  async findById(sessionId: string): Promise<EmotionContext | null> {
    const raw = await this.kv.get(`emotion:${sessionId}`);
    if (!raw) return null;

    try {
      const parsed: unknown = JSON.parse(raw);
      const result = emotionContextSchema.safeParse(parsed);
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

  /** 写入情绪快照 */
  async insert(sessionId: string, ctx: EmotionContext): Promise<void> {
    await this.kv.put(`emotion:${sessionId}`, JSON.stringify(ctx), {
      expirationTtl: 60 * 60 * 24 * 30,
    });
  }

  /** 删除情绪快照 */
  async deleteById(sessionId: string): Promise<void> {
    await this.kv.delete(`emotion:${sessionId}`);
  }
}
