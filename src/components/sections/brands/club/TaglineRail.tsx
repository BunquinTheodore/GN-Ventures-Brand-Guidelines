import { GlowCard } from "@/components/ui";
import { SubHeading } from "../parts";

interface Pillar {
  readonly word: string;
  readonly accent: string;
  readonly note: string;
}

/** The four words of the tagline, each carrying one of the three brand colors. */
const PILLARS: readonly Pillar[] = [
  { word: "Activations", accent: "var(--b-accent)", note: "Brand moments built around a partner launch." },
  { word: "Events", accent: "var(--b-accent-2)", note: "Tech and Web3 gatherings, planned end to end." },
  { word: "Full Production", accent: "var(--b-accent-3)", note: "Staging, build and run, under one roof." },
  { word: "Global Experience", accent: "var(--b-accent)", note: "Built to travel beyond one market." },
];

/** Live read of the tagline, with staggered shine so the four cards never flash in sync. */
export default function TaglineRail() {
  return (
    <div className="space-y-4">
      <SubHeading>Tagline, word by word</SubHeading>
      <p className="font-mono text-sm text-[var(--b-muted)]">
        Activations · Events · Full Production · Global Experience
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PILLARS.map((p, i) => (
          <li key={p.word} className="contents">
            <GlowCard zoom shineDelay={i * 1.4} className="flex h-full flex-col gap-3">
              <span aria-hidden="true" className="h-1 w-12 rounded-full" style={{ background: p.accent }} />
              <p className="font-ui text-lg font-semibold uppercase tracking-[0.1em] text-[var(--b-fg)]">{p.word}</p>
              <p className="text-base leading-relaxed text-[var(--b-muted)]">{p.note}</p>
            </GlowCard>
          </li>
        ))}
      </ul>
      <p className="text-sm text-[var(--b-muted)]">
        The short descriptions above are Proposed copy for this guide. Only the four words are the official tagline.
      </p>
    </div>
  );
}
