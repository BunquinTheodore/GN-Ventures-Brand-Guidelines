"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";
import { cn, copyText } from "@/lib/utils";
import { toast } from "./Toast";

interface CopyChipProps {
  /** Text shown and copied. */
  readonly value: string;
  /** Optional accessible name, defaults to "Copy <value>". */
  readonly label?: string;
  /** Copy this instead of the displayed value. */
  readonly copyValue?: string;
  readonly className?: string;
}

const RESET_MS = 1400;

/** Small mono chip that copies its value on click or Enter/Space. */
export default function CopyChip({ value, label, copyValue, className }: CopyChipProps) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function onCopy() {
    const text = copyValue ?? value;
    const ok = await copyText(text);
    if (!ok) {
      sfx.play("error");
      toast.show("Copy failed. Select the text and copy manually.", "error");
      return;
    }
    sfx.play("copy");
    toast.show(`Copied ${text}`);
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), RESET_MS);
  }

  return (
    <button
      type="button"
      data-sfx="copy"
      aria-label={label ?? `Copy ${value}`}
      onClick={onCopy}
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-md border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-fg)_7%,transparent)] px-2.5 py-1 font-mono text-xs text-[var(--b-fg)] transition-colors hover:border-[var(--b-accent)] hover:bg-[color-mix(in_srgb,var(--b-accent)_14%,transparent)]",
        className,
      )}
    >
      <span>{value}</span>
      <span aria-hidden="true" className="text-[var(--b-accent)]">
        {done ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
