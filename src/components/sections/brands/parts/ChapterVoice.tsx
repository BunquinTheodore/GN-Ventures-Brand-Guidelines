import type { ReactNode } from "react";
import { Badge } from "@/components/ui";
import type { BrandId } from "@/content/types";
import { Card, DISPLAY_CLS, PartFrame, SubHeading, brandOf, resolveGlass, type ChapterPartProps } from "./shared";

function Mark({ ok }: { readonly ok: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {ok ? <path d="M4 10.5l4 4 8-9" /> : <path d="M5 5l10 10M15 5L5 15" />}
    </svg>
  );
}

function RuleList({ title, items, ok, brand, glass }: { readonly title: ReactNode; readonly items: readonly string[]; readonly ok: boolean; readonly brand: BrandId; readonly glass: boolean }) {
  const warn = brand === "commune" ? "text-[var(--b-fg)]" : "text-[var(--b-danger)]";
  return (
    <Card brand={brand} glass={glass} className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <Badge tone={ok ? "accent" : brand === "commune" ? "neutral" : "danger"}>{ok ? "Do" : "Do not"}</Badge>
        <span className="font-ui text-sm font-semibold text-[var(--b-fg)]">{title}</span>
      </div>
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-base leading-relaxed text-[var(--b-fg)]">
            <span className={ok ? "text-[var(--b-accent)]" : warn}>
              <Mark ok={ok} />
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Voice: the brand's own lines, then do and do-not lists. */
export default function ChapterVoice({ brand: id, glass: g, className }: ChapterPartProps) {
  const brand = brandOf(id);
  const glass = resolveGlass(id, g);
  return (
    <PartFrame
      brand={id}
      part="voice"
      title="Voice"
      lead="How this brand sounds, and the lines it must never cross. Copy never uses em dashes or dash punctuation."
      className={className}
    >
      <div>
        <SubHeading>In the brand&apos;s words</SubHeading>
        <ul className="grid gap-4 md:grid-cols-2">
          {brand.voice.map((line) => (
            <li key={line}>
              <Card brand={id} glass={glass} className="h-full">
                <p className={`text-[clamp(1.25rem,2.2vw,1.75rem)] text-[var(--b-fg)] ${DISPLAY_CLS}`}>{line}</p>
                {line.includes("Proposed") ? <Badge tone="amber" className="mt-3">Proposed</Badge> : null}
              </Card>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <RuleList title="Write and design like this" items={brand.dos} ok brand={id} glass={glass} />
        <RuleList title="Never do this" items={brand.donts} ok={false} brand={id} glass={glass} />
      </div>
    </PartFrame>
  );
}
