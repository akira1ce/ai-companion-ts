import { create } from "zustand";
import type { ChatMessage, ApiEmotion } from "@/types";

interface ChatState {
  messages: ChatMessage[];
  emotion: ApiEmotion | null;
  loading: boolean;
  setMessages: (messages: ChatMessage[]) => void;
  appendMessage: (message: ChatMessage) => void;
  setEmotion: (emotion: ApiEmotion | null) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  emotion: null,
  loading: false,
  setMessages: (messages) => set({ messages }),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setEmotion: (emotion) => set({ emotion }),
  setLoading: (loading) => set({ loading }),
  clearMessages: () => set({ messages: [], emotion: null }),
}));
