"use client";

export type UIMode = "chat" | "sheet";

interface ModeToggleProps {
  mode: UIMode;
  onToggle: () => void;
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all duration-200 shrink-0 cursor-pointer select-none ${
        mode === "chat"
          ? "text-white/70 border-white/15 bg-white/[0.05] hover:bg-white/10"
          : "text-white border-white/25 bg-white/10 hover:bg-white/15"
      }`}
      title={mode === "chat" ? "Switch to Spreadsheet Mode" : "Switch to Chat Mode"}
    >
      <span className="text-[13px] leading-none" aria-hidden>
        {mode === "chat" ? "⊞" : "💬"}
      </span>
      {mode === "chat" ? "Sheet" : "Chat"}
    </button>
  );
}
