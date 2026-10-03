import type { ReactNode } from "react";
import { Badge, GlowCard, SectionShell } from "@/components/ui";
import { CardTitle, UsageTable } from "./shared";

const TRADE_RULES: readonly { readonly rule: string; readonly detail: string }[] = [
  { rule: "Entry", detail: "Every trade post shows the entry." },
  { rule: "Stop", detail: "Every trade post shows the stop. Stop-loss values use Stop Red #FF5959, nowhere else." },
  { rule: "Target", detail: "Every trade post shows the target." },
  { rule: "R:R", detail: "Risk to reward is stated." },
  { rule: "Unrealised", detail: "Open trades are labeled unrealised until closed." },
  { rule: "Blurred member names", detail: "Member names in screenshots are blurred." },
];

const PROHIBITED: readonly (readonly [string, string])[] = [
  ["Guaranteed profit", "No outcome is guaranteed. Show the plan and the risk instead."],
  ["Risk-free", "Every trade carries risk. State entry, stop and target."],
  ["Easy money", "Plain and honest: Mazal is a community that teaches, not a shortcut."],
  ["Signals", "Mazal shares ideas and lessons in a community. It does not sell signals."],
  ["Hype", "No shouting, no countdown pressure, no exaggerated claims."],
  ["Unconfirmed partner names", "Name a partner only after the owner confirms it. Otherwise leave it out."],
];

function TradeCard() {
  const cell = "rounded-lg border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-fg)_5%,transparent)] p-2";
  return (
    <div data-brand="mazal" data-channel="social" className="rounded-xl border border-[var(--b-border)] bg-[var(--b-bg)] p-4" role="group" aria-label="Compliant trade post layout, sample values are placeholders">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-white" style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", fontWeight: 900 }}>Pair / asset</span>
        <Badge tone="neutral">Unrealised</Badge>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <div className={cell}><dt className="text-[var(--b-muted)]">Entry</dt><dd className="font-mono text-white">x.xx</dd></div>
        <div className={cell}><dt className="text-[var(--b-muted)]">Stop</dt><dd className="font-mono text-[#ff5959]">x.xx</dd></div>
        <div className={cell}><dt className="text-[var(--b-muted)]">Target</dt><dd className="font-mono text-white">x.xx</dd></div>
        <div className={cell}><dt className="text-[var(--b-muted)]">R:R</dt><dd className="font-mono text-[var(--b-accent)]">x : x</dd></div>
      </dl>
      <p className="mt-3 text-sm text-[var(--b-muted)]">
        Member: <span aria-hidden="true" className="select-none blur-[5px]">Member Name</span> <span className="sr-only">name blurred</span>
      </p>
      <p className="mt-2 text-[0.8125rem] text-[var(--b-muted)]">Layout sample. Values are placeholders, not a real trade.</p>
    </div>
  );
}

function GoldRule() {
  return (
    <div data-brand="academy" className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-ui text-xs font-medium uppercase tracking-[0.1em]" style={{ borderColor: "var(--b-accent-3)", color: "var(--b-accent-3)", background: "color-mix(in oklch, var(--b-accent-3) 12%, transparent)" }}>
          Verified credential
        </span>
        <code className="font-mono text-sm text-[var(--b-muted)]">oklch(0.665 0.115 79)</code>
      </div>
      <p className="text-[0.9375rem] text-[var(--b-muted)]">
        Verified gold is used for a verified credential and nothing else. The logo amber (#F8D028) is deliberately not a token. Never use gold for decoration, prices or warnings.
      </p>
    </div>
  );
}

const SIMPLE_RULES: readonly (readonly ReactNode[])[] = [
  ["No invented stats or prices", "Facts only from the brand spec or the owner. Unknown values read TBC or Proposed.", <Badge key="1" tone="accent">Required</Badge>],
  ["GN Media rates", "Print Inquire for rates. Never a price.", <Badge key="2" tone="accent">Required</Badge>],
  ["No testimonials or partner logos", "None unless confirmed by the owner in writing.", <Badge key="3" tone="accent">Required</Badge>],
  ["Partner disclosure", "Disclose commercial partners and sponsored content clearly where they appear.", <Badge key="4" tone="amber">Proposed</Badge>],
  ["Disclaimer wording", "Trading and credential disclaimers. Owner: TBC.", <Badge key="5" tone="amber">TBC</Badge>],
];

export default function Compliance() {
  return (
    <SectionShell
      id="compliance"
      num="21"
      eyebrow="Compliance"
      title="The non-negotiables"
      lead={<p>These rules protect members and the brand. Some are fixed by the Mazal brand kit and the Academy tokens. Others are Proposed or TBC and need an owner.</p>}
    >
      <div role="note" className="rounded-[var(--b-radius)] border border-[color-mix(in_srgb,var(--amber)_55%,transparent)] bg-[color-mix(in_srgb,var(--amber)_10%,transparent)] p-4 text-[var(--b-fg)]">
        <Badge tone="amber" className="mr-2">Not final</Badge>
        Legal wording is not final. Nothing on this page is legal advice. Disclaimer text must be written and approved by the owner and legal counsel before use.
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <GlowCard>
          <CardTitle eyebrow="Mazal" title="Trade post rules" />
          <ul className="mb-5 grid gap-2 sm:grid-cols-2">
            {TRADE_RULES.map((r) => (
              <li key={r.rule} className="list-none rounded-lg border border-[var(--b-border)] p-3">
                <p className="font-medium text-[var(--b-fg)]">{r.rule}</p>
                <p className="text-sm text-[var(--b-muted)]">{r.detail}</p>
              </li>
            ))}
          </ul>
          <TradeCard />
        </GlowCard>
        <GlowCard>
          <CardTitle eyebrow="Mazal" title="Prohibited claims" badge={<Badge tone="danger">Never</Badge>} />
          <UsageTable caption="Prohibited claims and what to do instead" head={["Never say", "Why and instead"]} rows={PROHIBITED.map(([a, b]) => [a, b])} />
        </GlowCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlowCard>
          <CardTitle eyebrow="GN Academy" title="Verified credential gold" />
          <GoldRule />
        </GlowCard>
        <GlowCard>
          <CardTitle eyebrow="All departments" title="Facts, prices and disclosure" />
          <UsageTable caption="Cross-department compliance rules" head={["Rule", "Detail", "Status"]} rows={SIMPLE_RULES} />
        </GlowCard>
      </div>
    </SectionShell>
  );
}
