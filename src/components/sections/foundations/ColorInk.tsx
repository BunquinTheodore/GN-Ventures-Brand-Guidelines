import { Badge, ContrastTable, GlowCard, SectionShell, SwatchCard } from "@/components/ui";
import type { Swatch } from "@/content/types";
import { contrastRatio, parseHex, wcagGrade, type WcagGrade } from "@/lib/contrast";
import { Dot, SpecTable, SubHead } from "./Parts";

const INKS: readonly Swatch[] = [
  { name: "Media ink", hex: "#0A0A0F", role: "GN Media background. Raised #0D0D12", group: "Ink" },
  { name: "Club ink", hex: "#08090A", role: "GN Club background and this site's base. Raised #111316, deep #030404", group: "Ink" },
  { name: "Labs ink", hex: "#050605", role: "GN Labs background. Raised #0E120D, deep #010201", group: "Ink" },
  { name: "Mazal web black", hex: "#000000", role: "Mazal web background. Navy #0E1220, ink #020615", group: "Ink" },
  { name: "Mazal social navy", hex: "#04070C", role: "Mazal social kit plate, gradient to #05090F", group: "Ink" },
];

const FG_ON_INK: readonly Swatch[] = [
  { name: "Fog", hex: "#F3F4F0", role: "Primary text", group: "Text" },
  { name: "Fog dim (muted)", hex: "#9A9DA3", role: "Secondary text", group: "Text" },
  { name: "Lime", hex: "#C6F24E", role: "Accent", group: "Text" },
];
const INK_BG: readonly Swatch[] = [{ name: "Ink", hex: "#08090A", role: "Base", group: "Ink" }];
const INK_ON_LIME_FG: readonly Swatch[] = [{ name: "Ink", hex: "#08090A", role: "Text on lime", group: "Ink" }];
const LIME_BG: readonly Swatch[] = [{ name: "Lime", hex: "#C6F24E", role: "Button fill", group: "Brand" }];

const ACADEMY_FG: readonly Swatch[] = [
  { name: "Foreground (light)", css: "oklch(0.22 0.012 250)", role: "Text on light", group: "Light" },
  { name: "Primary (light)", css: "oklch(0.52 0.145 122)", role: "Deep lime", group: "Light" },
];
const ACADEMY_BG: readonly Swatch[] = [
  { name: "Background (light)", hex: "#F5F7FA", css: "oklch(0.977 0.004 247)", role: "Light base", group: "Light" },
];
const ACADEMY_BRAND_FG: readonly Swatch[] = [{ name: "Brand fg", css: "oklch(0.18 0.012 250)", role: "On neon lime", group: "Brand" }];
const ACADEMY_BRAND_BG: readonly Swatch[] = [{ name: "Brand neon lime", hex: "#C8F048", css: "oklch(0.897 0.192 122)", role: "Brand accent", group: "Brand" }];

/** White at the given opacity composited over a hex base, as an opaque hex. */
function whiteOver(alpha: number, baseHex: string): string {
  const base = parseHex(baseHex) ?? [0, 0, 0];
  return `#${base
    .map((c) => Math.round(255 * alpha + c * (1 - alpha)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

interface TonePair {
  readonly site: string;
  readonly role: string;
  readonly fg: string;
  readonly bg: string;
  readonly note?: string;
}

const TONE_PAIRS: readonly TonePair[] = [
  { site: "GN Media", role: "Foreground", fg: "#F2F2F0", bg: "#0A0A0F" },
  { site: "GN Media", role: "Muted", fg: "#8A8F98", bg: "#0A0A0F" },
  { site: "GN Media", role: "Accent lime", fg: "#B0E62F", bg: "#0A0A0F" },
  { site: "GN Media", role: "Accent fg on lime", fg: "#0A0A0F", bg: "#B0E62F" },
  { site: "GN Club", role: "Fog dim", fg: "#9A9DA3", bg: "#08090A" },
  { site: "GN Labs", role: "Mist", fg: "#EEF3F5", bg: "#050605" },
  { site: "GN Labs", role: "Mist dim", fg: "#97A2A8", bg: "#050605" },
  { site: "GN Labs", role: "Accent lime", fg: "#CAF14A", bg: "#050605" },
  { site: "Mazal web", role: "Text 72%", fg: whiteOver(0.72, "#000000"), bg: "#000000", note: "Composited" },
  { site: "Mazal web", role: "Text 50%", fg: whiteOver(0.5, "#000000"), bg: "#000000", note: "Composited" },
  { site: "Mazal web", role: "Lime on black", fg: "#C0F030", bg: "#000000" },
  { site: "Mazal social", role: "Muted", fg: "#8F94A8", bg: "#04070C" },
  { site: "Mazal social", role: "Stop Red (stop-loss only)", fg: "#FF5959", bg: "#04070C" },
  { site: "Commune dark", role: "Subtle", fg: "#9E9E9E", bg: "#000000" },
  { site: "Commune light", role: "Subtle", fg: "#616161", bg: "#FFFFFF" },
];

const GRADE_TONE: Readonly<Record<WcagGrade, "accent" | "amber" | "danger">> = {
  AAA: "accent",
  AA: "accent",
  "AA Large": "amber",
  Fail: "danger",
};

const GLASS_SITES = [
  { brand: "media", name: "GN Media", recipe: "Raised at 58%, blur 22px, saturate 165%" },
  { brand: "club", name: "GN Club", recipe: "White 6%, blur 20px, saturate 140%" },
  { brand: "labs", name: "GN Labs", recipe: "White 5.5%, strong 9.5%, highlight 50%" },
  { brand: "mazal", name: "Mazal web", recipe: "Card rgba(14,18,32,0.72), blur 26px, saturate 170%" },
] as const;

const BORDER_ROWS: readonly (readonly string[])[] = [
  ["GN Media", "#ffffff1a (10% white)", "Hairline"],
  ["GN Club", "rgba(255,255,255,0.14)", "Glass border. Glass 0.06, strong 0.10"],
  ["GN Labs", "rgba(255,255,255,0.14)", "Glass 0.055, strong 0.095, highlight 0.5"],
  ["Mazal web", "rgba(255,255,255,0.09)", "Stroke. Green stroke rgba(192,240,48,0.3). Card rgba(14,18,32,0.72)"],
  ["Commune dark", "Foreground 18% over background", "Line. Strong line is 38%"],
  ["Commune light", "Foreground 16% over background", "Line. Strong line is 36%"],
];

function GlassDemos() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {GLASS_SITES.map((s) => (
        <div
          key={s.brand}
          data-brand={s.brand}
          className="relative overflow-hidden rounded-[var(--b-radius)] p-4"
          style={{ background: "linear-gradient(135deg, #33C7E0 0%, #C6F24E 55%, #F2B84E 100%)" }}
        >
          <GlowCard className="!p-4">
            <p className="font-ui text-sm font-semibold text-[var(--b-fg)]">{s.name}</p>
            <p className="mt-1 text-[0.8125rem] leading-snug text-[var(--b-muted)]">{s.recipe}</p>
          </GlowCard>
        </div>
      ))}
    </div>
  );
}

function ToneTable() {
  return (
    <SpecTable
      caption="Contrast of each department's text and accent tones on its own base, computed from real hex"
      head={["Department", "Role", "Pair", "Ratio", "WCAG"]}
      minWidth="40rem"
      rows={TONE_PAIRS.map((p) => {
        const ratio = contrastRatio(p.fg, p.bg) ?? 0;
        const grade = wcagGrade(ratio);
        return [
          p.site,
          p.note ? `${p.role} (${p.note.toLowerCase()})` : p.role,
          <span key="pair" className="inline-flex items-center gap-2">
            <Dot hex={p.fg} />
            <span aria-hidden="true">on</span>
            <Dot hex={p.bg} />
          </span>,
          <span key="r" className="font-mono tabular-nums text-[var(--b-fg)]">{ratio.toFixed(2)}:1</span>,
          <Badge key="g" tone={GRADE_TONE[grade]}>{grade}</Badge>,
        ];
      })}
    />
  );
}

export default function ColorInk() {
  return (
    <SectionShell
      id="color-ink"
      num="10"
      eyebrow="Foundations"
      title="Ink and contrast"
      lead="Every dark GN surface sits on a near-black ink, never pure black except Mazal's web and Commune. Contrast below is computed from the real hex values, not eyeballed."
    >
      <div>
        <SubHead title="Ink bases" note="Each department's own page base. Raised and deep tiers are listed in the notes." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {INKS.map((s) => (
            <SwatchCard key={s.name} swatch={s} />
          ))}
        </div>
      </div>

      <div>
        <SubHead title="Glass tokens" note="Live glass on the cyan, lime, amber gradient. Each tile uses its department's own blur, saturation and edge." />
        <GlassDemos />
        <SpecTable
          className="mt-5"
          caption="Border and glass opacity per department"
          head={["Department", "Border", "Notes"]}
          minWidth="36rem"
          rows={BORDER_ROWS}
        />
      </div>

      <div>
        <SubHead title="Contrast: umbrella pairs" note="Fog, muted text and lime on the Club ink, then ink on lime. Computed with WCAG 2.x relative luminance." />
        <div className="grid gap-5 lg:grid-cols-2">
          <ContrastTable foregrounds={FG_ON_INK} backgrounds={INK_BG} caption="Text and accent on ink" />
          <ContrastTable foregrounds={INK_ON_LIME_FG} backgrounds={LIME_BG} caption="Text on the lime button fill" />
        </div>
      </div>

      <div>
        <SubHead title="Contrast: every department" note="Text tones as each site defines them. Mazal's translucent text is composited over black first. Academy values come from oklch and are approximate." />
        <ToneTable />
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ContrastTable foregrounds={ACADEMY_FG} backgrounds={ACADEMY_BG} caption="GN Academy, light theme" />
          <ContrastTable foregrounds={ACADEMY_BRAND_FG} backgrounds={ACADEMY_BRAND_BG} caption="GN Academy, brand fg on neon lime" />
        </div>
      </div>

      <GlowCard className="flex flex-wrap items-center gap-4">
        <Badge tone="amber">Proposed</Badge>
        <p className="min-w-0 flex-1 text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">
          Usage ratios (how much of a layout is ink, text, lime and gradient) are TBC. No department defines one, so none is invented here. The only rules on record are the ones in the Do and Don&apos;t lists: lime on near-black ink, gradient on the logo frame and thin edges, never lime text on light surfaces.
        </p>
      </GlowCard>
    </SectionShell>
  );
}
