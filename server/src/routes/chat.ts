import { Env } from "@/index";
import { createAppCtx } from "@/lib/create-app-ctx";
import { ChatGraph } from "@/agent/chat/graph";
import { ChatStateType } from "@/agent/chat/state";
import { Message } from "@/domain/message/schema";
import { z } from "zod";
import { Hono } from "hono";

const chatBody = z.object({
  userId: z.string(),
  sessionId: z.string(),
  companionId: z.string(),
  message: z.string().min(1),
});

const app = new Hono<{ Bindings: Env }>();

app.post("/", async (c) => {
  const parsed = chatBody.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
  }

  const { userId, sessionId, companionId, message } = parsed.data;
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

  try {
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

    return c.json({
      data: {
        reply: result.reply,
        emotion: result.emotion
          ? {
              state: result.emotion.state,
              intensity: result.emotion.intensity,
              intimacy: result.emotion.intimacy,
            }
          : null,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: msg }, 500);
  }
});

export default app;
