/* 「controller」 */

import { apiGetUser, apiUpdateUser } from "./service";
import type { ApiUpdateUserReq, UserDto } from "./type";

export async function getUser(userId: string): Promise<UserDto> {
  const { data } = await apiGetUser(userId);
  return data;
}

export async function updateUser(params: ApiUpdateUserReq): Promise<UserDto> {
  await apiUpdateUser(params);
  const { data } = await apiGetUser(params.userId);
  return data;
}
