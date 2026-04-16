import { ChatStateType, NodeResultType } from "../state";
import { ChatConfigType } from "../config";
import { getAppCtx } from "../util";

/**
 * 合并上下文：会话上下文、用户配置、情绪
 */
export async function hydrateContextNode(
  state: ChatStateType,
  config: ChatConfigType,
): Promise<NodeResultType> {
  const appCtx = getAppCtx(config);

  const [context, user, emotion] = await Promise.allSettled([
    appCtx.contextService.getContext(state.sessionId),
    appCtx.userService.getUserById(state.userId),
    appCtx.emotionService.applyDecay(state.sessionId),
  ]);

  const res: NodeResultType = {};

  if (context.status === "fulfilled") res.context = context.value;
  if (user.status === "fulfilled") res.userProfile = user.value;
  if (emotion.status === "fulfilled") res.emotion = emotion.value;

  return res;
}
