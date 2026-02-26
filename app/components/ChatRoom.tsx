"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/socket";
import MessageBubble from "./MessageBubble";

interface ChatRoomProps {
  roomId: string;
  messages: ChatMessage[];
  clientCount: number;
  socketId: string | null;
  onSendMessage: (content: string) => void;
  onLeave: () => void;
}

export default function ChatRoom({
  roomId,
  messages,
  clientCount,
  socketId,
  onSendMessage,
  onLeave,
}: ChatRoomProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
  }

  function handleCopyRoomId() {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={handleCopyRoomId}
            className="flex items-center gap-2 min-w-0 group"
            title="Copy room ID"
          >
            <span className="font-mono text-xs text-zinc-500 truncate max-w-[180px] sm:max-w-[280px] group-hover:text-zinc-300 transition-colors">
              {roomId}
            </span>
            <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0">
              {copied ? "✓" : "⧉"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${
              clientCount >= 2
                ? "text-emerald-400/80 border-emerald-400/20 bg-emerald-400/[0.06]"
                : "text-zinc-500 border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            {clientCount}/2
          </span>
          <button
            onClick={onLeave}
            className="text-xs text-zinc-600 hover:text-red-400/80 transition-colors"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Messages */}
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

      {/* Input */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 py-3 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.06] transition-all duration-200"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-zinc-400 text-sm hover:bg-white/[0.1] hover:text-zinc-200 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
