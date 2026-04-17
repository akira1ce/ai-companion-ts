import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppEnv } from "@/type";
import { NotFoundException, UnauthorizedException } from "@/type";
import { ok, validationHook } from "@/lib/response";
import { UserService } from "@/domain/user/service";
import { UserRepository } from "@/domain/user/repository";
import { createUserSchema } from "@/domain/user/schema";

const loginBody = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const app = new Hono<AppEnv>();

/** 登录 */
app.post("/login", zValidator("json", loginBody, validationHook), async (c) => {
  const { username, password } = c.req.valid("json");
  const userService = new UserService(new UserRepository(c.env.DB));

  try {
    const user = await userService.login(username, password);
    return ok(c, user);
  } catch (err) {
    throw new UnauthorizedException("Invalid username or password", err);
  }
});

/** 创建用户 */
app.post("/", zValidator("json", createUserSchema, validationHook), async (c) => {
  const data = c.req.valid("json");
  const userService = new UserService(new UserRepository(c.env.DB));
  await userService.createUser(data);
  return ok(c, { success: true }, 201);
});

/** 获取用户信息 */
app.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const userService = new UserService(new UserRepository(c.env.DB));

  try {
    const user = await userService.getUserById(userId);
    return ok(c, user);
  } catch (err) {
    throw new NotFoundException("User", err);
  }
});

/** 更新用户信息 */
app.put("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const body = await c.req.json();
  const userService = new UserService(new UserRepository(c.env.DB));

  try {
    await userService.updateUser({ ...body, id: userId });
    return ok(c, { success: true });
  } catch (err) {
    throw new NotFoundException("User", err);
  }
});

export default app;
