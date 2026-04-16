/* 「controller」 */

import { apiGetUser, apiUpdateUser } from "@/services";
import type { UserProfile, ApiUpdateUserReq, ApiUser } from "@/types";

function parseUserProfile(data: ApiUser): UserProfile {
  return {
    id: data.id,
    name: data.name ?? "",
    username: data.username,
    occupation: data.occupation ?? "",
    interests: data.interests ? JSON.parse(data.interests) : [],
    recentEvents: data.recent_events ? JSON.parse(data.recent_events) : [],
  };
}

export async function getUser(userId: string): Promise<UserProfile> {
  const { data } = await apiGetUser(userId);
  return parseUserProfile(data);
}

export async function updateUser(
  userId: string,
  params: ApiUpdateUserReq,
): Promise<UserProfile> {
  await apiUpdateUser(userId, params);
  const { data } = await apiGetUser(userId);
  return parseUserProfile(data);
}
