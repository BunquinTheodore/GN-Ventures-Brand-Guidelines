import { Badge } from "@/components/ui";
import { Card, SubHeading } from "../parts";

interface Line {
  readonly title: string;
  readonly kicker: string;
  readonly blurb: string;
  readonly items: readonly string[];
}

/** Business lines come from the brand facts only. No prices, no client names, no numbers. */
const LINES: readonly Line[] = [
  {
    title: "Services",
    kicker: "Line 01",
    blurb: "Reach and presence for crypto, blockchain, tech and finance brands.",
    items: ["Media distribution", "Hiring KOLs", "Speaker booking", "Podcast", "Onsite media team"],
  },
  {
    title: "Studio",
    kicker: "Line 02",
    blurb: "A studio you can rent for your own production.",
    items: ["Studio rental"],
  },
];

function RateTag() {
  return (
    <span className="inline-flex min-h-11 items-center rounded-full border border-[color-mix(in_srgb,var(--b-accent)_45%,transparent)] px-4 font-ui text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-accent)]">
      Inquire for rates
    </span>
  );
}

function LineCard({ line }: { readonly line: Line }) {
  return (
    <Card brand="media" glass zoom className="flex h-full flex-col gap-4">
      <div>
        <p className="font-mono text-sm text-[var(--b-muted)]">{line.kicker}</p>
        <h5 className="text-2xl font-semibold text-[var(--b-fg)]">{line.title}</h5>
        <p className="mt-1 text-base text-[var(--b-muted)]">{line.blurb}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {line.items.map((item) => (
          <li key={item}>
            <Badge tone="cyan">{item}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <RateTag />
      </div>
    </Card>
  );
}

/** Services and studio as cards, with the no-prices rule shown on each. */
export default function BusinessLines() {
  return (
    <div className="space-y-4">
      <SubHeading>Business lines, no prices</SubHeading>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {LINES.map((l) => (
          <LineCard key={l.title} line={l} />
        ))}
      </div>
      <p className="text-sm text-[var(--b-muted)]">
        Where a price would go, the card says &ldquo;Inquire for rates&rdquo;. A rate card is never published on the site.
      </p>
    </div>
  );
}
