import { create } from "zustand";
import type { SessionItem } from "@/types";

interface SessionState {
  sessions: SessionItem[];
  activeSessionId: string | null;
  setSessions: (sessions: SessionItem[]) => void;
  setActiveSessionId: (id: string | null) => void;
  addSession: (session: SessionItem) => void;
  removeSession: (id: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  activeSessionId: null,
  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    })),
}));
