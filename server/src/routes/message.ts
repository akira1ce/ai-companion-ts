import { Env } from "@/index";
import { MessageService } from "@/domain/message/service";
import { MessageRepository } from "@/domain/message/repository";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

/** 分页获取会话消息（按创建时间倒序） */
app.get("/:sessionId", async (c) => {
  const sessionId = c.req.param("sessionId");
  const page = Number(c.req.query("page") ?? "1");
  const pageSize = Number(c.req.query("pageSize") ?? "20");

  if (page < 1 || pageSize < 1 || pageSize > 100) {
    return c.json({ error: "Invalid pagination params" }, 400);
  }

  const messageService = new MessageService(new MessageRepository(c.env.DB));
  const messages = await messageService.getMessagesBySessionPage(sessionId, page, pageSize);
  return c.json({ data: messages });
});

export default app;
