import { UserRepository } from "@/domain/user/repository";
import { UserService } from "@/domain/user/service";
import { Env } from "@/index";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  const userService = new UserService(new UserRepository(c.env.DB));
  return c.json({ message: "Hello, World!" });
});

export default app;
