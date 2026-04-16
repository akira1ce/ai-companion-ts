/* 「service」 */

import { http } from "@/lib/request";
import type { ApiMessage } from "@/types";

export const apiGetMessages = (
  sessionId: string,
  page = 1,
  pageSize = 20,
): Promise<{ data: ApiMessage[] }> => {
  return http.get<ApiMessage[]>(`/api/messages/${sessionId}`, {
    params: { page: String(page), pageSize: String(pageSize) },
  });
};
