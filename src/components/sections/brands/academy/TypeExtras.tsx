import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Card, DISPLAY_CLS } from "../parts/shared";
import Block from "./Block";
import { RAISED_SCALE } from "./tokens";

const MONO = "[font-family:var(--font-geist-mono),ui-monospace,monospace]";
const DIGITS = "1,111\n8,888\n0,000";

function ScaleCompare() {
  return (
    <Card brand="academy" glass className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h4 className="text-[1.1875rem] font-semibold text-[var(--b-fg)]">Raised scale against the default</h4>
        <Badge tone="accent">Brand token</Badge>
      </div>
      <ul>
        {RAISED_SCALE.map((r) => (
          <li
            key={r.step}
            className="grid items-baseline gap-1 border-b border-[var(--b-border)] py-3 last:border-0 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-5"
          >
            <span className="font-mono text-[0.8125rem] text-[var(--b-muted)]">
              {r.step} / {r.academy} px
            </span>
            <span className="text-[var(--b-fg)]" style={{ fontSize: r.academy }}>
              Verified. {r.academy} px
            </span>
            <span className="text-[var(--b-muted)]" style={{ fontSize: r.tailwind ?? r.academy }}>
              {r.tailwind ? `Default ${r.tailwind} px` : "No default step"}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">
        Every step sits one pixel above the common Tailwind default, so small text stays readable. Micro (12 px) has no default counterpart.
      </p>
    </Card>
  );
}

function Hierarchy() {
  return (
    <Card brand="academy" glass className="space-y-4">
      <h4 className="text-[1.1875rem] font-semibold text-[var(--b-fg)]">Heading, body, UI and numerals</h4>
      <div className="space-y-4">
        <p className={cn("text-[2rem]", DISPLAY_CLS)}>Get hired for it.</p>
        <p className="text-[1.3125rem] font-semibold text-[var(--b-fg)]">Heading 3 and below are Manrope.</p>
        <p className="text-[1.0625rem] leading-relaxed text-[var(--b-fg)]">
          Body copy is Manrope at 17 px: plain, practical, written for people entering or moving up in work.
        </p>
        <p className="font-ui text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-[var(--b-muted)]">Poppins for UI labels</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-4">
          <p className="mb-2 font-ui text-[0.75rem] uppercase tracking-[0.12em] text-[var(--b-muted)]">Geist Mono, tabular</p>
          <p className={cn("whitespace-pre text-[1.3125rem] leading-snug text-[var(--b-fg)]", MONO)}>{DIGITS}</p>
        </div>
        <div className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-4">
          <p className="mb-2 font-ui text-[0.75rem] uppercase tracking-[0.12em] text-[var(--b-muted)]">Manrope, proportional</p>
          <p className="whitespace-pre text-[1.3125rem] leading-snug text-[var(--b-fg)]">{DIGITS}</p>
        </div>
      </div>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">
        Numerals and tabular figures go in Geist Mono so columns of digits line up.
      </p>
    </Card>
  );
}

/** Academy type proofs: the raised scale beside the default, and the four roles in one place. */
export default function TypeExtras() {
  return (
    <Block
      title="The raised scale in use"
      lead="Josefin Sans Light caps at 0.05em tracking for h1 and h2. Manrope for h3 and below. Poppins for UI. Geist Mono for numerals."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <ScaleCompare />
        <Hierarchy />
      </div>
    </Block>
  );
}
