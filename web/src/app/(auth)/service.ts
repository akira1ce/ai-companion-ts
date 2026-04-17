/* 「service」 */

import { http } from "@/lib/request";
import type { ApiLoginReq } from "./type";
import type { UserDto, ApiCreateUserReq } from "@/app/(main)/settings/type";

export const apiLogin = (params: ApiLoginReq): Promise<{ data: UserDto }> => {
  return http.post<UserDto>("/api/users/login", params);
};

export const apiRegister = (params: ApiCreateUserReq): Promise<{ data: { success: boolean } }> => {
  return http.post("/api/users", params);
};
