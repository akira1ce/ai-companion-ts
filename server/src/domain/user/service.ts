import { UserRepository } from "./repository";
import { UserDto, CreateUserInput } from "./schema";

/** 用户服务 */
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  /** 创建用户 */
  async createUser(userProfile: CreateUserInput) {
    const user: UserDto = {
      ...userProfile,
      id: crypto.randomUUID(),
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    await this.repo.insert(user);
  }

  /** 更新用户 */
  async updateUser(payload: UserDto) {
    const user = await this.repo.findById(payload.id);
    if (!user) throw new Error("[UserService.updateUser]: User not found");
    await this.repo.update({ ...payload, updated_at: Date.now() });
  }

  /** 删除用户 */
  async deleteUser(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error(`[UserService.deleteUser]: User not found`);
    await this.repo.deleteById(userId);
  }

  /** 获取用户信息 */
  async getUserById(userId: string): Promise<UserDto> {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error("[UserService.getUserById]: User not found");
    return user;
  }
}
