import { ChatConfigType } from "../config";
import { ChatStateType, NodeResultType } from "../state";
import { getAppCtx } from "../util";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function buildReplyNode(
  state: ChatStateType,
  config: ChatConfigType,
): Promise<NodeResultType> {
  const appCtx = getAppCtx(config);

  const { systemPrompt } = state;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{message}"],
  ]);

  const chain = prompt.pipe(appCtx.model);

  const res = await chain.invoke({ message: state.message });

  return { reply: String(res.content) };
}
