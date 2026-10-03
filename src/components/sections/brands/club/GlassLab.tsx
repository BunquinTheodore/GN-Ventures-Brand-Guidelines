"use client";

import { useState, type CSSProperties } from "react";
import { GlowCard } from "@/components/ui";
import { SubHeading } from "../parts";

const BLUR = { min: 0, max: 40, brand: 20 } as const;
const SATURATE = { min: 100, max: 200, brand: 140 } as const;

interface SliderProps {
  readonly id: string;
  readonly label: string;
  readonly unit: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly brand: number;
  readonly onChange: (v: number) => void;
}

function Slider({ id, label, unit, value, min, max, brand, onChange }: SliderProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center justify-between gap-3 font-ui text-sm font-medium uppercase tracking-[0.1em] text-[var(--b-fg)]">
        <span>{label}</span>
        <span className="font-mono text-[var(--b-accent)]">{value}{unit}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full cursor-pointer accent-[var(--b-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]"
      />
      <p className="text-xs text-[var(--b-muted)]">Brand value: {brand}{unit}</p>
    </div>
  );
}

/** Live glass tuner. Defaults are the GN Club recipe: blur 20px, saturate 140%. */
export default function GlassLab() {
  const [blur, setBlur] = useState<number>(BLUR.brand);
  const [saturate, setSaturate] = useState<number>(SATURATE.brand);
  const onBrand = blur === BLUR.brand && saturate === SATURATE.brand;
  const vars = { "--b-blur": `${blur}px`, "--b-saturate": `${saturate}%` } as CSSProperties;

  return (
    <div className="space-y-4">
      <SubHeading>Glass lab</SubHeading>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <GlowCard className="space-y-5">
          <Slider id="club-blur" label="Backdrop blur" unit="px" value={blur} min={BLUR.min} max={BLUR.max} brand={BLUR.brand} onChange={setBlur} />
          <Slider id="club-sat" label="Saturate" unit="%" value={saturate} min={SATURATE.min} max={SATURATE.max} brand={SATURATE.brand} onChange={setSaturate} />
          <button
            type="button"
            data-sfx="toggle"
            onClick={() => {
              setBlur(BLUR.brand);
              setSaturate(SATURATE.brand);
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-[var(--b-border)] px-5 font-ui text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-fg)] hover:border-[var(--b-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]"
          >
            Reset to brand
          </button>
          <p aria-live="polite" className="text-sm text-[var(--b-muted)]">
            {onBrand ? "On brand: blur 20px, saturate 140%." : "Off brand. Reset before using this look."}
          </p>
        </GlowCard>
        <div
          className="relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] p-6"
          style={{ background: "var(--b-bg)" }}
        >
          <span aria-hidden="true" className="absolute left-6 top-6 h-32 w-32 rounded-full" style={{ background: "var(--b-accent)" }} />
          <span aria-hidden="true" className="absolute bottom-6 right-10 h-36 w-36 rounded-full" style={{ background: "var(--b-accent-2)" }} />
          <span aria-hidden="true" className="absolute right-1/3 top-1/3 h-24 w-24 rounded-full" style={{ background: "var(--b-accent-3)" }} />
          <div className="gn-glass gn-shine relative z-10 w-full max-w-xs overflow-hidden p-6" style={vars}>
            <p className="font-ui text-sm font-semibold uppercase tracking-[0.12em] text-[var(--b-accent)]">Glass at {blur}px</p>
            <p className="mt-2 text-base text-[var(--b-fg)]">Lime, cyan and amber light shows through the pane. Raise saturate and the colors push harder.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
