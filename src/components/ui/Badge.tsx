import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "accent" | "cyan" | "amber" | "neutral" | "danger";

const TONES: Readonly<Record<BadgeTone, string>> = {
  accent:
    "text-[var(--b-accent)] border-[color-mix(in_srgb,var(--b-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--b-accent)_12%,transparent)]",
  // Text stays --b-fg (always readable); the tone only tints the border and fill. Mazal and Academy
  // remap --b-tone-2/-3 to neutral because their accent-2/-3 slots carry restricted meaning.
  cyan:
    "text-[var(--b-fg)] border-[color-mix(in_srgb,var(--b-tone-2,var(--b-accent-2))_55%,transparent)] bg-[color-mix(in_srgb,var(--b-tone-2,var(--b-accent-2))_14%,transparent)]",
  amber:
    "text-[var(--b-fg)] border-[color-mix(in_srgb,var(--b-tone-3,var(--b-accent-3))_55%,transparent)] bg-[color-mix(in_srgb,var(--b-tone-3,var(--b-accent-3))_14%,transparent)]",
  neutral:
    "text-[var(--b-muted)] border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-fg)_6%,transparent)]",
  danger:
    "text-[var(--b-danger)] border-[color-mix(in_srgb,var(--b-danger)_45%,transparent)] bg-[color-mix(in_srgb,var(--b-danger)_12%,transparent)]",
};

interface BadgeProps {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
  readonly className?: string;
  readonly title?: string;
}

export default function Badge({ children, tone = "accent", className, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-ui text-[0.6875rem] font-medium uppercase leading-5 tracking-[0.1em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
