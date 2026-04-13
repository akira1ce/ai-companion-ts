import { UserSchema, UserDto } from "./type";

export const transformUserDto = (user: UserSchema): UserDto => {
  return {
    ...user,
    interests: JSON.stringify(user.interests),
    recent_events: JSON.stringify(user.recent_events),
  };
};

export const transformUserSchema = (user: UserDto): UserSchema => {
  return {
    ...user,
    interests: JSON.parse(user.interests ?? "[]"),
    recent_events: JSON.parse(user.recent_events ?? "[]"),
  };
};
