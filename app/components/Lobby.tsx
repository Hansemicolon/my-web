"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import AdUnit from "@/components/AdUnit";

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
  const [adHeight, setAdHeight] = useState(100); // Default fallback height
  const currentError = validationError ?? error;

  const handleAdHeightChange = useCallback((height: number) => {
    setAdHeight(height);
  }, []);

  function handleJoin() {
    const trimmed = joinId.trim();
    if (!UUID_REGEX.test(trimmed)) {
      setValidationError("Invalid room ID format. Expected a UUID v4.");
      return;
    }
    setValidationError(null);
    onJoinRoom(trimmed);
  }

  // Calculate dynamic padding: ad height + wrapper padding (16px top/bottom) + safe area
  const dynamicPaddingBottom = adHeight + 32; // 16px padding on each side of the ad wrapper

  return (
    <div 
      className="relative flex min-h-[100dvh] w-full items-center justify-center px-5 pt-10 sm:px-6 sm:pt-12"
      style={{
        paddingBottom: `calc(${dynamicPaddingBottom}px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-10">
          {/* Title */}
          <div className="text-center">
            <h1 className="mb-3 text-4xl font-light tracking-tight text-zinc-100">
              Ephemeral - 60 Seconds
            </h1>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-zinc-500">
              Private rooms. No logs. Messages dissolve in 60&nbsp;seconds.
            </p>
          </div>

          {/* Connection indicator */}
          <div className="flex min-h-5 items-center gap-2 text-xs">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
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
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.06] py-3.5 text-sm font-medium text-zinc-200 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Create Room
          </button>

          {/* Divider */}
          <div className="flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              or join
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Join */}
          <div className="flex w-full flex-col gap-3">
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
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 font-mono text-[13px] text-sm text-zinc-200 placeholder:text-zinc-600 transition-all duration-200 focus:bg-white/[0.06] focus:border-white/[0.15] focus:outline-none"
            />
            <button
              onClick={handleJoin}
              disabled={!isConnected || !joinId.trim()}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] py-3 text-sm text-zinc-400 transition-all duration-200 hover:bg-white/[0.08] hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Join Room
            </button>
          </div>

          {/* Errors */}
          <div className="flex min-h-5 items-center justify-center">
            <p
              className={`text-center text-xs text-red-400/80 transition-opacity duration-150 ${
                currentError ? "opacity-100" : "opacity-0"
              }`}
            >
              {currentError ?? "\u00A0"}
            </p>
          </div>

          <nav
            aria-label="Site information links"
            className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-4 text-xs text-zinc-500"
          >
            <Link href="/about" className="transition-colors hover:text-zinc-300">
              About
            </Link>
            <Link href="/how-to-use" className="transition-colors hover:text-zinc-300">
              How to Use
            </Link>
            <Link href="/faq" className="transition-colors hover:text-zinc-300">
              FAQ
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-zinc-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-zinc-300">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>

      {/* Ad Unit - pointer-events:none on wrapper, AdUnit manages its own pointer-events */}
      <div 
        className="fixed inset-x-0 bottom-0 w-full px-5 pb-4 sm:px-6"
        style={{ 
          pointerEvents: "none",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="mx-auto w-full max-w-md">
          <AdUnit onHeightChange={handleAdHeightChange} />
        </div>
      </div>
    </div>
  );
}
