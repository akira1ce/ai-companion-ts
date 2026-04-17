import { create } from "zustand";
import type { SessionSchema } from "@/app/(main)/companions/type";

interface SessionState {
  sessions: SessionSchema[];
  activeSessionId: string | null;
}

export const useSession = create<SessionState>(() => ({
  sessions: [],
  activeSessionId: null,
}));

const set = useSession.setState;

export const sessionActions = {
  setSessions: (sessions: SessionSchema[]) => set({ sessions }),

  setActiveSessionId: (id: string | null) => set({ activeSessionId: id }),

  addSession: (session: SessionSchema) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),

  removeSession: (id: string) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId:
        state.activeSessionId === id ? null : state.activeSessionId,
    })),
};
