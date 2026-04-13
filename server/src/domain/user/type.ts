export interface UserDto {
  /** 用户ID */
  id: string;
  /** 用户名 */
  name: string;
  /** 账号 */
  username: string;
  /** 密码 */
  password: string;
  /** 职业 */
  occupation?: string;
  /** 兴趣 */
  interests?: string;
  /** 近期事件 */
  recent_events?: string;
  /** 创建时间 */
  created_at: number;
  /** 更新时间 */
  updated_at: number;
}

export interface UserSchema {
  /** 用户ID */
  id: string;
  /** 用户名 */
  name: string;
  /** 账号 */
  username: string;
  /** 密码 */
  password: string;
  /** 职业 */
  occupation?: string;
  /** 兴趣 */
  interests?: string[];
  /** 近期事件 */
  recent_events?: string[];
  /** 创建时间 */
  created_at: number;
  /** 更新时间 */
  updated_at: number;
}
