import type { ReactNode } from "react";
import { Badge, GlowCard, SectionShell } from "@/components/ui";
import { CardTitle, LogoImg, UsageTable } from "./shared";

const RULES: readonly { readonly title: string; readonly body: string }[] = [
  { title: "16:9 on ink", body: "Slides are 16:9 on the ink base (#08090A). Light slides are used only for Academy material." },
  { title: "Safe margins", body: "Keep text and logos inside an inset margin on every edge. Nothing important touches the slide edge." },
  { title: "Anatomy", body: "Eyebrow, then headline, then body. One idea per slide, left aligned, generous space." },
  { title: "One gradient per slide", body: "A single cyan to lime to amber element: a thin rule, a logo frame or one soft glow. Never several." },
];

const SPEC_ROWS: readonly (readonly ReactNode[])[] = [
  ["Canvas", "16:9, ink #08090A", <Badge key="a" tone="amber">Proposed</Badge>],
  ["Safe margin", "Inset on all four edges, same value", <Badge key="b" tone="amber">Proposed</Badge>],
  ["Eyebrow", "Poppins 500, uppercase, 0.12em tracking, lime", <Badge key="c" tone="amber">Proposed</Badge>],
  ["Headline", "Josefin Sans 300, caps, +0.04em tracking, fog", <Badge key="d" tone="amber">Proposed</Badge>],
  ["Body", "Manrope, fog dim, plain sentences", <Badge key="e" tone="amber">Proposed</Badge>],
  ["Logo", "Real lockup file only, never redrawn or recolored", <Badge key="f" tone="amber">Proposed</Badge>],
];

function Slide({ label, children, guide = false }: { readonly label: string; readonly children: ReactNode; readonly guide?: boolean }) {
  return (
    <figure className="m-0">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--ink)]" role="group" aria-label={label}>
        <div className="absolute inset-0" aria-hidden="true" style={{ background: "radial-gradient(60% 70% at 0% 0%, color-mix(in srgb, var(--lime) 14%, transparent), transparent 70%)" }} />
        {guide ? <div aria-hidden="true" className="absolute inset-[6%] rounded-sm border border-dashed border-[color-mix(in_srgb,var(--cyan)_70%,transparent)]" /> : null}
        <div className="absolute inset-[6%] flex flex-col">{children}</div>
      </div>
      <figcaption className="mt-2 text-sm text-[var(--b-muted)]">{label}</figcaption>
    </figure>
  );
}

function Eyebrow({ children }: { readonly children: string }) {
  return <p className="font-ui text-[clamp(0.45rem,1.1vw,0.75rem)] font-medium uppercase tracking-[0.12em] text-[var(--lime)]">{children}</p>;
}

function Headline({ children }: { readonly children: string }) {
  return <p className="mt-1 font-display text-[clamp(1rem,3.2vw,2.2rem)] font-light uppercase leading-[1.05] tracking-[0.04em] text-[var(--fog)]">{children}</p>;
}

function Rule() {
  return <span aria-hidden="true" className="mt-2 block h-[3px] w-1/3 rounded-full" style={{ background: "var(--brand-gradient)" }} />;
}

function Deck() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <Slide label="Title slide, with the safe margin drawn in" guide>
        <LogoImg id="ventures-horizontal" alt="GN Ventures logo" className="w-[24%]" sizes="160px" />
        <div className="mt-auto">
          <Eyebrow>Brand guidelines</Eyebrow>
          <Headline>GN Ventures</Headline>
          <Rule />
        </div>
      </Slide>
      <Slide label="Content slide: eyebrow, headline, body">
        <Eyebrow>Departments</Eyebrow>
        <Headline>Six departments. One family.</Headline>
        <p className="mt-2 max-w-[75%] text-[clamp(0.55rem,1.25vw,0.95rem)] leading-snug text-[var(--fog-dim)]">Media, Academy, Club, Labs, Mazal and Commune.</p>
      </Slide>
      <Slide label="Closing slide">
        <div className="my-auto flex flex-col items-center gap-2 text-center">
          <LogoImg id="ventures-horizontal" alt="GN Ventures logo" className="w-[26%]" sizes="160px" />
          <p className="text-[clamp(0.55rem,1.25vw,0.95rem)] text-[var(--fog-dim)]">Proposed template. Owner sign-off pending.</p>
        </div>
      </Slide>
    </div>
  );
}

export default function Presentations() {
  return (
    <SectionShell
      id="presentations"
      num="19"
      eyebrow="Presentations"
      title="Decks that look like the family"
      lead={
        <p>
          Deck guidance is <strong className="text-[var(--b-fg)]">Proposed</strong>: no official GN template has been signed off. The rules below are drawn from the site look and need owner approval before they become standard.
        </p>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Deck rules">
        {RULES.map((r, i) => (
          <GlowCard as="li" key={r.title} zoom shineDelay={i * 0.5} className="list-none">
            <Badge tone="amber" className="mb-3">Proposed</Badge>
            <h3 className="mb-2 text-lg text-[var(--b-fg)]">{r.title}</h3>
            <p className="text-[0.9375rem] text-[var(--b-muted)]">{r.body}</p>
          </GlowCard>
        ))}
      </ul>

      <div>
        <CardTitle eyebrow="Live examples" title="Mini slides" badge={<Badge tone="amber">Proposed</Badge>} />
        <Deck />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <CardTitle eyebrow="Spec" title="Slide anatomy" />
          <UsageTable caption="Proposed slide specification" head={["Element", "Rule", "Status"]} rows={SPEC_ROWS} />
        </div>
        <GlowCard className="self-start">
          <CardTitle eyebrow="Existing material" title="GN Club University Deck" />
          <p className="text-[0.9375rem] text-[var(--b-muted)]">
            A deck called <strong className="text-[var(--b-fg)]">GN Club University Deck</strong> exists in Canva. It is private, so no link is published here. Review it against these rules before treating it as the reference.
          </p>
        </GlowCard>
      </div>
    </SectionShell>
  );
}
