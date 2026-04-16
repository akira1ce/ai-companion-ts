import { Env } from "@/index";
import { SessionService } from "@/domain/session/service";
import { SessionRepository } from "@/domain/session/repository";
import { MessageRepository } from "@/domain/message/repository";
import { MemoryRepository } from "@/domain/memory/repository";
import { EmotionRepository } from "@/domain/emotion/repository";
import { ContextRepository } from "@/domain/context/repository";
import { z } from "zod";
import { Hono } from "hono";

const createSessionBody = z.object({
  userId: z.string(),
  companionId: z.string(),
});

const app = new Hono<{ Bindings: Env }>();

/** 获取用户的全部会话 */
app.get("/", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) {
    return c.json({ error: "userId is required" }, 400);
  }

  const sessionService = new SessionService(new SessionRepository(c.env.DB));
  const sessions = await sessionService.getSessionsByUserId(userId);
  return c.json({ data: sessions });
});

/** 创建或获取会话（每伴侣仅一个） */
app.post("/", async (c) => {
  const parsed = createSessionBody.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
  }

  const { userId, companionId } = parsed.data;
  const sessionService = new SessionService(new SessionRepository(c.env.DB));
  const session = await sessionService.getOrCreateSession(companionId, userId);
  return c.json({ data: session });
});

/** 删除会话（级联清理消息、记忆、情绪、上下文） */
app.delete("/:sessionId", async (c) => {
  const sessionId = c.req.param("sessionId");

  const sessionService = new SessionService(new SessionRepository(c.env.DB));
  const messageRepo = new MessageRepository(c.env.DB);
  const memoryRepo = new MemoryRepository(c.env.VECTORIZE, c.env.DB, null!);
  const emotionRepo = new EmotionRepository(c.env.KV);
  const contextRepo = new ContextRepository(c.env.KV);

  await Promise.allSettled([
    sessionService.deleteSession(sessionId),
    messageRepo.deleteBySessionId(sessionId),
    memoryRepo.deleteBySessionId(sessionId),
    emotionRepo.deleteById(sessionId),
    contextRepo.deleteById(sessionId),
  ]);

  return c.json({ data: { success: true } });
});

export default app;
