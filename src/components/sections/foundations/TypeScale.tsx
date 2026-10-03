import type { CSSProperties } from "react";
import { GlowCard, SectionShell } from "@/components/ui";
import { SourceBadge, SpecTable, SubHead, type SourceKind } from "./Parts";

interface ScaleStep {
  readonly token: string;
  readonly sample: string;
  readonly spec: string;
  readonly style: CSSProperties;
  readonly source: SourceKind;
}

const DISPLAY: CSSProperties = {
  fontFamily: "var(--font-josefin), 'Josefin Sans', sans-serif",
  fontWeight: 300,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};
const BODY = "var(--font-manrope), 'Manrope', system-ui, sans-serif";
const UI = "var(--font-poppins), 'Poppins', system-ui, sans-serif";

const STEPS: readonly ScaleStep[] = [
  { token: "Display", sample: "Built to be found", spec: "Josefin Sans 300, caps, 0.04em, clamp 44px to 72px, leading 1.05", style: { ...DISPLAY, fontSize: "clamp(2.75rem, 7vw, 4.5rem)", lineHeight: 1.05 }, source: "Proposed" },
  { token: "H1", sample: "News. Insights. Future.", spec: "Josefin Sans 300, caps, 0.04em, clamp 36px to 56px, leading 1.08", style: { ...DISPLAY, fontSize: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: 1.08 }, source: "Proposed" },
  { token: "H2", sample: "Core colors", spec: "Josefin Sans 300, caps, 0.04em, clamp 32px to 56px, leading 1.08", style: { ...DISPLAY, fontSize: "clamp(2rem, 4.6vw, 3.5rem)", lineHeight: 1.08 }, source: "As built" },
  { token: "H3", sample: "Per department, sampled values", spec: "Manrope 600, 24px, leading 1.25", style: { fontFamily: BODY, fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.25 }, source: "Proposed" },
  { token: "Lead", sample: "A friend who trades. Not a bank.", spec: "Manrope 400, 18px, leading 1.65", style: { fontFamily: BODY, fontSize: "1.125rem", lineHeight: 1.65 }, source: "As built" },
  { token: "Body", sample: "Plain, practical copy that anyone can read on a phone.", spec: "Manrope 400, 16px minimum, leading 1.65", style: { fontFamily: BODY, fontSize: "1rem", lineHeight: 1.65 }, source: "Sourced" },
  { token: "Small", sample: "Captions and meta only, never body copy.", spec: "Manrope 400, 14px, leading 1.5", style: { fontFamily: BODY, fontSize: "0.875rem", lineHeight: 1.5 }, source: "Proposed" },
  { token: "Eyebrow", sample: "FOUNDATIONS", spec: "Poppins 500, 13px, caps, 0.12em", style: { fontFamily: UI, fontWeight: 500, fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.12em" }, source: "As built" },
  { token: "UI label", sample: "GET STARTED", spec: "Poppins 600, 14px, caps, 0.08em", style: { fontFamily: UI, fontWeight: 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em" }, source: "As built" },
];

const ACADEMY_SCALE: readonly (readonly [string, number])[] = [
  ["micro", 12], ["xs", 13], ["sm", 15], ["base", 17], ["lg", 19], ["xl", 21],
];

const EXCEPTIONS: readonly (readonly string[])[] = [
  ["GN Labs", "h1 is Manrope semibold, tracking-tight, balanced. Not Josefin. Josefin is for the splash and labels only."],
  ["GN Academy", "Josefin Light caps at 0.05em tracking. Raised scale below, 17px base."],
  ["Mazal social kit", "Archivo only: 900 headlines and stats, 800 pills and CTAs, 700 body. Flat, no glow."],
  ["GN Commune", "Manrope 300 large headings, Jost 300 wordmark, 10px caps tracked eyebrows in Jost, Inter body, Caveat accent, IBM Plex Mono labels."],
];

function ScaleRow({ step }: { readonly step: ScaleStep }) {
  return (
    <div className="grid gap-3 border-b border-[var(--b-border)] py-6 last:border-0 lg:grid-cols-[9rem_minmax(0,1fr)_16rem] lg:items-center lg:gap-8">
      <div className="flex items-center gap-3 lg:block">
        <p className="font-ui text-sm font-semibold text-[var(--b-fg)]">{step.token}</p>
        <div className="lg:mt-2"><SourceBadge kind={step.source} /></div>
      </div>
      <p className="min-w-0 text-[var(--b-fg)]" style={step.style}>{step.sample}</p>
      <p className="font-mono text-xs leading-relaxed text-[var(--b-muted)]">{step.spec}</p>
    </div>
  );
}

function AcademyScale() {
  return (
    <div
      data-brand="academy"
      className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-5 md:p-6"
      style={{ background: "var(--b-bg)", color: "var(--b-fg)" }}
    >
      <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">GN Academy raised scale (light theme)</p>
      <ul className="mt-4 space-y-2">
        {ACADEMY_SCALE.map(([name, px]) => (
          <li key={name} className="flex items-baseline gap-4">
            <span className="w-16 shrink-0 font-mono text-xs text-[var(--b-muted)]">{name} {px}</span>
            <span style={{ fontFamily: BODY, fontSize: `${px}px`, lineHeight: 1.4 }}>Score it. Prove it. Get hired for it.</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LabsH1() {
  return (
    <div data-brand="labs" className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-5 md:p-6" style={{ background: "var(--b-bg)", color: "var(--b-fg)" }}>
      <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">GN Labs h1 exception</p>
      <p
        className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)]"
        style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, textWrap: "balance" }}
      >
        AI integration for business
      </p>
      <p className="mt-3 font-mono text-xs text-[var(--b-muted)]">Manrope 600, tracking-tight, balanced. Sentence case.</p>
    </div>
  );
}

export default function TypeScale() {
  return (
    <SectionShell
      id="type-scale"
      num="12"
      eyebrow="Foundations"
      title="Type scale"
      lead="Rendered at true size. Titles are Josefin Sans caps, UI is Poppins, body is Manrope at 16px or larger. The sourced rules are tagged, the rest is how this site is built or a proposal."
    >
      <GlowCard className="!p-5 md:!p-8">
        {STEPS.map((s) => (
          <ScaleRow key={s.token} step={s} />
        ))}
      </GlowCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <SubHead title="Per department scale" note="Academy raises every step for readability. Labs breaks from Josefin on h1." />
          <div className="space-y-5">
            <AcademyScale />
            <LabsH1 />
          </div>
        </div>
        <div>
          <SubHead title="Exceptions" />
          <SpecTable caption="Type scale exceptions per department" head={["Department", "Rule"]} minWidth="24rem" rows={EXCEPTIONS} />
          <div className="mt-5">
            <SpecTable
              caption="Core type rules"
              head={["Rule", "Value", "Status"]}
              minWidth="24rem"
              rows={[
                ["Title tracking", "+0.04em (Academy 0.05em)", <SourceBadge key="a" kind="Sourced" />],
                ["Nav tracking", "0.1em to 0.12em, uppercase", <SourceBadge key="b" kind="Sourced" />],
                ["Body minimum", "16px", <SourceBadge key="c" kind="Sourced" />],
                ["Touch target", "44px minimum", <SourceBadge key="d" kind="Sourced" />],
              ]}
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
