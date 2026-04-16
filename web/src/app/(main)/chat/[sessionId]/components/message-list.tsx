"use client";

import type { RefObject } from "react";
import { MessageBubble } from "./message-bubble";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  scrollRef: RefObject<HTMLDivElement | null>;
  loading: boolean;
}

export function MessageList({ messages, scrollRef, loading }: MessageListProps) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
      {/* 没有消息时，显示提示 */}
      {!messages.length && (
        <p className="pt-20 text-center text-sm text-gray-400">开始和 TA 聊天吧</p>
      )}
      {/* 有消息时，显示消息列表 */}
      {messages.length && (
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2.5 text-sm text-gray-400">
                对方正在输入...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
