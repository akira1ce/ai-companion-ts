/* 「service」 */

import { http } from "@/lib/request";
import type { ApiSession, ApiCreateSessionReq } from "@/types";

export const apiGetSessions = (userId: string): Promise<{ data: ApiSession[] }> => {
  return http.get<ApiSession[]>("/api/sessions", { params: { userId } });
};

export const apiCreateSession = (params: ApiCreateSessionReq): Promise<{ data: ApiSession }> => {
  return http.post<ApiSession>("/api/sessions", params);
};

export const apiDeleteSession = (sessionId: string): Promise<{ data: { success: boolean } }> => {
  return http.delete(`/api/sessions/${sessionId}`);
};
