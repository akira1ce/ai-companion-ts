import { PromptContext } from "./type";
import { safetyLayer } from "./layers/safety";
import { companionLayer } from "./layers/companion";
import { emotionLayer } from "./layers/emotion";
import { memoryLayer } from "./layers/memory";
import { personaLayer } from "./layers/personal";

/**
 * 运行时组装四层 System Prompt:
 * 安全层 → 伴侣层 → 人设层 → 情绪层 → 记忆层
 */
export function assemblePrompt(ctx: PromptContext) {
  return [
    safetyLayer(),
    companionLayer(ctx.companionId, ctx.userProfile),
    personaLayer(ctx.userProfile),
    emotionLayer(ctx.emotion),
    memoryLayer(ctx.memories),
  ]
    .filter(Boolean)
    .join("\n\n");
}
