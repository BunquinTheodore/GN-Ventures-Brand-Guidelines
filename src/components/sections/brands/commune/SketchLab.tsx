"use client";

import { useId, useState } from "react";
import { CopyChip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Doodle } from "./doodles";
import { FONT, Panel, SketchHeading, clampRotation } from "./ui";

const DEFAULT_ROTATION = -1;
const DEFAULT_OFFSET = 4;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--b-fg)]";

interface SliderProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly unit: string;
  readonly onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, unit, onChange }: SliderProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={cn("flex justify-between text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]", FONT.mono)}>
        <span>{label}</span>
        <span className="text-[var(--b-fg)]">{value}{unit}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("h-11 w-full accent-[var(--b-fg)]", FOCUS)}
      />
    </div>
  );
}

function InkLab() {
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);
  const [offset, setOffset] = useState(DEFAULT_OFFSET);
  const [grid, setGrid] = useState(true);
  const deg = clampRotation(rotation);
  const css = `border: 2px solid var(--fg); box-shadow: ${offset}px ${offset}px 0 var(--fg); transform: rotate(${deg}deg);`;
  return (
    <Panel title="Ink lab | hard shadow and tilt" rotate={-1}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          <Slider label="Rotation" value={rotation} min={-2} max={2} step={0.5} unit="deg" onChange={setRotation} />
          <Slider label="Shadow offset" value={offset} min={2} max={8} step={1} unit="px" onChange={setOffset} />
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={grid}
              data-sfx="toggle"
              onClick={() => setGrid(!grid)}
              className={cn("sk-ink sk-wobble min-h-11 bg-[var(--b-bg)] px-4 text-sm text-[var(--b-fg)]", FONT.mono, FOCUS)}
            >
              Notebook dots: {grid ? "on" : "off"}
            </button>
            <button
              type="button"
              data-sfx="click"
              onClick={() => {
                setRotation(DEFAULT_ROTATION);
                setOffset(DEFAULT_OFFSET);
              }}
              className={cn("sk-ink sk-wobble min-h-11 bg-[var(--b-bg)] px-4 text-sm text-[var(--b-fg)]", FONT.mono, FOCUS)}
            >
              Reset
            </button>
          </div>
          <CopyChip value={css} label="Copy the ink card CSS" />
        </div>
        <div className={cn("flex min-h-56 items-center justify-center rounded-[6px] border-2 border-dashed border-[var(--b-line-strong)] p-6", grid && "sk-dotted-bg")}>
          <div
            style={{ transform: `rotate(${deg}deg)`, boxShadow: `${offset}px ${offset}px 0 var(--b-fg)` }}
            className="sk-ink flex items-center gap-3 rounded-[6px_18px_8px_16px] bg-[var(--b-bg)] p-5"
          >
            <Doodle name="cup" className="h-14 w-14" />
            <p className={cn("text-2xl text-[var(--b-fg)]", FONT.hand)}>one coffee, please</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

const LINES: readonly (readonly [string, string, string])[] = [
  ["Solid 2px", "border-t-2 border-[var(--b-fg)]", "Outlines, underlines. Proposed use."],
  ["Dashed", "sk-dashed", "Tear lines and section breaks. Proposed use."],
  ["Dotted", "sk-dotted", "Leaders between a label and a value. Proposed use."],
];

function LineStyles() {
  return (
    <Panel title="Lines | solid, dashed, dotted" rotate={1}>
      <ul className="space-y-5">
        {LINES.map(([name, cls, note]) => (
          <li key={name} className="space-y-2">
            <div className={cn("w-full", cls)} aria-hidden="true" />
            <p className="flex flex-wrap items-baseline justify-between gap-x-3 text-base text-[var(--b-fg)]">
              <span className={FONT.mono}>{name}</span>
              <span className="text-sm text-[var(--b-muted)]">{note}</span>
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function PressDemo() {
  return (
    <Panel title="Press | the shadow collapses" rotate={-1}>
      <div className="flex flex-wrap items-center gap-5">
        <button
          type="button"
          data-sfx="click"
          className={cn(
            "sk-ink sk-wobble min-h-12 bg-[var(--b-fg)] px-6 text-base text-[var(--b-bg)] shadow-[4px_4px_0_var(--b-fg)] transition-transform motion-reduce:transition-none",
            "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--b-fg)]",
            FONT.mono,
            FOCUS,
          )}
        >
          Book the cart
        </button>
        <p className="max-w-xs text-base leading-relaxed text-[var(--b-muted)]">
          Hold it down. The hard shadow shrinks as the button sinks, with no blur at any point.
        </p>
      </div>
    </Panel>
  );
}

/** Brand-specific live demos that prove the sketchbook mechanics. */
export default function SketchLab() {
  return (
    <div className="space-y-4">
      <SketchHeading>Sketchbook lab</SketchHeading>
      <InkLab />
      <div className="grid gap-5 lg:grid-cols-2">
        <LineStyles />
        <PressDemo />
      </div>
    </div>
  );
}
