/* 「service」 */

import { http } from "@/lib/request";
import type {
  MessageDto,
  ApiGetMessagesReq,
  ApiChatReq,
  ApiChatRes,
} from "./type";

export const apiGetMessages = (
  params: ApiGetMessagesReq,
): Promise<{ data: MessageDto[] }> => {
  const { sessionId, page = 1, pageSize = 20 } = params;
  return http.get<MessageDto[]>(`/api/messages/${sessionId}`, {
    params: { page: String(page), pageSize: String(pageSize) },
  });
};

export const apiSendMessage = (params: ApiChatReq): Promise<ApiChatRes> => {
  return http.post<ApiChatRes["data"]>("/api/chat", params);
};
