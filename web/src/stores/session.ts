import { create } from "zustand";
import type { SessionItem } from "@/types";

interface SessionState {
  sessions: SessionItem[];
  activeSessionId: string | null;
}

export const useSession = create<SessionState>(() => ({
  sessions: [],
  activeSessionId: null,
}));

const set = useSession.setState;

export const sessionActions = {
  setSessions: (sessions: SessionItem[]) => set({ sessions }),

  setActiveSessionId: (id: string | null) => set({ activeSessionId: id }),

  addSession: (session: SessionItem) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),

  removeSession: (id: string) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId:
        state.activeSessionId === id ? null : state.activeSessionId,
    })),
};
