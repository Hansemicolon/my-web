"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { ChatMessage } from "@/types/socket";
import ChatView from "./ChatView";
import SheetView from "./SheetView";
import ModeToggle, { type UIMode } from "./ModeToggle";

const MODE_KEY = "ephemeral-ui-mode";
const SEND_DEBOUNCE_MS = 200;

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
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<UIMode>("chat");
  
  // Guard against rapid duplicate sends (200ms debounce)
  const lastSendTimeRef = useRef<number>(0);

  // Hydrate mode from localStorage (client-only)
  useEffect(() => {
    const stored = localStorage.getItem(MODE_KEY);
    if (stored === "chat" || stored === "sheet") {
      setMode(stored); // eslint-disable-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    }
  }, []);

  function toggleMode() {
    setMode((prev) => {
      const next = prev === "chat" ? "sheet" : "chat";
      localStorage.setItem(MODE_KEY, next);
      return next;
    });
  }

  // Unified send handler with debounce guard
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    
    // Prevent duplicate sends within SEND_DEBOUNCE_MS
    const now = Date.now();
    if (now - lastSendTimeRef.current < SEND_DEBOUNCE_MS) {
      return;
    }
    lastSendTimeRef.current = now;
    
    onSendMessage(trimmed);
    setInput("");
  }, [input, onSendMessage]);
  
  // Form submit handler - the single source of truth for sending messages
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  }, [handleSend]);

  function handleCopyRoomId() {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isSheet = mode === "sheet";

  return (
    <div
      className={`flex flex-col h-[100dvh] w-full max-w-2xl mx-auto transition-colors duration-300 ${
        isSheet ? "bg-white" : ""
      }`}
    >
      {/* Header */}
      <header
        className={`flex items-center justify-between px-5 py-4 border-b transition-colors duration-300 ${
          isSheet
            ? "border-green-800/30 bg-green-700 shadow-sm"
            : "border-white/[0.06] bg-black"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={handleCopyRoomId}
            className="flex items-center gap-2 min-w-0 group"
            title="Copy room ID"
          >
            <span
              className="font-mono text-xs truncate max-w-[140px] sm:max-w-[220px] text-white/60 group-hover:text-white/80 transition-colors"
            >
              {roomId}
            </span>
            <span
              className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors shrink-0"
            >
              {copied ? "✓" : "⧉"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle mode={mode} onToggle={toggleMode} />
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${
              clientCount >= 2
                ? "text-white border-white/20 bg-white/10"
                : "text-white/60 border-white/15 bg-white/[0.05]"
            }`}
          >
            {clientCount}/2
          </span>
          <button
            onClick={onLeave}
            className="text-xs text-white/60 hover:text-red-300 transition-colors"
          >
            Leave
          </button>
        </div>
      </header>

      {/* View area */}
      {mode === "chat" ? (
        <ChatView messages={messages} socketId={socketId} />
      ) : (
        <SheetView messages={messages} socketId={socketId} />
      )}

      {/* Input */}
      <div
        className={`px-5 py-4 border-t transition-colors duration-300 ${
          isSheet
            ? "border-green-900/30 bg-green-800"
            : "border-white/[0.06] bg-black"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 py-3 px-4 rounded-xl bg-white border border-transparent text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`px-5 py-3 rounded-xl border text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
              isSheet
                ? "bg-green-900 border-green-900 text-white hover:bg-green-950"
                : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
