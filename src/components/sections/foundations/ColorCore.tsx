import { Badge, GlowCard, SectionShell, SwatchCard } from "@/components/ui";
import type { Swatch } from "@/content/types";
import { Dot, Split, SpecTable, SubHead } from "./Parts";

const LIMES: readonly Swatch[] = [
  { name: "Media lime", hex: "#B0E62F", role: "GN Media accent", group: "Lime" },
  { name: "Club lime", hex: "#C6F24E", role: "GN Club accent. Mid-range, so the proposed canonical value", group: "Lime" },
  { name: "Labs lime", hex: "#CAF14A", role: "GN Labs accent", group: "Lime" },
  { name: "Mazal lime", hex: "#C0F030", role: "Mazal web accent and social kit Cyber Lime", group: "Lime" },
  { name: "Academy lime", hex: "#C8F048", css: "oklch(0.897 0.192 122)", role: "GN Academy brand neon lime. Hex is approximate", group: "Lime" },
];

const CYANS: readonly Swatch[] = [
  { name: "Labs cyan", hex: "#17C9E2", role: "Low end of the sampled cyan range", group: "Cyan" },
  { name: "Club cyan", hex: "#33C7E0", role: "Club and umbrella gradient start", group: "Cyan" },
  { name: "Media cyan", hex: "#3ED6D6", role: "High end of the sampled cyan range", group: "Cyan" },
  { name: "Academy cyan", hex: "#08C0E8", css: "oklch(0.748 0.135 220)", role: "Academy secondary accent. Hex is approximate", group: "Cyan" },
];

const AMBERS: readonly Swatch[] = [
  { name: "Club amber", hex: "#F2B84E", role: "Low end of the sampled amber range, umbrella gradient end", group: "Amber" },
  { name: "Media amber", hex: "#F2C14E", role: "Media gradient end", group: "Amber" },
  { name: "Labs amber", hex: "#F5DC2C", role: "High end of the sampled amber range", group: "Amber" },
];

const GRADIENTS: readonly Swatch[] = [
  { name: "Umbrella gradient", css: "linear-gradient(90deg, #33C7E0, #C6F24E, #F2B84E)", role: "Proposed: cyan, lime, amber, left to right. Mirrors the logo frame stroke", group: "Gradient" },
  { name: "Media gradient", css: "linear-gradient(90deg, #3ED6D6, #B0E62F, #F2C14E)", role: "GN Media: cyan, lime, amber", group: "Gradient" },
  { name: "Labs gradient", css: "linear-gradient(90deg, #17C9E2, #F5DC2C)", role: "GN Labs: 90 degrees, cyan to amber", group: "Gradient" },
];

const STATES: readonly Swatch[] = [
  { name: "Media error", hex: "#F87171", role: "GN Media error state", group: "State" },
  { name: "Labs destructive", css: "oklch(0.65 0.22 25)", role: "GN Labs errors", group: "State" },
  { name: "Academy destructive", css: "oklch(0.55 0.22 27)", role: "GN Academy errors and destructive actions", group: "State" },
  { name: "Academy verified gold", css: "oklch(0.665 0.115 79)", role: "Verified credentials ONLY. Never decoration", group: "State" },
  { name: "Mazal Stop Red", hex: "#FF5959", role: "Mazal social kit: stop-loss values ONLY", group: "State" },
];

interface SiteRow {
  readonly dept: string;
  readonly lime: string;
  readonly cyan?: string;
  readonly amber?: string;
  readonly base: string;
  readonly note: string;
}

const SITE_ROWS: readonly SiteRow[] = [
  { dept: "GN Media", lime: "#B0E62F", cyan: "#3ED6D6", amber: "#F2C14E", base: "#0A0A0F", note: "Gradient cyan, lime, amber" },
  { dept: "GN Academy", lime: "#C8F048", cyan: "#08C0E8", base: "#F5F7FA", note: "Light first. Hex values approximate (oklch). No amber token: gold is credentials only" },
  { dept: "GN Club", lime: "#C6F24E", cyan: "#33C7E0", amber: "#F2B84E", base: "#08090A", note: "Source of the proposed canonical lime" },
  { dept: "GN Labs", lime: "#CAF14A", cyan: "#17C9E2", amber: "#F5DC2C", base: "#050605", note: "Gradient is two stops: cyan to amber" },
  { dept: "Mazal", lime: "#C0F030", base: "#000000", note: "No cyan or amber. Web secondary is blue #0128A9, ambient light only in the social kit" },
  { dept: "GN Commune", lime: "none", base: "#000000", note: "Strictly black and white by owner directive. No hue" },
];

function optional(hex?: string) {
  return hex ? <Dot hex={hex} /> : <span className="text-[var(--b-subtle,var(--b-muted))]">None</span>;
}

function SwatchGrid({ swatches, cols = "sm:grid-cols-2 lg:grid-cols-4" }: { readonly swatches: readonly Swatch[]; readonly cols?: string }) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {swatches.map((s) => (
        <SwatchCard key={s.name} swatch={s} />
      ))}
    </div>
  );
}

function LimeBar() {
  return (
    <div role="img" aria-label="Five sampled limes side by side: Media, Club, Labs, Mazal, Academy" className="flex overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)]">
      {LIMES.map((l) => (
        <div key={l.name} className="flex h-28 flex-1 items-end p-2.5 sm:h-36" style={{ background: l.hex }}>
          <span className="font-mono text-[0.6875rem] font-medium text-[#08090a] sm:text-xs">{l.hex?.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

function CanonicalCard() {
  return (
    <GlowCard className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="amber">Proposed</Badge>
        <span className="font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">Canonical GN Lime</span>
      </div>
      <div className="h-32 rounded-[var(--b-radius)] border border-[var(--b-border)]" style={{ background: "#C6F24E" }} aria-hidden="true" />
      <p className="font-mono text-3xl text-[var(--b-fg)]">#C6F24E</p>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">
        The five sampled limes span Media&apos;s #B0E62F to Labs&apos; #CAF14A. GN Club&apos;s value is mid-range, so it is proposed as the single umbrella lime. This needs owner sign-off before any department changes its own token.
      </p>
    </GlowCard>
  );
}

export default function ColorCore() {
  return (
    <SectionShell
      id="color-core"
      num="09"
      eyebrow="Foundations"
      title="Core colors"
      lead="There is no official umbrella palette. This one is derived from the family sites: one lime, a cyan range, an amber range and the gradient from the logo frame. Click any swatch to copy its value."
    >
      <div>
        <SubHead title="The lime" note="Five departments sample five slightly different limes. They are close, not identical." />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <CanonicalCard />
          <div className="space-y-5">
            <LimeBar />
            <SwatchGrid swatches={LIMES} cols="sm:grid-cols-2 xl:grid-cols-3" />
          </div>
        </div>
      </div>

      <Split>
        <div>
          <SubHead title="Cyan range" note="Sampled #17C9E2 to #3ED6D6. Academy's approximate cyan sits just outside it." />
          <SwatchGrid swatches={CYANS} cols="grid-cols-2" />
        </div>
        <div>
          <SubHead title="Amber range" note="Sampled #F2B84E to #F5DC2C. Academy's logo amber (#F8D028) is deliberately not a UI token." />
          <SwatchGrid swatches={AMBERS} cols="grid-cols-2 sm:grid-cols-3" />
        </div>
      </Split>

      <div>
        <SubHead title="Signature gradient" note="Left to right: cyan, lime, amber, the same stroke as the logo frame. Keep it to the logo frame and thin edges." />
        <SwatchGrid swatches={GRADIENTS} cols="md:grid-cols-3" />
      </div>

      <div>
        <SubHead title="Per department, sampled values" note="Values as found on each department's own site. Nothing here has been normalized." />
        <SpecTable
          caption="Sampled lime, cyan, amber and base color per department"
          head={["Department", "Lime", "Cyan", "Amber", "Base", "Notes"]}
          minWidth="52rem"
          rows={SITE_ROWS.map((r) => [
            r.dept,
            r.lime === "none" ? <span key="l">None</span> : <Dot key="l" hex={r.lime} />,
            optional(r.cyan),
            optional(r.amber),
            <Dot key="b" hex={r.base} />,
            r.note,
          ])}
        />
      </div>

      <div>
        <SubHead title="State colors" note="Only values the departments already define. There is no umbrella error color and none is proposed here." />
        <SwatchGrid swatches={STATES} cols="sm:grid-cols-2 lg:grid-cols-5" />
      </div>
    </SectionShell>
  );
}
