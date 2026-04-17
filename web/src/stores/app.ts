import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserDto } from "@/app/(main)/settings/type";

interface AppState {
  user: UserDto | null;
}

export const useApp = create<AppState>()(
  persist(
    (): AppState => ({
      user: null,
    }),
    {
      name: "APP_STORE",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

const set = useApp.setState;

export const appActions = {
  setUser: (user: UserDto) => set({ user }),
  clearUser: () => set({ user: null }),
};
