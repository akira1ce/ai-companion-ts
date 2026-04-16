/* 「service-type」 */

export interface ApiChatReq {
  userId: string;
  sessionId: string;
  companionId: string;
  message: string;
}

export interface ApiEmotion {
  state: string;
  intensity: number;
  intimacy: number;
}

export interface ApiChatRes {
  data: {
    reply: string;
    emotion: ApiEmotion | null;
  };
}
