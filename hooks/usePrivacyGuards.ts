"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Returns true when the active element is an editable field. */
function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if (el.isContentEditable) return true;
  return false;
}

interface PrivacyGuardOptions {
  /** Enable hotkey blocking (default true) */
  blockHotkeys?: boolean;
  /** Enable PrintScreen detection overlay (default true) */
  detectPrintScreen?: boolean;
}

/**
 * Best-effort privacy guards for chat rooms.
 *
 * - Blocks browser shortcuts (Ctrl/Cmd+C outside inputs, Ctrl/Cmd+P/S/U, DevTools)
 * - Detects PrintScreen and briefly covers the screen
 * - Provides a toast message queue for warnings
 *
 * Does NOT block OS-level screen capture — that is impossible on the web.
 */
export function usePrivacyGuards(options: PrivacyGuardOptions = {}) {
  const { blockHotkeys = true, detectPrintScreen = true } = options;

  const [toast, setToast] = useState<string | null>(null);
  const [printScreenOverlay, setPrintScreenOverlay] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const psTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  // ------------------------------------------------------------------
  // Hotkey blocking
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!blockHotkeys) return;

    function handleKeyDown(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      const key = e.key.toLowerCase();

      // F12 — DevTools
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        showToast("For privacy, some shortcuts are disabled.");
        return;
      }

      if (!ctrl) return;

      // Ctrl+C — only block outside editable fields
      if (key === "c" && !shift && !alt) {
        if (!isEditableTarget(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          showToast("Copy is disabled for privacy.");
        }
        return;
      }

      // Ctrl+P (print), Ctrl+S (save), Ctrl+U (view source)
      if ((key === "p" || key === "s" || key === "u") && !shift && !alt) {
        e.preventDefault();
        e.stopPropagation();
        showToast("For privacy, some shortcuts are disabled.");
        return;
      }

      // Ctrl+Shift+I / Ctrl+Alt+I — DevTools
      if (key === "i" && (shift || alt)) {
        e.preventDefault();
        e.stopPropagation();
        showToast("For privacy, some shortcuts are disabled.");
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [blockHotkeys, showToast]);

  // ------------------------------------------------------------------
  // PrintScreen best-effort detection
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!detectPrintScreen) return;

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key !== "PrintScreen") return;
      clearTimeout(psTimer.current);
      setPrintScreenOverlay(true);
      psTimer.current = setTimeout(() => setPrintScreenOverlay(false), 1500);
    }

    document.addEventListener("keyup", handleKeyUp, { capture: true });
    return () =>
      document.removeEventListener("keyup", handleKeyUp, { capture: true });
  }, [detectPrintScreen]);

  // ------------------------------------------------------------------
  // Cleanup timers
  // ------------------------------------------------------------------
  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(psTimer.current);
    };
  }, []);

  return { toast, printScreenOverlay };
}
