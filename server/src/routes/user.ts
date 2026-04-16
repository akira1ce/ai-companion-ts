import { Env } from "@/index";
import { UserService } from "@/domain/user/service";
import { UserRepository } from "@/domain/user/repository";
import { createUserSchema } from "@/domain/user/schema";
import { z } from "zod";
import { Hono } from "hono";

const loginBody = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const app = new Hono<{ Bindings: Env }>();

/** 登录 */
app.post("/login", async (c) => {
  const parsed = loginBody.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
  }

  const { username, password } = parsed.data;
  const userService = new UserService(new UserRepository(c.env.DB));

  try {
    const user = await userService.login(username, password);
    return c.json({ data: user });
  } catch {
    return c.json({ error: "Invalid username or password" }, 401);
  }
});

/** 创建用户 */
app.post("/", async (c) => {
  const parsed = createUserSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
  }

  const userService = new UserService(new UserRepository(c.env.DB));
  await userService.createUser(parsed.data);
  return c.json({ data: { success: true } }, 201);
});

/** 获取用户信息 */
app.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const userService = new UserService(new UserRepository(c.env.DB));

  try {
    const user = await userService.getUserById(userId);
    return c.json({ data: user });
  } catch {
    return c.json({ error: "User not found" }, 404);
  }
});

/** 更新用户信息 */
app.put("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const body = await c.req.json();
  const userService = new UserService(new UserRepository(c.env.DB));

  try {
    await userService.updateUser({ ...body, id: userId });
    return c.json({ data: { success: true } });
  } catch {
    return c.json({ error: "User not found" }, 404);
  }
});

export default app;
