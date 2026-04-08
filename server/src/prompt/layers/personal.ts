import { UserProfile } from "@/domain/user/type";

export function personaLayer(profile: UserProfile): string {
  const interests = profile.interests?.join("、") ?? "未知";
  const occupation = profile.occupation ?? "未知";
  const events = profile.recent_events?.join("；") ?? "暂无";

  return [
    `【用户信息】`,
    `- 用户：${profile.name}`,
    `- 职业：${occupation}`,
    `- 兴趣：${interests}`,
    `- 近期事件：${events}`,
    "",
  ].join("\n");
}
