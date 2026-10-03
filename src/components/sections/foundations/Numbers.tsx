import type { ReactNode } from "react";
import { GlowCard, SectionShell } from "@/components/ui";
import { SourceBadge, SpecTable, SubHead, type SourceKind } from "./Parts";

interface Tile {
  readonly label: string;
  readonly example: string;
  readonly rule: string;
  readonly source: SourceKind;
}

/** Example values are illustrative formats only. None of them is a real price, stat or date of record. */
const TILES: readonly Tile[] = [
  { label: "Currency, PHP", example: "PHP 1,000.00", rule: "Code first, non-breaking space, thousands comma. Illustrative amount.", source: "Proposed" },
  { label: "Currency, USD", example: "USD 1,000.00", rule: "Same shape as PHP. Use the code, not a bare dollar sign.", source: "Proposed" },
  { label: "Prices on Media", example: "Inquire for rates", rule: "GN Media never prints prices. Use this phrase.", source: "Sourced" },
  { label: "Percentages", example: "25%", rule: "Numeral plus percent sign, no space. Illustrative value.", source: "Proposed" },
  { label: "Ranges", example: "1-5  or  1 to 5", rule: "Plain hyphen or the word to. Never an en dash.", source: "Sourced" },
  { label: "Dates, editorial", example: "30 September 2026", rule: "Day, full month, year. Date shown is the Mazal brand kit date.", source: "Proposed" },
  { label: "Dates, ISO", example: "2026-09-30", rule: "Year, month, day for files, tables and data.", source: "Proposed" },
  { label: "Counts", example: "1,080 px", rule: "Thousands comma from four digits, numeral then unit.", source: "Proposed" },
  { label: "Dimensions", example: "1200 × 630", rule: "Numerals, a multiplication sign, a space either side. Source files write 1200x630 and 2048x2048.", source: "Proposed" },
  { label: "Trade ratios", example: "R:R 1:2", rule: "Mazal trade posts show entry, stop, target and R:R. Open trades are labeled unrealised. Illustrative ratio.", source: "Sourced" },
];

const RULE_ROWS: readonly (readonly ReactNode[])[] = [
  ["Numerals", "Set in Geist Mono with tabular figures so columns align.", <SourceBadge key="a" kind="Sourced" />],
  ["Ranges", "Plain hyphen or the word to. No en dash, no em dash.", <SourceBadge key="b" kind="Sourced" />],
  ["Hero stats", "Do not quote unverified stats. GN Club's hero numbers are placeholders and are ignored.", <SourceBadge key="c" kind="Sourced" />],
  ["Guarantees", "Never promise guaranteed profit. Mazal figures are labeled unrealised until closed.", <SourceBadge key="d" kind="Sourced" />],
  ["Currency format", "PHP and USD as three-letter codes with a space.", <SourceBadge key="e" kind="Proposed" />],
  ["Date format", "Editorial for copy, ISO for data and filenames.", <SourceBadge key="f" kind="Proposed" />],
];

const ALIGN_ROWS = ["1,111", "22,222", "333", "4,444.50"] as const;

function TileCard({ tile }: { readonly tile: Tile }) {
  return (
    <GlowCard as="article" zoom className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">{tile.label}</p>
        <SourceBadge kind={tile.source} />
      </div>
      <p className="whitespace-pre font-mono text-xl text-[var(--b-fg)] md:text-2xl">{tile.example}</p>
      <p className="text-[0.875rem] leading-snug text-[var(--b-muted)]">{tile.rule}</p>
    </GlowCard>
  );
}

function AlignDemo() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {[
        { name: "Geist Mono, tabular", font: "var(--font-geist-mono), ui-monospace, monospace", tab: true },
        { name: "Manrope, proportional", font: "var(--font-manrope), system-ui, sans-serif", tab: false },
      ].map((d) => (
        <GlowCard key={d.name}>
          <p className="font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">{d.name}</p>
          <ul className="mt-3 space-y-1 text-right text-2xl text-[var(--b-fg)]" style={{ fontFamily: d.font, fontVariantNumeric: d.tab ? "tabular-nums" : "normal" }}>
            {ALIGN_ROWS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </GlowCard>
      ))}
    </div>
  );
}

export default function Numbers() {
  return (
    <SectionShell
      id="numbers"
      num="13"
      eyebrow="Foundations"
      title="Writing numbers"
      lead="How GN writes currency, percentages, ranges, dates and counts. Only a few rules are sourced from the departments. The rest are proposals, tagged so nothing reads as settled."
    >
      <div>
        <SubHead title="Examples" note="Illustrative formats. The amounts are not prices and the percentages are not stats." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TILES.map((t) => (
            <TileCard key={t.label} tile={t} />
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <SubHead title="Rules" />
          <SpecTable caption="Number writing rules and their status" head={["Topic", "Rule", "Status"]} minWidth="30rem" rows={RULE_ROWS} />
        </div>
        <div>
          <SubHead title="Why Geist Mono" note="Tabular figures keep columns of numbers aligned." />
          <AlignDemo />
        </div>
      </div>
    </SectionShell>
  );
}
