/* 「service-type」 */

export interface CompanionDto {
  id: string;
  name: string;
  personality: string[];
}

export interface SessionDto {
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

/* 「controller-type」 */

export interface CompanionSchema {
  id: string;
  name: string;
  personality: string;
}

export interface SessionSchema {
  id: string;
  companionId: string;
  title: string;
  updatedAt: number;
}
