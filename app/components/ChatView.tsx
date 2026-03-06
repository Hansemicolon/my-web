"use client";

import { useCallback, useEffect, useRef } from "react";
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

  const handleCopyCut = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className="flex-1 overflow-y-auto select-none px-5 py-4 space-y-1"
      onCopy={handleCopyCut}
      onCut={handleCopyCut}
    >
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
