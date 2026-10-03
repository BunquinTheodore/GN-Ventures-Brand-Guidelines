"use client";

import { useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { FONT, Panel, SketchHeading } from "./ui";

const SEPARATOR = " | ";
/** Em dash, en dash, spaced hyphen and spaced double hyphen. Escapes keep source files clean. */
const EM = String.fromCharCode(8212);
const EN = String.fromCharCode(8211);
const DASH_PATTERN = new RegExp(["\\s*(?:", EM, "|", EN, "|--)\\s*|\\s-\\s"].join(""), "g");
const SAMPLE_START = "Weddings, offices, birthdays. Metro Manila";
const SAMPLE_DASHED = ["Weddings", "offices", "birthdays"].join(EM);

export function countDashes(text: string): number {
  return (text.match(DASH_PATTERN) ?? []).length;
}

export function fixDashes(text: string): string {
  return text.replace(DASH_PATTERN, SEPARATOR);
}

const DOS: readonly string[] = [
  "Weddings | Offices | Birthdays",
  "A little cafe on wheels. Metro Manila.",
  "Small, warm and personal.",
];

/** Live copy checker: proves the no-dash, pipe separator rule on whatever you type. */
export default function VoiceExtra() {
  const [text, setText] = useState(SAMPLE_START);
  const fieldId = useId();
  const found = useMemo(() => countDashes(text), [text]);
  const clean = found === 0;

  return (
    <div className="space-y-4">
      <SketchHeading>Copy checker</SketchHeading>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel title="Type some Commune copy" rotate={-1}>
          <label htmlFor={fieldId} className={cn("mb-2 block text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]", FONT.mono)}>
            Copy
          </label>
          <textarea
            id={fieldId}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="sk-ink w-full resize-y rounded-[6px] bg-[var(--b-surface)] p-3 text-base text-[var(--b-fg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--b-fg)]"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              data-sfx="click"
              onClick={() => setText(SAMPLE_DASHED)}
              className="sk-ink sk-wobble min-h-11 bg-[var(--b-bg)] px-4 text-sm text-[var(--b-fg)] shadow-[3px_3px_0_var(--b-fg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--b-fg)]"
            >
              Try a dash
            </button>
            <button
              type="button"
              data-sfx="click"
              disabled={clean}
              onClick={() => setText(fixDashes(text))}
              className="sk-ink sk-wobble min-h-11 bg-[var(--b-fg)] px-4 text-sm text-[var(--b-bg)] shadow-[3px_3px_0_var(--b-fg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--b-fg)] disabled:opacity-40"
            >
              Fix with pipes
            </button>
            <p role="status" aria-live="polite" className={cn("text-sm text-[var(--b-fg)]", FONT.mono)}>
              {clean ? "No dash punctuation found." : `${found} dash${found === 1 ? "" : "es"} found. Use " | " instead.`}
            </p>
          </div>
        </Panel>
        <Panel title="Sounds like this" rotate={1}>
          <ul className="space-y-3">
            {DOS.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <Badge tone="accent" className="mt-1 shrink-0">Do</Badge>
                <span className={cn("text-2xl leading-snug text-[var(--b-fg)]", FONT.hand)}>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-relaxed text-[var(--b-muted)]">
            Sample lines are placeholder copy, confirm with owner.
          </p>
        </Panel>
      </div>
    </div>
  );
}
