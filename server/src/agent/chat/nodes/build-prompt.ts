import { assemblePrompt } from "@/prompt";
import { ChatConfigType } from "../config";
import { ChatStateType, NodeResultType } from "../state";

export async function buildPromptNode(
  state: ChatStateType,
  config: ChatConfigType,
): Promise<NodeResultType> {
  const prompt = assemblePrompt({
    companionId: state.companionId,
    userProfile: state.userProfile,
    emotion: state.emotion,
    memories: state.memories,
  });

  return { systemPrompt: prompt };
}
