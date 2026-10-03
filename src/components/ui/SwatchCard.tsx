"use client";

import { useEffect, useRef, useState } from "react";
import type { Swatch } from "@/content/types";
import { sfx } from "@/lib/sfx";
import { cn, copyText } from "@/lib/utils";
import { toast } from "./Toast";

interface SwatchCardProps {
  readonly swatch: Swatch;
  readonly className?: string;
}

const RESET_MS = 1400;
const PAINTABLE = /gradient|rgba?\(|oklch|color-mix|hsl/i;
const CHECKER =
  "conic-gradient(rgba(128,128,128,0.35) 25%, transparent 0 50%, rgba(128,128,128,0.35) 0 75%, transparent 0) 0 0 / 14px 14px";

function paintFor(swatch: Swatch): string {
  if (swatch.css && PAINTABLE.test(swatch.css)) return swatch.css;
  return swatch.hex ?? "transparent";
}

/** Color tile. Click (or Enter/Space) copies the hex, or the css value when there is no hex. */
export default function SwatchCard({ swatch, className }: SwatchCardProps) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const value = swatch.hex ?? swatch.css ?? "";

  useEffect(() => () => clearTimeout(timer.current), []);

  async function onCopy() {
    const ok = await copyText(value);
    if (!ok) {
      sfx.play("error");
      toast.show("Copy failed. Select the value and copy manually.", "error");
      return;
    }
    sfx.play("copy");
    toast.show(`Copied ${value}`);
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), RESET_MS);
  }

  return (
    <button
      type="button"
      data-sfx="copy"
      onClick={onCopy}
      aria-label={`Copy ${swatch.name} ${value}`}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--b-surface)] text-left transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      <span className="block h-24 w-full" style={{ background: CHECKER }}>
        <span className="block h-full w-full" style={{ background: paintFor(swatch) }} />
      </span>
      <span className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="flex items-center justify-between gap-2">
          <span className="font-ui text-sm font-semibold text-[var(--b-fg)]">{swatch.name}</span>
          <span aria-hidden="true" className="font-ui text-[0.6875rem] uppercase tracking-[0.1em] text-[var(--b-accent)]">
            {done ? "Copied" : "Copy"}
          </span>
        </span>
        {swatch.hex ? <span className="font-mono text-xs text-[var(--b-fg)]">{swatch.hex.toUpperCase()}</span> : null}
        {swatch.css && swatch.css !== swatch.hex ? (
          <span className="break-all font-mono text-[0.6875rem] text-[var(--b-muted)]">{swatch.css}</span>
        ) : null}
        <span className="text-[0.8125rem] leading-snug text-[var(--b-muted)]">{swatch.role}</span>
      </span>
    </button>
  );
}
