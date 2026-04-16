/* 「service」 */

import { http } from "@/lib/request";
import type { ApiUser, ApiLoginReq, ApiCreateUserReq } from "@/types";

export const apiLogin = (params: ApiLoginReq): Promise<{ data: ApiUser }> => {
  return http.post<ApiUser>("/api/users/login", params);
};

export const apiRegister = (
  params: ApiCreateUserReq,
): Promise<{ data: { success: boolean } }> => {
  return http.post("/api/users", params);
};
