import { ChatConfigType } from "../config";
import { ChatStateType } from "../state";
import { getAppCtx } from "../util";
import { NodeResultType } from "../state";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { EmotionEvent } from "@/domain/emotion/schema";

interface ClassifyEmotionOutput {
  event: EmotionEvent | null;
  confidence: number;
}

const systemPrompt = [
  "你是一个情绪事件分类器。",
  "",
  "任务：",
  `判断用户输入是否触发以下事件之一（只能选一个或 null）：praise, gift, ignored, argument, apology, confession, intimate, mention_other, comfort, neglect`,
  "",
  "事件定义：",
  "- praise: 夸奖、赞美 AI",
  "- gift: 送礼物、惊喜",
  "- ignored: 长时间不回复、冷落",
  "- argument: 吵架、激烈争论",
  "- apology: 道歉、认错",
  "- confession: 表白、说喜欢",
  "- intimate: 亲密互动（撒娇、牵手等）",
  "- mention_other: 提到其他异性",
  "- comfort: 安慰、鼓励 AI",
  "- neglect: 敷衍、不在意",
  "",
  "规则：",
  "- 只返回最主要的一个事件",
  "- 不确定时返回 event = null",
  "- confidence: 0-100",
  "",
  "输出格式：",
  `{{"event": "praise", "confidence": 100}}`,
].join("\n");

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["human", "{input}"],
]);

export async function classifyEmotionNode(
  state: ChatStateType,
  config: ChatConfigType,
): Promise<NodeResultType> {
  const appCtx = getAppCtx(config);

  const { message } = state;

  const chain = prompt.pipe(appCtx.model).pipe(new JsonOutputParser<ClassifyEmotionOutput>());

  const res = await chain.invoke({ input: message });

  if (!res) return {};

  const { event, confidence } = res;

  /* 置信度低于 60 或事件为 null 时，不返回情绪事件 */
  if (confidence < 60) return {};

  return { emotionEvent: event };
}
