"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/socket";
import MessageBubble from "./MessageBubble";

interface ChatViewProps {
  messages: ChatMessage[];
  socketId: string | null;
}

export default function ChatView({ messages, socketId }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-600 text-sm text-center leading-relaxed">
            Messages appear here and vanish in 60s...
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender === socketId}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
