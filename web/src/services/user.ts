/* 「service」 */

import { http } from "@/lib/request";
import type { ApiUser, ApiCreateUserReq, ApiUpdateUserReq } from "@/types";

export const apiCreateUser = (params: ApiCreateUserReq): Promise<{ data: { success: boolean } }> => {
  return http.post("/api/users", params);
};

export const apiGetUser = (userId: string): Promise<{ data: ApiUser }> => {
  return http.get<ApiUser>(`/api/users/${userId}`);
};

export const apiUpdateUser = (params: ApiUpdateUserReq): Promise<{ data: { success: boolean } }> => {
  const { userId, ...body } = params;
  return http.put(`/api/users/${userId}`, body);
};
