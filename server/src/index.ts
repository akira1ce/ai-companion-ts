import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import companionRoutes from "@/routes/companion";
import sessionRoutes from "@/routes/session";
import chatRoutes from "@/routes/chat";
import messageRoutes from "@/routes/message";
import userRoutes from "@/routes/user";

export type Env = {
  AI: Ai;
  KV: KVNamespace;
  DB: D1Database;
  VECTORIZE: VectorizeIndex;
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_BASE_URL: string;
  DEEPSEEK_MODEL: string;
  EMBEDDING_API_KEY: string;
  EMBEDDING_BASE_URL: string;
  LANGSMITH_API_KEY: string;
  LANGSMITH_PROJECT: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

app.get("/", (c) => c.json({ status: "ok", service: "ai-companion-api" }));

app.route("/api/companions", companionRoutes);
app.route("/api/sessions", sessionRoutes);
app.route("/api/chat", chatRoutes);
app.route("/api/messages", messageRoutes);
app.route("/api/users", userRoutes);

export type AppType = typeof app;
export default app;
