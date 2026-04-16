import { Env } from "@/index";
import { Context } from "./type";

/** 上下文仓库 */
export class ContextRepository {
  constructor(private readonly kv: Env["KV"]) {}

  /** 获取上下文 */
  async findById(sessionId: string) {
    const raw = await this.kv.get(`context:${sessionId}`);
    return JSON.parse(raw ?? "{}") as Context;
  }

  /** 设置上下文 */
  async insert(context: Context) {
    await this.kv.put(`context:${context.sessionId}`, JSON.stringify(context), {
      expirationTtl: 60 * 60 * 24 * 30,
    });
  }

  /** 删除上下文 */
  async deleteById(sessionId: string) {
    await this.kv.delete(`context:${sessionId}`);
  }
}
