"use client";

import { useId, useState } from "react";
import { Button, CopyChip } from "@/components/ui";
import { sfx } from "@/lib/sfx";

/** The confirmed GN Media glass recipe. Sliders start here and can be reset to it. */
const RECIPE = { mix: 58, blur: 22, saturate: 165, radius: 1 } as const;

type RecipeKey = keyof typeof RECIPE;

interface SliderSpec {
  readonly key: RecipeKey;
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly unit: string;
}

const SLIDERS: readonly SliderSpec[] = [
  { key: "mix", label: "Raised mix", min: 20, max: 95, step: 1, unit: "%" },
  { key: "blur", label: "Blur", min: 0, max: 40, step: 1, unit: "px" },
  { key: "saturate", label: "Saturate", min: 100, max: 220, step: 5, unit: "%" },
  { key: "radius", label: "Radius", min: 0, max: 2, step: 0.25, unit: "rem" },
];

const SHADOW = "0 18px 48px -20px color-mix(in srgb, #b0e62f 32%, transparent)";

function recipeCss(v: Readonly<Record<RecipeKey, number>>): string {
  return [
    `background: color-mix(in srgb, #0d0d12 ${v.mix}%, transparent);`,
    `backdrop-filter: blur(${v.blur}px) saturate(${v.saturate}%);`,
    "border: 1px solid #ffffff1a;",
    `border-radius: ${v.radius}rem;`,
    `box-shadow: ${SHADOW};`,
  ].join(" ");
}

function isRecipe(v: Readonly<Record<RecipeKey, number>>): boolean {
  return (Object.keys(RECIPE) as RecipeKey[]).every((k) => v[k] === RECIPE[k]);
}

/** Live glass-panel lab: tune the four recipe values over a gradient backdrop and copy the CSS. */
export default function GlassRecipeLab() {
  const [values, setValues] = useState<Readonly<Record<RecipeKey, number>>>({ ...RECIPE });
  const baseId = useId();
  const css = recipeCss(values);
  const confirmed = isRecipe(values);

  function update(key: RecipeKey, next: number) {
    setValues((prev) => ({ ...prev, [key]: next }));
  }

  function reset() {
    sfx.play("toggle");
    setValues({ ...RECIPE });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div
        className="relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] p-6"
        style={{ background: "var(--b-bg)" }}
      >
        <span
          aria-hidden="true"
          className="absolute -left-10 top-4 h-44 w-44 rounded-full opacity-80"
          style={{ background: "var(--b-accent-2)", filter: "blur(28px)" }}
        />
        <span
          aria-hidden="true"
          className="absolute -right-8 bottom-2 h-48 w-48 rounded-full opacity-80"
          style={{ background: "var(--b-accent-3)", filter: "blur(30px)" }}
        />
        <span
          aria-hidden="true"
          className="absolute left-1/3 top-1/2 h-32 w-32 rounded-full opacity-90"
          style={{ background: "var(--b-accent)", filter: "blur(24px)" }}
        />
        <div
          role="group"
          aria-label="Glass panel preview"
          className="relative w-full max-w-sm space-y-3 p-6"
          style={{
            background: `color-mix(in srgb, var(--b-surface) ${values.mix}%, transparent)`,
            backdropFilter: `blur(${values.blur}px) saturate(${values.saturate}%)`,
            WebkitBackdropFilter: `blur(${values.blur}px) saturate(${values.saturate}%)`,
            border: "1px solid var(--b-border)",
            borderRadius: `${values.radius}rem`,
            boxShadow: SHADOW,
          }}
        >
          <p className="font-ui text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-accent)]">Wire</p>
          <p className="text-xl font-semibold text-[var(--b-fg)]">Glass over gradient. Readable.</p>
          <p className="text-base text-[var(--b-muted)]">Text stays on raised ink, so contrast holds as the blur moves.</p>
        </div>
      </div>

      <div className="space-y-4">
        {SLIDERS.map((s) => {
          const id = `${baseId}-${s.key}`;
          return (
            <div key={s.key} className="space-y-1">
              <label htmlFor={id} className="flex items-center justify-between font-ui text-sm font-medium text-[var(--b-fg)]">
                <span>{s.label}</span>
                <span className="font-mono text-[var(--b-accent)]">
                  {values[s.key]}
                  {s.unit}
                </span>
              </label>
              <input
                id={id}
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={values[s.key]}
                onChange={(e) => update(s.key, Number(e.target.value))}
                className="h-11 w-full cursor-pointer accent-[var(--b-accent)]"
              />
            </div>
          );
        })}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={reset} data-sfx="toggle">
            Reset to recipe
          </Button>
          <span className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]" aria-live="polite">
            {confirmed ? "Matches the GN Media recipe" : "Custom, not the recipe"}
          </span>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-[var(--b-border)] p-3 font-mono text-xs leading-relaxed text-[var(--b-muted)]">
          <code>{css.replaceAll("; ", ";\n")}</code>
        </pre>
        <CopyChip value="Copy glass CSS" copyValue={css} label="Copy the glass panel CSS" />
      </div>
    </div>
  );
}
