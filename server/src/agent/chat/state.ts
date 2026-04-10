import { Context } from "@/domain/context/type";
import { EmotionContext } from "@/domain/emotion/type";
import { MemoryDocument } from "@/domain/memory/type";
import { UserProfile } from "@/domain/user/type";
import { Annotation } from "@langchain/langgraph";

/** 聊天图状态 */
export const ChatState = Annotation.Root({
  userId: Annotation<string>,
  sessionId: Annotation<string>,
  companionId: Annotation<number>,
  /** 消息 */
  message: Annotation<string>,

  /** 情绪 */
  emotion: Annotation<EmotionContext | undefined>({
    value: (_current, update) => update,
    default: () => undefined,
  }),

  /** 用户配置 */
  userProfile: Annotation<UserProfile | undefined>({
    value: (_current, update) => update,
    default: () => undefined,
  }),

  /** 上下文 */
  context: Annotation<Context | undefined>({
    value: (_current, update) => update,
    default: () => undefined,
  }),

  /** 记忆 */
  memories: Annotation<MemoryDocument[]>({
    value: (_current, update) => update,
    default: () => [],
  }),

  /** 系统提示词 */
  systemPrompt: Annotation<string | undefined>({
    value: (_current, update) => update,
    default: () => undefined,
  }),

  /** 是否检索记忆 */
  shouldRetrieveMemory: Annotation<boolean>({
    value: (_current, update) => update,
    default: () => true,
  }),

  /** 是否提取记忆 */
  shouldExtractMemory: Annotation<boolean>({
    value: (_current, update) => update,
    default: () => true,
  }),
});

export type ChatStateType = typeof ChatState.State;

export type NodeResultType = Partial<ChatStateType>;
