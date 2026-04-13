import { UserRepository } from "./repository";
import { UserDto, UserSchema } from "./type";
import { transformUserDto, transformUserSchema } from "./util";

/** 用户服务 */
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  /** 创建用户 */
  async createUser(userProfile: Omit<UserSchema, "id">) {
    const user: UserDto = transformUserDto({ ...userProfile, id: crypto.randomUUID() });
    await this.repo.insert(user);
  }

  /** 更新用户 */
  async updateUser(user: UserSchema) {
    const existingUser = await this.repo.findById(user.id);
    if (!existingUser) throw new Error("[UserService.updateUser]: User not found");
    await this.repo.update(transformUserDto(user));
  }

  /** 删除用户 */
  async deleteUser(userId: string) {
    const existingUser = await this.repo.findById(userId);
    if (!existingUser) throw new Error(`[UserService.deleteUser]: User not found`);
    await this.repo.deleteById(userId);
  }

  /** 获取用户信息 */
  async getUserById(userId: string): Promise<UserSchema> {
    const existingUser = await this.repo.findById(userId);
    if (!existingUser) throw new Error("[UserService.getUserById]: User not found");
    return transformUserSchema(existingUser);
  }
}
