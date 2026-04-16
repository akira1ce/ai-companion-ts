/* 「view」 */
"use client";

import { use, useCallback, useEffect, useRef } from "react";
import { useChatStore, useUserStore, useSessionStore } from "@/stores";
import { getMessages, sendMessage } from "./controller";
import { MessageList } from "./components/message-list";
import { ChatInput } from "./components/chat-input";
import type { ChatMessage } from "@/types";

interface ChatPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { sessionId } = use(params);
  const user = useUserStore((s) => s.user);
  const activeSessionId = useSessionStore((s) => s.activeSessionId);
  const setActiveSessionId = useSessionStore((s) => s.setActiveSessionId);
  const { messages, loading, setMessages, appendMessage, setLoading, setEmotion, clearMessages } =
    useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    if (activeSessionId !== sessionId) {
      clearMessages();
      setActiveSessionId(sessionId);
    }

    getMessages(sessionId).then((msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });
  }, [sessionId]);

  const handleSend = async (text: string) => {
    if (!user || !text.trim() || loading) return;

    const companionId = useSessionStore
      .getState()
      .sessions.find((s) => s.id === sessionId)?.companionId;
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
      const data = await sendMessage({
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
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center shadow px-4">
        <h1 className="text-sm font-medium">会话</h1>
      </header>

      <MessageList messages={messages} scrollRef={scrollRef} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
