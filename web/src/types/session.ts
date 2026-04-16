/* 「service-type」 */

export interface ApiSession {
  id: string;
  companion_id: string;
  user_id: string;
  title: string;
  created_at: number;
  updated_at: number;
}

export interface ApiCreateSessionReq {
  userId: string;
  companionId: string;
}

export interface ApiSessionListRes {
  data: ApiSession[];
}

export interface ApiSessionRes {
  data: ApiSession;
}

/* 「controller-type」 */

export interface SessionItem {
  id: string;
  companionId: string;
  title: string;
  updatedAt: number;
}
