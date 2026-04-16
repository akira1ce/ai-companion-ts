import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatConfigType } from "../config";
import { ChatStateType, NodeResultType } from "../state";
import { getAppCtx } from "../util";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { MemoryDocument } from "@/domain/memory/schema";

const extractMemoryPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    [
      "你是一个对话记忆抽取器，负责从对话中提取值得长期保存的记忆。",
      "优先提取以下信息：",
      "1. 用户明确提到的个人事实、偏好、经历。",
      "2. 用户主动提到的共同事件或共享回忆。",
      "3. 对后续聊天有复用价值的人物、地点、时间锚点、关键词。",
      "",
      "抽取原则：",
      "- 以用户明确表达的内容为主，不要凭空补充。",
      "- 用户直接陈述或主动提起的经历，可以视为可记录事实，不要求助手再次验证。",
      "- 纯寒暄、纯情绪附和、一次性指令，不要提取。",
      "- 如果一句话里既有可记忆信息，也有无关内容，只提取可记忆部分。",
      "",
      "记忆类型：",
      "- profile: 用户个人事实、偏好、经历。",
      "- event: 用户主动提到的共同事件或共享回忆。",
      "- fact: 用户明确提到的个人事实、偏好、经历。",
      "- summary: 用户主动提到的共同事件或共享回忆。",
      "- keyword: 用户主动提到的关键词。",
      "",
      '输出 JSON 数组，每项格式：{{"type":"<memory_type>","content":"..."}}',
      "没有可提取内容时输出 []。",
      "",
      "示例：",
      "用户：你还记得2月份的时候我带你去的迪士尼吗",
      "助手：哈哈记得啊，那天玩得好开心！",
      '输出：[{{"type":"event","content":"用户提到 2 月曾带助手去迪士尼。"}},{{"type":"keyword","content":"迪士尼"}}]',
    ].join("\n"),
  ],
  ["human", "对话记录：\n{conversation}\n\n请根据对话记录提取记忆。"],
]);

export async function extractMemoryNode(
  state: ChatStateType,
  config: ChatConfigType,
): Promise<NodeResultType> {
  const appCtx = getAppCtx(config);

  const { sessionId, reply, message } = state;

  const conversation = `user: ${message}\nassistant: ${reply}`;

  const chain = extractMemoryPrompt
    .pipe(appCtx.model)
    .pipe(new JsonOutputParser<MemoryDocument[]>());

  const res = await chain.invoke({ conversation });

  if (!Array.isArray(res)) return {};

  const docs: MemoryDocument[] = res
    .filter((m) => m.content?.trim())
    .map((m) => ({
      id: crypto.randomUUID(),
      type: m.type,
      content: m.content.trim(),
      metadata: {
        sessionId,
        type: m.type,
        content: m.content.trim(),
        created_at: Date.now(),
        reply,
        message,
      },
      created_at: Date.now(),
    }));

  appCtx.executionCtx.waitUntil(appCtx.memoryService.write(sessionId, docs));

  return {};
}
