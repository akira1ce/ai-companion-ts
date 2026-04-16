import { UserDto } from "@/domain/user/schema";

export function personaLayer(profile: UserDto): string {
  const interests = profile.interests ?? "未知";
  const occupation = profile.occupation ?? "未知";
  const events = profile.recent_events ?? "暂无";

  return [
    `【用户信息】`,
    `- 用户：${profile.name}`,
    `- 职业：${occupation}`,
    `- 兴趣：${interests}`,
    `- 近期事件：${events}`,
    "",
  ].join("\n");
}
