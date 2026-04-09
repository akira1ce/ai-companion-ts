import { EmotionFSM } from "./utils/fsm";
import { IntimacySystem } from "./utils/intimacy";
import { applyDecay } from "./utils/decay";
import type { EmotionContext, EmotionEvent } from "./type";

export class EmotionService {
  private fsm = new EmotionFSM();
  private intimacy = new IntimacySystem();

  constructor(private kv: KVNamespace) {}

  async get(sessionId: string): Promise<EmotionContext> {
    const raw = await this.kv.get(`emotion:${sessionId}`);
    if (!raw) return EmotionFSM.initial();
    return JSON.parse(raw) as EmotionContext;
  }

  async save(sessionId: string, ctx: EmotionContext): Promise<void> {
    await this.kv.put(`emotion:${sessionId}`, JSON.stringify(ctx));
  }

  /**
   * 会话开始时调用，折算离线时间的衰减
   */
  async applyDecay(sessionId: string): Promise<EmotionContext> {
    const ctx = await this.get(sessionId);
    const decayed = applyDecay(ctx);
    await this.save(sessionId, decayed);
    return decayed;
  }

  /**
   * 收到用户消息后，触发情绪事件，更新状态和亲密度
   */
  async transition(sessionId: string, event: EmotionEvent): Promise<EmotionContext> {
    const ctx = await this.get(sessionId);
    const { context: next } = this.fsm.transition(ctx, event);

    // 根据转移后的情绪状态更新亲密度
    const newIntimacy = this.intimacy.updateFromEmotion(next.intimacy, next.state);

    const final: EmotionContext = { ...next, intimacy: newIntimacy };
    await this.save(sessionId, final);
    return final;
  }
}
