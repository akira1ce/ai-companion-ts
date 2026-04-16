import { EmotionRepository } from "./repository";
import { EmotionContext, EmotionEvent } from "./schema";
import { calculateDecay } from "./utils/decay";
import { EmotionFSM } from "./utils/fsm";
import { IntimacySystem } from "./utils/intimacy";

/**
 * 情绪领域服务：FSM、亲密度与衰减编排，不涉及 KV 序列化。
 */
export class EmotionService {
  private fsm = new EmotionFSM();
  private intimacy = new IntimacySystem();

  constructor(private readonly repo: EmotionRepository) {}

  /** 获取情绪 */
  async getEmotion(sessionId: string): Promise<EmotionContext> {
    const ctx = await this.repo.findById(sessionId);
    if (!ctx) return EmotionFSM.initial();
    return ctx;
  }

  /** 折算离线时间的衰减 */
  async applyDecay(sessionId: string): Promise<EmotionContext> {
    const ctx = await this.repo.findById(sessionId);

    if (!ctx) throw new Error("[EmotionService.applyDecay]: Emotion not found");

    const decayed = calculateDecay(ctx);

    await this.repo.insert(sessionId, decayed);

    return decayed;
  }

  /** 收到用户消息后，触发情绪事件，更新状态和亲密度 */
  async transition(sessionId: string, event: EmotionEvent): Promise<EmotionContext> {
    const ctx = await this.repo.findById(sessionId);

    if (!ctx) throw new Error("[EmotionService.transition]: Emotion not found");

    const { context: next } = this.fsm.transition(ctx, event);

    const newIntimacy = this.intimacy.updateFromEmotion(next.intimacy, next.state);

    const final: EmotionContext = { ...next, intimacy: newIntimacy };
    await this.repo.insert(sessionId, final);

    return final;
  }
}
