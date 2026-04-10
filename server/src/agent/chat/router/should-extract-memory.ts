import { ChatStateType } from "../state";

/** 是否提取记忆 */
export function shouldExtractMemory(state: ChatStateType) {
  if (!state.shouldExtractMemory) return "skip";
  if (!state.reply?.trim()) return "skip";
  if (state.reply.trim().length < 4) return "skip";
  return "extract";
}
