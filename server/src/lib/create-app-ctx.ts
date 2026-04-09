import { EmotionService } from "@/domain/emotion/service";
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
  const emotionService = new EmotionService(env.KV);

  /* 消息服务 */
  const messageRepo = new MessageRepository(DB);
  const messageService = new MessageService(messageRepo);

  /* 会话服务 */
  const sessionRepo = new SessionRepository(DB);
  const sessionService = new SessionService(sessionRepo);

  return {
    model,
    embeddings,
    executionCtx,
    memoryService,
    emotionService,
    messageService,
    sessionService,
  };
}
