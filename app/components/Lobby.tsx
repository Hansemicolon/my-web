"use client";

import { useState } from "react";

interface LobbyProps {
  isConnected: boolean;
  error: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function Lobby({
  isConnected,
  error,
  onCreateRoom,
  onJoinRoom,
}: LobbyProps) {
  const [joinId, setJoinId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleJoin() {
    const trimmed = joinId.trim();
    if (!UUID_REGEX.test(trimmed)) {
      setValidationError("Invalid room ID format. Expected a UUID v4.");
      return;
    }
    setValidationError(null);
    onJoinRoom(trimmed);
  }

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-md mx-auto px-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-tight text-zinc-100 mb-3">
          Ephemeral
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
          Private rooms. No logs. Messages dissolve in 60&nbsp;seconds.
        </p>
      </div>

      {/* Connection indicator */}
      <div className="flex items-center gap-2 text-xs">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isConnected
              ? "bg-green-600 shadow-[0_0_4px_rgba(22,163,74,0.35)]"
              : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]"
          }`}
        />
        <span
          className={
            isConnected ? "text-green-600/70" : "text-red-400/70"
          }
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Create */}
      <button
        onClick={onCreateRoom}
        disabled={!isConnected}
        className="w-full py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-zinc-200 text-sm font-medium hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
      >
        Create Room
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          or join
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Join */}
      <div className="w-full flex flex-col gap-3">
        <input
          type="text"
          value={joinId}
          onChange={(e) => {
            setJoinId(e.target.value);
            setValidationError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleJoin();
          }}
          placeholder="Paste room ID..."
          className="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-200 text-sm placeholder:text-zinc-600 font-mono text-[13px] focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.06] transition-all duration-200"
        />
        <button
          onClick={handleJoin}
          disabled={!isConnected || !joinId.trim()}
          className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 text-sm hover:bg-white/[0.08] hover:text-zinc-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Join Room
        </button>
      </div>

      {/* Errors */}
      {(error || validationError) && (
        <p className="text-red-400/80 text-xs text-center">
          {validationError ?? error}
        </p>
      )}
    </div>
  );
}
