import { Badge, GlowCard, SectionShell } from "@/components/ui";

interface Tile {
  readonly text: string;
  readonly note?: string;
  readonly proposed?: boolean;
}

const CORRECT: readonly Tile[] = [
  { text: "GN Ventures" },
  { text: "GN Media" },
  { text: "GN Academy" },
  { text: "GN Club" },
  { text: "GN Labs" },
  { text: "GN Commune" },
  { text: "Mazal", note: "The logo and splash set it in caps. Running text uses Mazal.", proposed: true },
];

const INCORRECT: readonly Tile[] = [
  { text: "GN VENTURES", note: "Caps are display styling only, never typed" },
  { text: "Gn Media", note: "GN is always two capitals" },
  { text: "G.N. Academy", note: "No periods" },
  { text: "GNClub", note: "Keep the space" },
  { text: "GN Labs Inc.", note: "No legal suffix is invented" },
  { text: "MAZAL", note: "Not in running text", proposed: true },
];

const DOMAINS: readonly string[] = ["gnmedia.co", "gnacademy.institute", "gnclubs.events", "joinmazal.org"];
const LOCKUP_WORDS: readonly string[] = ["Ventures", "Media", "Academy", "Club", "Labs"];

function TileList({ tiles, good }: { readonly tiles: readonly Tile[]; readonly good: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {tiles.map((t) => (
        <li
          key={t.text}
          className="rounded-xl border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-fg)_4%,transparent)] p-4"
          style={{ borderLeft: `3px solid ${good ? "var(--b-accent)" : "var(--b-danger)"}` }}
        >
          <p className="flex flex-wrap items-center gap-2">
            <span className="sr-only">{good ? "Correct:" : "Incorrect:"}</span>
            <span className="font-ui text-lg font-semibold">{t.text}</span>
            {t.proposed ? <Badge tone="cyan">Proposed</Badge> : null}
          </p>
          {t.note ? <p className="mt-1 text-sm text-[var(--b-muted)]">{t.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export default function Name() {
  return (
    <SectionShell
      id="name"
      num="02"
      eyebrow="Name"
      title="How we write the name"
      lead={
        <p>
          One spelling everywhere. Names are written as shown here. Uppercase is a display choice applied
          with CSS, never typed into the copy.
        </p>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <GlowCard className="md:p-8">
          <h3 className="mb-4 font-ui text-lg font-semibold">Correct</h3>
          <TileList tiles={CORRECT} good />
        </GlowCard>
        <GlowCard className="md:p-8">
          <h3 className="mb-4 font-ui text-lg font-semibold">Incorrect</h3>
          <TileList tiles={INCORRECT} good={false} />
        </GlowCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlowCard>
          <h3 className="font-ui text-lg font-semibold">Domains and handles</h3>
          <p className="mt-2 text-[var(--b-muted)]">Always lowercase, never capitalized or spaced.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {DOMAINS.map((d) => (
              <li key={d} className="rounded-lg border border-[var(--b-border)] px-3 py-1.5 font-mono text-sm">
                {d}
              </li>
            ))}
          </ul>
        </GlowCard>
        <GlowCard>
          <h3 className="font-ui text-lg font-semibold">Display exception</h3>
          <p className="mt-2 text-[var(--b-muted)]">
            Titles and nav may show uppercase. Apply it with{" "}
            <code className="font-mono text-sm">text-transform: uppercase</code>, so the source text stays
            correct.
          </p>
          <p className="mt-4 font-display text-2xl uppercase tracking-[0.04em]">GN Academy</p>
        </GlowCard>
        <GlowCard>
          <h3 className="font-ui text-lg font-semibold">Lockup rule</h3>
          <p className="mt-2 text-[var(--b-muted)]">
            Department logos swap only the word inside the same gradient frame. The frame, the lowercase gn
            and the proportions never change.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 font-ui text-sm uppercase tracking-[0.1em]">
            {LOCKUP_WORDS.map((w) => (
              <li key={w} className="rounded-md border border-[var(--b-border)] px-2.5 py-1">
                {w}
              </li>
            ))}
          </ul>
        </GlowCard>
      </div>
    </SectionShell>
  );
}
