import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "@/type";
import { ok, validationHook } from "@/lib/response";
import { MessageService } from "@/domain/message/service";
import { MessageRepository } from "@/domain/message/repository";

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const app = new Hono<AppEnv>();

/** 分页获取会话消息（按创建时间倒序） */
app.get("/:sessionId", zValidator("query", paginationQuery, validationHook), async (c) => {
  const sessionId = c.req.param("sessionId");
  const { page, pageSize } = c.req.valid("query");

  const messageService = new MessageService(new MessageRepository(c.env.DB));
  const messages = await messageService.getMessagesBySessionPage(sessionId, page, pageSize);
  return ok(c, messages);
});

export default app;
