import { ChatConfigType } from "../config";
import { ChatStateType, NodeResultType } from "../state";
import { getAppCtx } from "../util";

export async function retrieveMemoryNode(
  state: ChatStateType,
  config: ChatConfigType,
): Promise<NodeResultType> {
  const appCtx = getAppCtx(config);

  const memories = await appCtx.memoryService.retrieve({
    sessionId: state.sessionId,
    query: state.message,
    limit: 10,
  });

  return { memories };
}
