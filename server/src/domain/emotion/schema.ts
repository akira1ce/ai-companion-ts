import { z } from "zod";

export const emotionStateSchema = z.enum([
  "calm",
  "happy",
  "angry",
  "sad",
  "shy",
  "jealous",
]);
export type EmotionState = z.infer<typeof emotionStateSchema>;

export const emotionContextSchema = z.object({
  state: emotionStateSchema.describe("当前情绪状态"),
  intensity: z.number().min(0).max(100).describe("强度 0–100"),
  intimacy: z.number().min(0).max(100).describe("亲密度 0–100"),
  updatedAt: z.number().describe("更新时间（unix ms）"),
  cooldownUntil: z.number().optional().describe("冷却截止时间（unix ms）"),
});
export type EmotionContext = z.infer<typeof emotionContextSchema>;

export const emotionEventSchema = z.enum([
  "praise",
  "gift",
  "ignored",
  "argument",
  "apology",
  "confession",
  "intimate",
  "mention_other",
  "comfort",
  "neglect",
]);
export type EmotionEvent = z.infer<typeof emotionEventSchema>;
