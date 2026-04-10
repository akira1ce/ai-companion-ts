import { ChatConfigType } from "../config";
import { ChatStateType, NodeResultType } from "../state";
import { getAppCtx } from "../util";

export async function updateEmotionNode(
  state: ChatStateType,
  config: ChatConfigType,
): Promise<NodeResultType> {
  const appCtx = getAppCtx(config);

  const { emotionEvent } = state;

  if (!emotionEvent) return {};

  const emotion = await appCtx.emotionService.transition(state.sessionId, emotionEvent);

  if (!emotion) return {};

  return { emotion };
}
