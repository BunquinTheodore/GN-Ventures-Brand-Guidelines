"use client";

import { useId, useState } from "react";
import { CopyChip } from "@/components/ui";
import { Card, SubHeading } from "../parts";

const DEFAULTS = { blur: 20, saturate: 140, shadowPct: 18 } as const;
const LIME = "#caf14a";

interface SliderProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly unit: string;
  readonly onChange: (n: number) => void;
}

function Slider({ label, value, min, max, unit, onChange }: SliderProps) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="flex justify-between font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">
        <span>{label}</span>
        <span className="font-mono">
          {value}
          {unit}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        data-sfx="toggle"
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full cursor-pointer accent-[var(--b-accent)]"
      />
    </div>
  );
}

/** Live glass lab: tune blur, saturate and the lime-tinted shadow over a gradient field. */
export default function GlassRecipe() {
  const [blur, setBlur] = useState<number>(DEFAULTS.blur);
  const [saturate, setSaturate] = useState<number>(DEFAULTS.saturate);
  const [shadowPct, setShadowPct] = useState<number>(DEFAULTS.shadowPct);
  const shadow = `0 18px 40px -20px color-mix(in srgb, ${LIME} ${shadowPct}%, transparent)`;
  const css = `background: color-mix(in srgb, var(--raised) 58%, transparent); backdrop-filter: blur(${blur}px) saturate(${saturate}%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), ${shadow};`;

  return (
    <section aria-labelledby="labs-glass-h" className="space-y-4">
      <SubHeading>
        <span id="labs-glass-h">Glass recipe lab</span>
      </SubHeading>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card brand="labs" glass className="space-y-4">
          <Slider label="Blur" value={blur} min={0} max={40} unit="px" onChange={setBlur} />
          <Slider label="Saturate" value={saturate} min={100} max={200} unit="%" onChange={setSaturate} />
          <Slider label="Lime shadow" value={shadowPct} min={0} max={40} unit="%" onChange={setShadowPct} />
          <button
            type="button"
            data-sfx="click"
            className="min-h-11 rounded-full border border-[var(--b-border)] px-4 font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-fg)] hover:text-[var(--b-accent)]"
            onClick={() => {
              setBlur(DEFAULTS.blur);
              setSaturate(DEFAULTS.saturate);
              setShadowPct(DEFAULTS.shadowPct);
            }}
          >
            Reset to starting values
          </button>
          <CopyChip value={`blur ${blur}px, saturate ${saturate}%`} copyValue={css} label="Copy glass CSS" />
        </Card>
        <div
          className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] p-6"
          style={{ background: "linear-gradient(135deg, #17C9E2 0%, #050605 45%, #CAF14A 100%)" }}
        >
          <div
            role="group"
            aria-label="Glass preview"
            className="relative w-full max-w-sm space-y-2 overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] p-5"
            style={{
              background: "color-mix(in srgb, var(--b-surface) 58%, transparent)",
              backdropFilter: `blur(${blur}px) saturate(${saturate}%) brightness(1.08)`,
              WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate}%) brightness(1.08)`,
              boxShadow: `inset 0 1px 0 color-mix(in srgb, #fff 30%, transparent), ${shadow}`,
            }}
          >
            <p className="text-xl font-semibold tracking-tight text-[var(--b-fg)]">Glass over the real surface</p>
            <p className="text-base text-[var(--b-muted)]">Translucent raised ink, soft top highlight, lime tinted shadow.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
