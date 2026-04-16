import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "@/types";

interface AppState {
  user: UserProfile | null;
}

export const useApp = create<AppState>()(
  persist(
    (): AppState => ({
      user: null,
    }),
    {
      name: "ai-companion-user",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

const set = useApp.setState;

export const appActions = {
  setUser: (user: UserProfile) => set({ user }),
  clearUser: () => set({ user: null }),
};
