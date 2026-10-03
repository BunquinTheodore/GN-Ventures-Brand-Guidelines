import { Badge, CopyChip } from "@/components/ui";
import type { BrandId, FontSpec } from "@/content/types";
import { Card, DISPLAY_CLS, PartFrame, SubHeading, brandOf, resolveGlass, type ChapterPartProps } from "./shared";

type Role = "display" | "body" | "ui" | "mono";

interface ScaleStep {
  readonly label: string;
  readonly px: number;
  readonly role: Role;
  readonly weight?: number;
  readonly caps?: boolean;
}

const ROLE_FONT: Readonly<Record<Role, string>> = {
  display: "var(--b-font-display)",
  body: "var(--b-font-body)",
  ui: "var(--b-font-ui)",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
};

const PROPOSED_SCALE: readonly ScaleStep[] = [
  { label: "Display", px: 56, role: "display" },
  { label: "Heading 2", px: 40, role: "display" },
  { label: "Heading 3", px: 28, role: "body", weight: 600 },
  { label: "Lead", px: 20, role: "body" },
  { label: "Body", px: 16, role: "body" },
  { label: "UI label", px: 14, role: "ui", weight: 600, caps: true },
  { label: "Caption", px: 12, role: "body" },
];

/** GN Academy's raised scale is a real token set, in px. */
const ACADEMY_SCALE: readonly ScaleStep[] = [
  { label: "xl", px: 21, role: "body" },
  { label: "lg", px: 19, role: "body" },
  { label: "base", px: 17, role: "body" },
  { label: "sm", px: 15, role: "body" },
  { label: "xs", px: 13, role: "body" },
  { label: "micro", px: 12, role: "ui", weight: 500, caps: true },
];

const WEIGHT_STEP = 100;

/** "300" -> [300]; "400 to 700" -> [400..700]; "400, 500, 600" -> each. */
export function parseWeights(spec: string): readonly number[] {
  const nums = (spec.match(/\d{3}/g) ?? []).map(Number);
  if (/\bto\b/.test(spec) && nums.length === 2) {
    const [lo, hi] = nums;
    return Array.from({ length: (hi - lo) / WEIGHT_STEP + 1 }, (_, i) => lo + i * WEIGHT_STEP);
  }
  return nums.length > 0 ? nums : [400];
}

function Specimen({ font, brand, glass, sample }: { readonly font: FontSpec; readonly brand: BrandId; readonly glass: boolean; readonly sample: string }) {
  const family = `${font.cssVar ? `var(${font.cssVar}), ` : ""}"${font.family}", system-ui, sans-serif`;
  return (
    <Card brand={brand} glass={glass} className="flex flex-col gap-4">
      <div>
        <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]">{font.role}</p>
        <p className="mt-2 text-[clamp(2rem,4vw,3rem)] leading-tight text-[var(--b-fg)]" style={{ fontFamily: family, fontWeight: parseWeights(font.weights)[0] }}>
          {font.family}
        </p>
      </div>
      <p className="text-xl leading-snug text-[var(--b-fg)]" style={{ fontFamily: family, fontWeight: parseWeights(font.weights)[0] }}>
        {sample}
      </p>
      <p className="break-all text-lg leading-snug text-[var(--b-muted)]" style={{ fontFamily: family }}>
        ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-lg text-[var(--b-fg)]" style={{ fontFamily: family }}>
        {parseWeights(font.weights).map((w) => (
          <li key={w} style={{ fontWeight: w }}>
            Aa <span className="font-mono text-xs text-[var(--b-muted)]">{w}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{font.weights}</Badge>
        <CopyChip value={font.googleName} label={`Copy Google Fonts name for ${font.family}`} />
      </div>
    </Card>
  );
}

function ScaleRow({ step, sample }: { readonly step: ScaleStep; readonly sample: string }) {
  return (
    <li className="grid gap-1 border-b border-[var(--b-border)] py-3 last:border-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
      <span className="font-mono text-xs text-[var(--b-muted)]">
        {step.label} / {step.px} px
      </span>
      <span
        className={`text-[var(--b-fg)] ${step.role === "display" ? DISPLAY_CLS : ""} ${step.caps ? "uppercase tracking-[0.1em]" : ""}`}
        style={{ fontSize: `${step.px / 16}rem`, lineHeight: 1.2, fontFamily: ROLE_FONT[step.role], fontWeight: step.weight }}
      >
        {sample}
      </span>
    </li>
  );
}

/** Type: live specimens in this brand's own fonts, plus a live type scale. */
export default function ChapterType({ brand: id, glass: g, className }: ChapterPartProps) {
  const brand = brandOf(id);
  const glass = resolveGlass(id, g);
  const sample = brand.tagline ?? brand.name;
  const real = id === "academy";
  return (
    <PartFrame
      brand={id}
      part="type"
      title="Type"
      lead={`${brand.fonts.length} typefaces carry ${brand.name}. Each specimen below renders in the real font.`}
      className={className}
    >
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {brand.fonts.map((f) => (
          <li key={f.family} className="flex">
            <div className="flex w-full">
              <Specimen font={f} brand={id} glass={glass} sample={sample} />
            </div>
          </li>
        ))}
      </ul>
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <SubHeading>Type scale</SubHeading>
          {real ? <Badge tone="accent">Brand token</Badge> : <Badge tone="amber">Proposed</Badge>}
        </div>
        <Card brand={id} glass={glass}>
          <ul>
            {(real ? ACADEMY_SCALE : PROPOSED_SCALE).map((s) => (
              <ScaleRow key={s.label} step={s} sample={s.role === "ui" ? "Label text" : sample} />
            ))}
          </ul>
        </Card>
      </div>
    </PartFrame>
  );
}
