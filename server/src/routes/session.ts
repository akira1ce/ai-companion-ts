import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "@/type";
import { BusinessException } from "@/type";
import { ok, validationHook } from "@/lib/response";
import { SessionService } from "@/domain/session/service";
import { SessionRepository } from "@/domain/session/repository";
import { MessageRepository } from "@/domain/message/repository";
import { MemoryRepository } from "@/domain/memory/repository";
import { EmotionRepository } from "@/domain/emotion/repository";
import { ContextRepository } from "@/domain/context/repository";

const createSessionBody = z.object({
  userId: z.string(),
  companionId: z.string(),
});

const listSessionsQuery = z.object({
  userId: z.string().min(1),
});

const app = new Hono<AppEnv>();

/** 获取用户的全部会话 */
app.get("/", zValidator("query", listSessionsQuery, validationHook), async (c) => {
  const { userId } = c.req.valid("query");
  const sessionService = new SessionService(new SessionRepository(c.env.DB));
  const sessions = await sessionService.getSessionsByUserId(userId);
  return ok(c, sessions);
});

/** 创建或获取会话（每伴侣仅一个） */
app.post("/", zValidator("json", createSessionBody, validationHook), async (c) => {
  const { userId, companionId } = c.req.valid("json");
  const sessionService = new SessionService(new SessionRepository(c.env.DB));
  const session = await sessionService.getOrCreateSession(companionId, userId);
  return ok(c, session);
});

/** 删除会话（级联清理消息、记忆、情绪、上下文） */
app.delete("/:sessionId", async (c) => {
  const sessionId = c.req.param("sessionId");

  const sessionService = new SessionService(new SessionRepository(c.env.DB));
  const messageRepo = new MessageRepository(c.env.DB);
  const memoryRepo = new MemoryRepository(c.env.VECTORIZE, c.env.DB, null!);
  const emotionRepo = new EmotionRepository(c.env.KV);
  const contextRepo = new ContextRepository(c.env.KV);

  const results = await Promise.allSettled([
    sessionService.deleteSession(sessionId),
    messageRepo.deleteBySessionId(sessionId),
    memoryRepo.deleteBySessionId(sessionId),
    emotionRepo.deleteById(sessionId),
    contextRepo.deleteById(sessionId),
  ]);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length === results.length) {
    throw new BusinessException(500, { message: "Failed to delete session" });
  }

  return ok(c, { success: true });
});

export default app;
