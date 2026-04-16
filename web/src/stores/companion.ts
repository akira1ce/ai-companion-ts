import { create } from "zustand";
import type { CompanionItem } from "@/types";

interface CompanionState {
  companions: CompanionItem[];
  activeCompanionId: string | null;
  setCompanions: (companions: CompanionItem[]) => void;
  setActiveCompanionId: (id: string) => void;
}

export const useCompanionStore = create<CompanionState>((set) => ({
  companions: [],
  activeCompanionId: null,
  setCompanions: (companions) => set({ companions }),
  setActiveCompanionId: (id) => set({ activeCompanionId: id }),
}));
