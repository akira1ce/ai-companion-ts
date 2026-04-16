/* 「service」 */

import { http } from "@/lib/request";
import type { ApiChatReq, ApiChatRes } from "@/types";

export const apiSendMessage = (params: ApiChatReq): Promise<ApiChatRes> => {
  return http.post<ApiChatRes["data"]>("/api/chat", params);
};
