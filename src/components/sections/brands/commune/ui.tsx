import type { ReactNode } from "react";
import { clamp, cn } from "@/lib/utils";

/** Commune never rotates anything past two degrees either way. */
export const MAX_ROTATION_DEG = 2;

export function clampRotation(deg: number): number {
  return clamp(deg, -MAX_ROTATION_DEG, MAX_ROTATION_DEG);
}

/** Font role classes, driven by the chapter tokens in globals.css. */
export const FONT = {
  word: "[font-family:var(--b-font-wordmark)] [font-weight:300]",
  hand: "[font-family:var(--b-font-hand)]",
  mono: "[font-family:var(--b-font-ui)]",
  display: "[font-family:var(--b-font-display)] [font-weight:300]",
  body: "[font-family:var(--b-font-body)]",
} as const;

export const FLAG_TEXT = "Brand copy placeholder, confirm with owner";

interface PanelProps {
  readonly title?: string;
  readonly rotate?: number;
  readonly tape?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Taped notebook page: 2px ink outline, hard offset shadow, a small tilt. */
export function Panel({ title, rotate = 0, tape = true, className, children }: PanelProps) {
  return (
    <div
      style={{ transform: `rotate(${clampRotation(rotate)}deg)` }}
      className={cn(
        "sk-ink relative rounded-[6px_18px_8px_16px] bg-[var(--b-bg)] p-5 pt-7 shadow-[4px_4px_0_var(--b-fg)] md:p-6 md:pt-8",
        tape && "sk-tape",
        className,
      )}
    >
      {title ? (
        <p className={cn("mb-4 text-xs uppercase tracking-[0.14em] text-[var(--b-muted)]", FONT.mono)}>{title}</p>
      ) : null}
      {children}
    </div>
  );
}

interface StickerProps {
  readonly children: ReactNode;
  readonly rotate?: number;
  readonly inverse?: boolean;
  readonly className?: string;
}

export function Sticker({ children, rotate = 0, inverse = false, className }: StickerProps) {
  return (
    <span
      style={{ transform: `rotate(${clampRotation(rotate)}deg)` }}
      className={cn(
        "sk-ink sk-wobble inline-flex items-center px-4 py-1.5 text-sm shadow-[2px_2px_0_var(--b-fg)]",
        FONT.mono,
        inverse ? "bg-[var(--b-fg)] text-[var(--b-bg)]" : "bg-[var(--b-bg)] text-[var(--b-fg)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The mandatory "placeholder, confirm with owner" flag, drawn as a dashed rubber stamp. */
export function PlaceholderStamp({ className }: { readonly className?: string }) {
  return (
    <span
      role="note"
      style={{ transform: "rotate(-2deg)" }}
      className={cn(
        "sk-wobble-2 inline-flex items-center border-2 border-dashed border-[var(--b-fg)] px-3 py-1 text-xs uppercase tracking-[0.1em] text-[var(--b-fg)]",
        FONT.mono,
        className,
      )}
    >
      {FLAG_TEXT}
    </span>
  );
}

export function Eyebrow({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return (
    <p className={cn("text-[10px] uppercase tracking-[0.32em] text-[var(--b-muted)]", FONT.word, className)}>{children}</p>
  );
}

export function SketchHeading({ children }: { readonly children: ReactNode }) {
  return (
    <h4 className={cn("mb-3 flex items-center gap-3 text-2xl text-[var(--b-fg)]", FONT.hand)}>
      <span aria-hidden="true" className="sk-dashed inline-block w-8" />
      {children}
    </h4>
  );
}
