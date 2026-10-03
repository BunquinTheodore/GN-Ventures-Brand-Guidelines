"use client";

import { useEffect, useState } from "react";

interface ToastMessage {
  readonly id: number;
  readonly text: string;
  readonly tone: "ok" | "error";
}

type Listener = (m: ToastMessage | null) => void;

const listeners = new Set<Listener>();
let counter = 0;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
const VISIBLE_MS = 1800;

function emit(m: ToastMessage | null): void {
  listeners.forEach((fn) => fn(m));
}

/** Imperative toast API. Safe to call anywhere on the client; renders in <ToastHost />. */
export const toast = {
  show(text: string, tone: ToastMessage["tone"] = "ok"): void {
    counter += 1;
    emit({ id: counter, text, tone });
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => emit(null), VISIBLE_MS);
  },
};

/** Presentational toast pill (also usable on its own). */
export function Toast({ text, tone = "ok" }: { readonly text: string; readonly tone?: "ok" | "error" }) {
  return (
    <div
      className="gn-toast gn-glass pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full px-5 py-2.5 font-ui text-sm font-medium"
      style={{ color: tone === "error" ? "#f87171" : "var(--fog)", background: "var(--raised)" }}
    >
      {text}
    </div>
  );
}

/** Mount once (AppShell does). Announces messages politely to screen readers. */
export function ToastHost() {
  const [message, setMessage] = useState<ToastMessage | null>(null);

  useEffect(() => {
    listeners.add(setMessage);
    return () => {
      listeners.delete(setMessage);
    };
  }, []);

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {message ? <Toast key={message.id} text={message.text} tone={message.tone} /> : null}
    </div>
  );
}

export default Toast;
