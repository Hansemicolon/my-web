"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/socket";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [timeAgo, setTimeAgo] = useState("");
  const [remaining] = useState(() => message.expiresAt - Date.now());

  useEffect(() => {
    function updateTime() {
      const elapsed = Math.floor((Date.now() - message.createdAt) / 1000);
      if (elapsed < 60) {
        setTimeAgo(`${elapsed}s ago`);
      } else {
        setTimeAgo("expired");
      }
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [message.createdAt]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (remaining <= 0) return null;

  return (
    <div
      ref={ref}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
      style={{
        animation: "message-fade linear forwards",
        animationDuration: `${remaining}ms`,
      }}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 backdrop-blur-md ${
          isOwn
            ? "bg-sky-500/20 border border-sky-400/20 text-sky-50"
            : "bg-white/[0.07] border border-white/[0.08] text-zinc-200"
        }`}
      >
        <p className="text-sm leading-relaxed break-words">
          {message.content}
        </p>
        <p
          className={`text-[10px] mt-1.5 ${
            isOwn ? "text-sky-300/50 text-right" : "text-zinc-500"
          }`}
        >
          {timeAgo}
        </p>
      </div>
    </div>
  );
}
