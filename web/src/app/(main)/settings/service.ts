/* 「service」 */

import { http } from "@/lib/request";
import type { UserDto, ApiCreateUserReq, ApiUpdateUserReq } from "./type";

export const apiCreateUser = (params: ApiCreateUserReq): Promise<{ data: { success: boolean } }> => {
  return http.post("/api/users", params);
};

export const apiGetUser = (userId: string): Promise<{ data: UserDto }> => {
  return http.get<UserDto>(`/api/users/${userId}`);
};

export const apiUpdateUser = (params: ApiUpdateUserReq): Promise<{ data: { success: boolean } }> => {
  const { userId, ...body } = params;
  return http.put(`/api/users/${userId}`, body);
};
