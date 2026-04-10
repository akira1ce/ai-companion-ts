import { ChatStateType } from "../state";

/** 跳过提取记忆 */
export async function skipExtractMemoryNode(_state: ChatStateType) {
  return {};
}
