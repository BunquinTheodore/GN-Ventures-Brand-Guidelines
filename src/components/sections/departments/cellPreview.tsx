import type { AssetKind } from "@/content/asset-types";
import { assetsFor } from "@/content/assets";
import { BRANDS } from "@/content/brands";
import type { Swatch } from "@/content/types";
import type { ChapterPartKey } from "../brands/parts/shared";
import type { DepartmentId } from "./selection";

const MAX_DOTS = 5;
const MAX_TEXT = 72;

const LOGO_KINDS: readonly AssetKind[] = ["primary", "on-light", "mono-white", "mono-ink", "horizontal", "square", "mark"];
const IMAGERY_KINDS: readonly AssetKind[] = ["og", "mascot"];
const APPLICATION_KINDS: readonly AssetKind[] = ["app-icon", "og"];

function countKinds(brand: DepartmentId, kinds: readonly AssetKind[]): number {
  return assetsFor(brand).filter((a) => kinds.includes(a.kind)).length;
}

function trim(text: string, max = MAX_TEXT): string {
  const clean = text.trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}\u2026`;
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

const swatchColor = (s: Swatch): string | undefined => s.hex ?? s.css;

function dotSwatches(brand: DepartmentId): readonly Swatch[] {
  return BRANDS[brand].swatches.filter((s) => swatchColor(s) !== undefined).slice(0, MAX_DOTS);
}

/** Plain-text value of a cell, used for the accessible name. Mirrors what the preview draws. */
export function cellSummary(brand: DepartmentId, part: ChapterPartKey): string {
  const b = BRANDS[brand];
  switch (part) {
    case "essence": return trim(b.tagline ?? b.descriptor);
    case "logo": return plural(countKinds(brand, LOGO_KINDS), "logo file");
    case "color": return plural(dotSwatches(brand).length, "swatch", "swatches");
    case "type": return b.fonts.slice(0, 2).map((f) => f.family).join(", ");
    case "voice": return trim(b.voice[0] ?? "");
    case "components": return "Pill and card in the accent color";
    case "imagery": return plural(countKinds(brand, IMAGERY_KINDS), "image");
    case "applications": return plural(countKinds(brand, APPLICATION_KINDS), "application file");
    case "downloads": return plural(assetsFor(brand).length, "file");
  }
}

function Count({ n, unit }: { readonly n: number; readonly unit: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-mono text-xl font-semibold leading-none text-[var(--fog)]">{n}</span>
      <span className="text-[0.8125rem] leading-tight text-[var(--fog-dim)]">{unit}</span>
    </span>
  );
}

function Clamp({ text }: { readonly text: string }) {
  return <span className="line-clamp-3 text-left text-[0.8125rem] leading-snug text-[var(--fog)]">{text}</span>;
}

function Dots({ brand }: { readonly brand: DepartmentId }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5" aria-hidden="true">
      {dotSwatches(brand).map((s) => (
        <span
          key={s.name}
          className="h-4 w-4 rounded-full border border-[color-mix(in_srgb,#fff_30%,transparent)]"
          style={{ background: swatchColor(s) }}
        />
      ))}
    </span>
  );
}

function MiniComponents({ accent }: { readonly accent: string }) {
  return (
    <span className="flex flex-col items-start gap-1.5" aria-hidden="true">
      <span className="h-3.5 w-12 rounded-full" style={{ background: accent }} />
      <span className="flex h-7 w-16 flex-col justify-center gap-1 rounded-md border px-1.5" style={{ borderColor: accent }}>
        <span className="h-1 w-8 rounded-full" style={{ background: accent }} />
        <span className="h-1 w-5 rounded-full opacity-50" style={{ background: accent }} />
      </span>
    </span>
  );
}

function TypeNames({ brand }: { readonly brand: DepartmentId }) {
  return (
    <span className="flex flex-col gap-0.5 text-left text-[0.8125rem] leading-snug text-[var(--fog)]">
      {BRANDS[brand].fonts.slice(0, 2).map((f) => (
        <span key={f.family} className="truncate">{f.family}</span>
      ))}
    </span>
  );
}

/** Compact, read-only, data-driven preview of one cell. Everything comes from content/brands.ts and assets.ts. */
export default function CellPreview({ brand, part }: { readonly brand: DepartmentId; readonly part: ChapterPartKey }) {
  const b = BRANDS[brand];
  switch (part) {
    case "essence": return <Clamp text={cellSummary(brand, part)} />;
    case "logo": return <Count n={countKinds(brand, LOGO_KINDS)} unit="logo files" />;
    case "color": return <Dots brand={brand} />;
    case "type": return <TypeNames brand={brand} />;
    case "voice": return <Clamp text={cellSummary(brand, part)} />;
    case "components": return <MiniComponents accent={b.accent} />;
    case "imagery": return <Count n={countKinds(brand, IMAGERY_KINDS)} unit="og and mascot" />;
    case "applications": return <Count n={countKinds(brand, APPLICATION_KINDS)} unit="icon and og" />;
    case "downloads": return <Count n={assetsFor(brand).length} unit="files" />;
  }
}
