import { MemoryRepository } from "@/domain/memory/repository";
import { MemoryService } from "@/domain/memory/service";
import { Env } from "..";
import { createEmbeddings, Embeddings } from "@/llm/embeddings";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { createChatModel } from "@/llm/model";
import { createTracer } from "@/lib/tracing";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { MessageService } from "@/domain/message/service";
import { SessionService } from "@/domain/session/service";
import { SessionRepository } from "@/domain/session/repository";
import { MessageRepository } from "@/domain/message/repository";
import { EmotionService } from "@/domain/emotion/service";
import { ContextService } from "@/domain/context/service";
import { UserService } from "@/domain/user/service";
import { EmotionRepository } from "@/domain/emotion/repository";
import { ContextRepository } from "@/domain/context/repository";
import { UserRepository } from "@/domain/user/repository";

export interface AppCtx {
  /** 模型 */
  model: BaseChatModel;
  /** 嵌入模型 */
  embeddings: Embeddings;
  /** 执行上下文 */
  executionCtx: ExecutionContext;
  /** 记忆服务 */
  memoryService: MemoryService;
  /** 情绪服务 */
  emotionService: EmotionService;
  /** 消息服务 */
  messageService: MessageService;
  /** 会话服务 */
  sessionService: SessionService;
  /** 上下文服务 */
  contextService: ContextService;
  /** 用户服务 */
  userService: UserService;
}

/** 创建应用上下文 */
export function createAppCtx(env: Env, executionCtx: ExecutionContext): AppCtx {
  const { VECTORIZE, DB } = env;

  const model = createChatModel(env);
  const embeddings = createEmbeddings(env);
  const tracing = createTracer(env);
  /** langsmith 回调函数 */
  const callbacks: BaseCallbackHandler[] = tracing ? [tracing.tracer] : [];

  /* 记忆服务 */
  const memoryRepo = new MemoryRepository(VECTORIZE, DB, embeddings);
  const memoryService = new MemoryService(memoryRepo);

  /* 情绪服务 */
  const emotionRepo = new EmotionRepository(env.KV);
  const emotionService = new EmotionService(emotionRepo);

  /* 消息服务 */
  const messageRepo = new MessageRepository(DB);
  const messageService = new MessageService(messageRepo);

  /* 会话服务 */
  const sessionRepo = new SessionRepository(DB);
  const sessionService = new SessionService(sessionRepo);

  /* 上下文服务 */
  const contextRepo = new ContextRepository(env.KV);
  const contextService = new ContextService(contextRepo);

  /* 用户服务 */
  const userRepo = new UserRepository(DB);
  const userService = new UserService(userRepo);

  return {
    model,
    embeddings,
    executionCtx,
    memoryService,
    emotionService,
    messageService,
    sessionService,
    contextService,
    userService,
  };
}
