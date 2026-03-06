"use client";

import { useMemo } from "react";

interface WatermarkOverlayProps {
  roomId: string;
  sessionId?: string;
}

/**
 * Full-viewport watermark overlay with diagonal repeating text.
 * Renders via pure CSS (SVG data-URI background) — no canvas, no DOM spam.
 * pointer-events: none so it never blocks clicks.
 */
export default function WatermarkOverlay({
  roomId,
  sessionId,
}: WatermarkOverlayProps) {
  const backgroundImage = useMemo(() => {
    const shortRoom = roomId.slice(0, 8);
    const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const label = sessionId
      ? `${shortRoom}  ${timestamp}  ${sessionId.slice(0, 6)}`
      : `${shortRoom}  ${timestamp}`;

    // Encode an SVG tile with rotated text — repeats via CSS background-repeat
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160"><text transform="rotate(-25 160 80)" x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="rgba(255,255,255,0.04)" font-family="monospace" font-size="12">${label}</text></svg>`;

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [roomId, sessionId]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ backgroundImage, backgroundRepeat: "repeat" }}
    />
  );
}
