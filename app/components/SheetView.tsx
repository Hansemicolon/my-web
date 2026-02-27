"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/socket";

interface SheetViewProps {
  messages: ChatMessage[];
  socketId: string | null;
}

/** Column headers for the spreadsheet aesthetic. */
const COLUMNS = ["A", "B", "C", "D", "E", "F"];

export default function SheetView({ messages, socketId }: SheetViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Column header row */}
      <div className="sticky top-0 z-10 flex border-b border-gray-300 bg-gray-100 shadow-sm">
        {/* Row-number gutter */}
        <div className="w-12 shrink-0 border-r border-gray-300 bg-gray-200/60" />
        {COLUMNS.map((col) => (
          <div
            key={col}
            className="flex-1 min-w-[90px] text-center text-[11px] font-medium text-gray-700 py-2 border-r border-gray-300 last:border-r-0 select-none"
          >
            {col}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100%-36px)]">
          <p className="text-green-700/35 text-sm font-mono">
            Cells populate as messages arrive...
          </p>
        </div>
      ) : (
        <div>
          {messages.map((msg, idx) => (
            <SheetRow
              key={msg.id}
              message={msg}
              rowIndex={idx + 1}
              isOwn={msg.sender === socketId}
            />
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

/* ─── Individual row ─── */

interface SheetRowProps {
  message: ChatMessage;
  rowIndex: number;
  isOwn: boolean;
}

function SheetRow({ message, rowIndex, isOwn }: SheetRowProps) {
  const [remaining] = useState(() => message.expiresAt - Date.now());
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    function update() {
      const elapsed = Math.floor((Date.now() - message.createdAt) / 1000);
      setTimeAgo(elapsed < 60 ? `${elapsed}s` : "—");
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [message.createdAt]);

  if (remaining <= 0) return null;

  // Other user → Column B (index 1), own → Column C (index 2)
  const colIndex = isOwn ? 2 : 1;

  return (
    <div
      className="flex border-b border-gray-200 hover:bg-green-50/30 transition-colors"
      style={{
        animation: "sheet-cell-fade linear forwards",
        animationDuration: `${remaining}ms`,
      }}
    >
      {/* Row number gutter */}
      <div className="w-12 shrink-0 flex items-center justify-center text-[11px] font-mono text-gray-400 border-r border-gray-200 bg-gray-50/80 select-none">
        {rowIndex}
      </div>

      {/* Cells */}
      {COLUMNS.map((_, ci) => (
        <div
          key={ci}
          className={`flex-1 min-w-[90px] border-r border-gray-200 last:border-r-0 px-3 py-2.5 min-h-[40px] flex items-center ${
            ci === colIndex ? "" : ""
          }`}
        >
          {ci === colIndex && (
            <span
              className={`text-sm leading-snug break-words font-mono ${
                isOwn ? "text-gray-700" : "text-gray-800"
              }`}
            >
              {message.content}
            </span>
          )}
          {ci === 0 && (
            <span className="text-[10px] text-gray-400 font-mono">
              {timeAgo}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
