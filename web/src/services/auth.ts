/* 「service」 */

import { http } from "@/lib/request";
import type { ApiUser, ApiCreateUserReq } from "@/types";

export const apiLogin = (
  username: string,
  password: string,
): Promise<{ data: ApiUser }> => {
  return http.post<ApiUser>("/api/users/login", { username, password });
};

export const apiRegister = (
  params: ApiCreateUserReq,
): Promise<{ data: { success: boolean } }> => {
  return http.post("/api/users", params);
};
