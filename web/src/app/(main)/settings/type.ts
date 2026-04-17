/* 「service-type」 */

export interface UserDto {
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
  userId: string;
  name?: string;
  occupation?: string;
  interests?: string;
  recent_events?: string;
}
