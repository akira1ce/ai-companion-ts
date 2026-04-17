import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "@/type";
import { BusinessException } from "@/type";

export type { Env } from "@/type";
import companionRoutes from "@/routes/companion";
import sessionRoutes from "@/routes/session";
import chatRoutes from "@/routes/chat";
import messageRoutes from "@/routes/message";
import userRoutes from "@/routes/user";

const app = new Hono<AppEnv>();

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

app.get("/", (c) => c.json({ status: "ok", service: "ai-companion-api" }));

app.route("/api/companions", companionRoutes);
app.route("/api/sessions", sessionRoutes);
app.route("/api/chat", chatRoutes);
app.route("/api/messages", messageRoutes);
app.route("/api/users", userRoutes);

app.notFound((c) => {
  return c.json({ success: false, error: "Not Found", code: "NOT_FOUND" }, 404);
});

app.onError((err, c) => {
  if (err instanceof BusinessException) {
    return c.json({ success: false, error: err.message, code: err.code }, err.status);
  }

  if (err instanceof HTTPException) {
    return c.json({ success: false, error: err.message, code: "HTTP_ERROR" }, err.status);
  }

  console.error("Unhandled error:", err);
  return c.json({ success: false, error: "Internal Server Error", code: "INTERNAL_ERROR" }, 500);
});

export type AppType = typeof app;
export default app;
