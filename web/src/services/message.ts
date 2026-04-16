/* 「service」 */

import { http } from "@/lib/request";
import type { ApiMessage, ApiGetMessagesReq } from "@/types";

export const apiGetMessages = (
  params: ApiGetMessagesReq,
): Promise<{ data: ApiMessage[] }> => {
  const { sessionId, page = 1, pageSize = 20 } = params;
  return http.get<ApiMessage[]>(`/api/messages/${sessionId}`, {
    params: { page: String(page), pageSize: String(pageSize) },
  });
};
