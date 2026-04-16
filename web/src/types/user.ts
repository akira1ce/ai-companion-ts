/* 「service-type」 */

export interface ApiUser {
  id: string;
  name?: string;
  username: string;
  password: string;
  occupation?: string;
  interests?: string;
  recent_events?: string;
  created_at: number;
  updated_at: number;
}

export interface ApiCreateUserReq {
  name?: string;
  username: string;
  password: string;
  occupation?: string;
  interests?: string;
  recent_events?: string;
}

export interface ApiUpdateUserReq {
  name?: string;
  occupation?: string;
  interests?: string;
  recent_events?: string;
}

export interface ApiUserRes {
  data: ApiUser;
}

/* 「controller-type」 */

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  occupation: string;
  interests: string;
  recentEvents: string;
}
