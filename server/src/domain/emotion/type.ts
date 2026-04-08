export type EmotionState = "calm" | "happy" | "angry" | "sad" | "shy" | "jealous";

export interface EmotionContext {
  state: EmotionState;
  intensity: number; // 0-100
  intimacy: number; // 0-100
  updatedAt: number; // unix ms
  cooldownUntil?: number; // unix ms, debounce guard
}

export type EmotionEvent =
  | "praise"
  | "gift"
  | "ignored"
  | "argument"
  | "apology"
  | "confession"
  | "intimate"
  | "mention_other"
  | "comfort"
  | "neglect";
