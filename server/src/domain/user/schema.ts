import { z } from "zod";

export const userSchema = z.object({
  id: z.string().describe("用户ID"),
  name: z.string().describe("用户名").optional(),
  username: z.string().describe("账号"),
  password: z.string().describe("密码"),
  occupation: z.string().optional().describe("职业"),
  interests: z.string().optional().describe("兴趣"),
  recent_events: z.string().optional().describe("近期事件"),
  created_at: z.number().describe("创建时间"),
  updated_at: z.number().describe("更新时间"),
});
export type UserDto = z.infer<typeof userSchema>;

/** 创建用户 */
export const createUserSchema = userSchema.omit({ id: true, created_at: true, updated_at: true });
export type CreateUserInput = z.infer<typeof createUserSchema>;
