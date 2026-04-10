import type { EmotionContext } from "./type";
import { Env } from "@/index";

/** 情绪仓库 */
export class EmotionRepository {
  constructor(private readonly kv: Env["KV"]) {}

  /** 获取情绪 */
  async findById(sessionId: string) {
    return await this.kv.get(`emotion:${sessionId}`);
  }

  /** 插入情绪 */
  async insert(sessionId: string, ctx: EmotionContext): Promise<void> {
    await this.kv.put(`emotion:${sessionId}`, JSON.stringify(ctx));
  }
}
