import { Badge, GlowCard, SectionShell } from "@/components/ui";
import { CardTitle, UsageTable } from "./shared";

interface Rule {
  readonly title: string;
  readonly body: string;
  readonly example: string;
}

const UNIVERSAL_RULES: readonly Rule[] = [
  {
    title: "No dashes as punctuation",
    body: "Use a period, comma or colon. Hyphens inside compound words are fine (AI-powered, self-service). Ranges use a plain hyphen or the word to.",
    example: "Learn. Prove. Get hired.",
  },
  {
    title: "No invented numbers",
    body: "No stats, prices, dates, testimonials or partner names unless the owner confirmed them. Unknowns read TBC or Proposed.",
    example: "Inquire for rates.",
  },
  {
    title: "Plain words",
    body: "Short sentences, concrete nouns, no jargon walls. Say what the thing does and who it is for.",
    example: "AI integration for business.",
  },
  {
    title: "Proof over hype",
    body: "Show the work, the credential or the process. Never promise an outcome we cannot verify.",
    example: "Score it. Prove it. Get hired for it.",
  },
];

interface VoiceRow {
  readonly dept: string;
  readonly voice: string;
  readonly line: string;
  readonly note: string;
}

const VOICE_ROWS: readonly VoiceRow[] = [
  { dept: "GN Media", voice: "News-wire. Punchy fragments that end in periods.", line: "News. Insights. Future.", note: "Rates are never printed: Inquire for rates." },
  { dept: "GN Academy", voice: "Plain, practical. Trust and verification.", line: "Learn. Prove. Get hired.", note: "Also: Score it. Prove it. Get hired for it." },
  { dept: "GN Club", voice: "Agency-confident, brand-partner oriented.", line: "Activations · Events · Full Production · Global Experience", note: "Hero stats on the live site are unverified placeholders. Do not reuse them." },
  { dept: "GN Labs", voice: "Practical, grounded, consultative. No hype.", line: "AI integration for business", note: "Talk about integrations and automations, not magic." },
  { dept: "Mazal", voice: "Friendly, peer to peer. A friend, never a bank.", line: "A friend who trades. Not a bank.", note: "Tagline: it's more fun in mazal! Descriptor: A community. Not just a page." },
  { dept: "GN Commune", voice: "Warm and handwritten. Small and personal.", line: "A little cafe on wheels, for your big day.", note: "Brand copy placeholder, confirm with owner. No dash punctuation, use | as separator." },
];

interface Pair {
  readonly context: string;
  readonly doLine: string;
  readonly dontLine: string;
  readonly why: string;
}

const PAIRS: readonly Pair[] = [
  { context: "GN Media pricing", doLine: "Inquire for rates.", dontLine: "Packages from [an invented price].", why: "Rates are never printed and prices are never invented." },
  { context: "Mazal trade post", doLine: "Open trade, unrealised. Entry, stop, target and R:R shown.", dontLine: "Guaranteed profit. Risk-free. Easy money.", why: "Mazal never promises outcomes. Trade posts show the full plan." },
  { context: "GN Academy promise", doLine: "Score it. Prove it. Get hired for it.", dontLine: "Get hired fast, guaranteed.", why: "Show verification, not a promised result." },
  { context: "GN Club credibility", doLine: "Events and activations for tech and Web3 brands.", dontLine: "A big events-delivered count we cannot source.", why: "The hero stats on the live site are placeholders. No unverified numbers." },
  { context: "Punctuation", doLine: "Learn. Prove. Get hired.", dontLine: "Two clauses joined by a long dash instead of a period.", why: "House rule: no em dashes or en dashes as punctuation, anywhere." },
  { context: "Mazal community", doLine: "A community. Not just a page.", dontLine: "Join our signals group today.", why: "The word signals is on the prohibited list." },
];

export default function Voice() {
  return (
    <SectionShell
      id="voice"
      num="16"
      eyebrow="Voice"
      title="One family, six voices"
      lead={
        <p>
          Every department keeps its own voice. Four rules hold across all of them. The umbrella itself stays quiet: no official GN Ventures tagline or description exists yet, so none is invented here.
        </p>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Universal GN voice rules">
        {UNIVERSAL_RULES.map((rule, i) => (
          <GlowCard as="li" key={rule.title} zoom shineDelay={i * 0.6} className="flex flex-col gap-3 list-none">
            <p className="font-mono text-sm text-[var(--b-accent)]">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="text-lg text-[var(--b-fg)]">{rule.title}</h3>
            <p className="text-[0.9375rem] text-[var(--b-muted)]">{rule.body}</p>
            <p className="mt-auto rounded-lg border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-fg)_5%,transparent)] px-3 py-2 font-display text-sm uppercase tracking-[0.04em] text-[var(--b-fg)]">
              {rule.example}
            </p>
          </GlowCard>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <CardTitle eyebrow="By department" title="Voice table" />
          <UsageTable
            caption="Voice per department with a real example line"
            head={["Department", "Voice", "Example line", "Note"]}
            rows={VOICE_ROWS.map((r) => [
              r.dept,
              r.voice,
              <span key="l" className="font-medium text-[var(--b-fg)]">{r.line}</span>,
              r.note,
            ])}
          />
        </div>
        <GlowCard className="flex flex-col gap-4 self-start">
          <CardTitle eyebrow="Umbrella" title="GN Ventures" badge={<Badge tone="amber">TBC</Badge>} />
          <p className="text-[0.9375rem] text-[var(--b-muted)]">
            Working descriptor drawn from the sites: the GN Ventures family of independent brands, Media, Academy, Club, Labs, Mazal and Commune.
          </p>
          <p className="text-[0.9375rem] text-[var(--b-muted)]">
            Official umbrella tagline and description: <strong className="text-[var(--b-fg)]">TBC</strong>, owner decision pending. Proposed family voice: plain, practical, confident.
          </p>
        </GlowCard>
      </div>

      <div>
        <CardTitle eyebrow="Examples" title="Do and do not" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PAIRS.map((p) => (
            <GlowCard key={p.context} zoom className="flex flex-col gap-3">
              <p className="gn-eyebrow text-[0.75rem]">{p.context}</p>
              <div className="rounded-lg border border-[color-mix(in_srgb,var(--b-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--b-accent)_9%,transparent)] p-3">
                <Badge tone="accent">Do</Badge>
                <p className="mt-2 text-[var(--b-fg)]">{p.doLine}</p>
              </div>
              <div className="rounded-lg border border-[color-mix(in_srgb,var(--b-danger)_40%,transparent)] bg-[color-mix(in_srgb,var(--b-danger)_8%,transparent)] p-3">
                <Badge tone="danger">Do not</Badge>
                <p className="mt-2 text-[var(--b-fg)]">{p.dontLine}</p>
              </div>
              <p className="text-sm text-[var(--b-muted)]">{p.why}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
