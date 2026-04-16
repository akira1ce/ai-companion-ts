/* 「view」 */
"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useApp, useSession, sessionActions } from "@/stores";
import { getMessages, sendMessage } from "./controller";
import { MessageList } from "./components/message-list";
import { ChatInput } from "./components/chat-input";
import { ChatHeader } from "./components/chat-header";
import type { ChatMessage, ApiEmotion } from "@/types";
import { useQuery } from "@akira1ce/r-hooks";
import { getCompanions } from "@/app/(main)/companions/controller";

interface ChatPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { sessionId } = use(params);
  const user = useApp((s) => s.user);
  const activeSessionId = useSession((s) => s.activeSessionId);
  const sessions = useSession((s) => s.sessions);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [emotion, setEmotion] = useState<ApiEmotion | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: companions } = useQuery(getCompanions, { defaultData: [] });

  const companion = useMemo(() => {
    const companionId = sessions.find((s) => s.id === sessionId)?.companionId;
    return companions.find((c) => c.id === companionId) ?? null;
  }, [sessions, companions, sessionId]);

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
      setMessages([]);
      setEmotion(null);
      sessionActions.setActiveSessionId(sessionId);
    }

    getMessages(sessionId).then((msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });
  }, [sessionId]);

  const handleSend = async (text: string) => {
    if (!user || !text.trim() || loading) return;

    const companionId = useSession.getState().sessions.find((s) => s.id === sessionId)?.companionId;
    if (!companionId) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
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
      setMessages((prev) => [...prev, assistantMsg]);
      setEmotion(data.emotion);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <ChatHeader companion={companion} emotion={emotion} />

      <MessageList messages={messages} scrollRef={scrollRef} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
