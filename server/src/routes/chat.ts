import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "@/type";
import { ok, validationHook } from "@/lib/response";
import { createAppCtx } from "@/lib/create-app-ctx";
import { ChatGraph } from "@/agent/chat/graph";
import { ChatStateType } from "@/agent/chat/state";
import { Message } from "@/domain/message/schema";

const chatBody = z.object({
  userId: z.string(),
  sessionId: z.string(),
  companionId: z.string(),
  message: z.string().min(1),
});

const app = new Hono<AppEnv>();

app.post("/", zValidator("json", chatBody, validationHook), async (c) => {
  const { userId, sessionId, companionId, message } = c.req.valid("json");
  const appCtx = createAppCtx(c.env, c.executionCtx);

  const initialState: Partial<ChatStateType> = {
    userId,
    sessionId,
    companionId,
    message,
    reply: "",
    emotionEvent: null,
    memories: [],
    systemPrompt: "",
    shouldRetrieveMemory: true,
    shouldExtractMemory: true,
  };

  const result = await ChatGraph.invoke(initialState, {
    configurable: { appCtx },
  });

  const now = Date.now();
  const messages: Message[] = [
    {
      id: crypto.randomUUID(),
      session_id: sessionId,
      role: "user",
      content: message,
      created_at: now,
    },
    {
      id: crypto.randomUUID(),
      session_id: sessionId,
      role: "assistant",
      content: result.reply,
      created_at: now + 1,
    },
  ];
  await appCtx.messageService.appendMessages(messages);

  return ok(c, {
    reply: result.reply,
    emotion: result.emotion
      ? {
          state: result.emotion.state,
          intensity: result.emotion.intensity,
          intimacy: result.emotion.intimacy,
        }
      : null,
  });
});

export default app;
