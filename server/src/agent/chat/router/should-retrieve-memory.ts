import { ChatStateType } from "../state";

/** 是否检索记忆 */
export function shouldRetrieveMemory(state: ChatStateType) {
  if (!state.shouldRetrieveMemory) return "skip";
  if (state.message.trim().length < 4) return "skip";
  return "retrieve";
}
