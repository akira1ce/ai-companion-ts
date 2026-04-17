/* 「service」 */

import { http } from "@/lib/request";
import type {
  CompanionDto,
  SessionDto,
  ApiCreateSessionReq,
} from "./type";

export const apiGetCompanions = (): Promise<{ data: CompanionDto[] }> => {
  return http.get<CompanionDto[]>("/api/companions");
};

export const apiGetSessions = (userId: string): Promise<{ data: SessionDto[] }> => {
  return http.get<SessionDto[]>("/api/sessions", { params: { userId } });
};

export const apiCreateSession = (params: ApiCreateSessionReq): Promise<{ data: SessionDto }> => {
  return http.post<SessionDto>("/api/sessions", params);
};

export const apiDeleteSession = (sessionId: string): Promise<{ data: { success: boolean } }> => {
  return http.delete(`/api/sessions/${sessionId}`);
};
