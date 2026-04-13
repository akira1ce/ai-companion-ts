import { Context } from "@/domain/context/type";
import { EmotionContext, EmotionEvent } from "@/domain/emotion/type";
import { MemoryDocument } from "@/domain/memory/type";
import { UserSchema } from "@/domain/user/type";
import { Annotation } from "@langchain/langgraph";

/** 聊天图状态 */
export const ChatState = Annotation.Root({
  userId: Annotation<string>,
  sessionId: Annotation<string>,
  companionId: Annotation<string>,
  /** 消息 */
  message: Annotation<string>,
  /** 回复 */
  reply: Annotation<string>,
  /** 情绪事件 */
  emotionEvent: Annotation<EmotionEvent | null>,

  /** 情绪 */
  emotion: Annotation<EmotionContext>,
  /** 用户配置 */
  userProfile: Annotation<UserSchema>,
  /** 上下文 */
  context: Annotation<Context>,

  /** 记忆 */
  memories: Annotation<MemoryDocument[]>,
  /** 系统提示词 */
  systemPrompt: Annotation<string>,

  /** 是否检索记忆 */
  shouldRetrieveMemory: Annotation<boolean>,
  /** 是否提取记忆 */
  shouldExtractMemory: Annotation<boolean>,
});

export type ChatStateType = typeof ChatState.State;

export type NodeResultType = Partial<ChatStateType>;
