import { ChatStateType } from "../state";

/** 跳过检索记忆 */
export async function skipRetrieveMemoryNode(_state: ChatStateType) {
  return {
    memories: [],
  };
}
