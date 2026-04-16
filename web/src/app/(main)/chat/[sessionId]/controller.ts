/* 「controller」 */

import { useEffect, useCallback, useRef } from "react";
import { apiGetMessages, apiSendMessage } from "@/services";
import { useChatStore, useUserStore, useSessionStore } from "@/stores";
import type { ChatMessage } from "@/types";

async function fetchMessages(
  sessionId: string,
  page = 1,
  pageSize = 50,
): Promise<ChatMessage[]> {
  const { data } = await apiGetMessages(sessionId, page, pageSize);
  return data.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: m.created_at,
  }));
}

export function useChatController(sessionId: string) {
  const user = useUserStore((s) => s.user);
  const activeSessionId = useSessionStore((s) => s.activeSessionId);
  const setActiveSessionId = useSessionStore((s) => s.setActiveSessionId);
  const {
    messages,
    loading,
    setMessages,
    appendMessage,
    setLoading,
    setEmotion,
    clearMessages,
  } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    if (activeSessionId !== sessionId) {
      clearMessages();
      setActiveSessionId(sessionId);
    }

    fetchMessages(sessionId).then((msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });
  }, [sessionId, activeSessionId, setActiveSessionId, clearMessages, setMessages, scrollToBottom]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!user || !text.trim() || loading) return;

      const companionId = useSessionStore.getState().sessions.find(
        (s) => s.id === sessionId,
      )?.companionId;
      if (!companionId) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: Date.now(),
      };
      appendMessage(userMsg);
      scrollToBottom();
      setLoading(true);

      try {
        const { data } = await apiSendMessage({
          userId: user.id,
          sessionId,
          companionId,
          message: text,
        });

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          createdAt: Date.now(),
        };
        appendMessage(assistantMsg);
        setEmotion(data.emotion);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    },
    [user, sessionId, loading, appendMessage, setLoading, setEmotion, scrollToBottom],
  );

  return { messages, loading, scrollRef, handleSend };
}
