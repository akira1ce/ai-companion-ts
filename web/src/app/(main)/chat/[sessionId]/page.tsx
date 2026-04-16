/* 「view」 */
"use client";

import { use } from "react";
import { useChatController } from "./controller";
import { MessageList } from "./components/message-list";
import { ChatInput } from "./components/chat-input";

interface ChatPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { sessionId } = use(params);
  const { messages, loading, scrollRef, handleSend } = useChatController(sessionId);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center border-b px-4">
        <h1 className="text-sm font-medium">会话</h1>
      </header>

      <MessageList messages={messages} scrollRef={scrollRef} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
