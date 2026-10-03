"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SwitchOption {
  readonly value: string;
  readonly label: string;
}

export interface ChapterSwitchConfig {
  /** Attribute written on the chapter's [data-brand] element, for example "theme" or "channel". */
  readonly attr: "theme" | "channel";
  readonly legend: string;
  readonly options: readonly SwitchOption[];
  readonly initial: string;
}

/**
 * Segmented control that re-themes the whole chapter by setting data-theme or
 * data-channel on the nearest [data-brand] ancestor (Academy light and dark,
 * Commune dark and light, Mazal web and social kit).
 */
export default function ChapterSwitch({ attr, legend, options, initial }: ChapterSwitchConfig) {
  const [value, setValue] = useState(initial);
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = anchor.current?.closest<HTMLElement>("[data-brand]");
    if (!target) return;
    target.setAttribute(`data-${attr}`, value);
    return () => {
      target.removeAttribute(`data-${attr}`);
    };
  }, [attr, value]);

  return (
    <div ref={anchor} role="group" aria-label={legend} className="inline-flex flex-wrap items-center gap-2">
      <span className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]">{legend}</span>
      <div className="inline-flex rounded-full border border-[var(--b-border)] p-1">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              data-sfx="toggle"
              onClick={() => {
                setValue(o.value);
              }}
              className={cn(
                "min-h-11 min-w-11 rounded-full px-4 font-ui text-xs font-medium uppercase tracking-[0.1em] transition-colors",
                on
                  ? "bg-[var(--b-accent)] text-[var(--b-accent-fg)]"
                  : "text-[var(--b-fg)] hover:bg-[color-mix(in_srgb,var(--b-fg)_10%,transparent)]",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
