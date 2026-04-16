import { UserRepository } from "./repository";
import { CreateUserInput, User } from "./schema";

/**
 * 用户领域服务：编排创建、更新、删除与查询，不涉及存储细节。
 */
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  /** 创建用户 */
  async createUser(userProfile: CreateUserInput): Promise<void> {
    const user: User = {
      ...userProfile,
      id: crypto.randomUUID(),
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await this.repo.insert(user);
  }

  /** 更新用户 */
  async updateUser(payload: User): Promise<void> {
    const existing = await this.repo.findById(payload.id);
    if (!existing) throw new Error("[UserService.updateUser]: User not found");
    await this.repo.update({ ...payload, updated_at: Date.now() });
  }

  /** 删除用户 */
  async deleteUser(userId: string): Promise<void> {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error(`[UserService.deleteUser]: User not found`);
    await this.repo.deleteById(userId);
  }

  /** 获取用户信息 */
  async getUserById(userId: string): Promise<User> {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error("[UserService.getUserById]: User not found");
    return user;
  }

  /** 登录：按用户名查找并校验密码 */
  async login(username: string, password: string): Promise<User> {
    const user = await this.repo.findByUsername(username);
    if (!user) throw new Error("[UserService.login]: User not found");
    if (user.password !== password) throw new Error("[UserService.login]: Invalid password");
    return user;
  }
}
