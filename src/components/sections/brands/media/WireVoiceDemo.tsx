import { Badge } from "@/components/ui";
import { Card, DISPLAY_CLS, SubHeading } from "../parts";

interface Rewrite {
  readonly off: string;
  readonly on: string;
  readonly rule: string;
}

/** Style samples only. They show cadence, not news. No figures, names or claims. */
const REWRITES: readonly Rewrite[] = [
  {
    off: "We are thrilled to announce an exciting new chapter in our journey.",
    on: "New chapter. Starts now.",
    rule: "Cut the warm-up. Lead with the fact.",
  },
  {
    off: "Our media services start from an affordable monthly price.",
    on: "Media distribution. Inquire for rates.",
    rule: "Never print a price. Point to the inquiry.",
  },
  {
    off: "Read on to discover what the future of finance might hold for you!",
    on: "Finance. Rewired. What changes next.",
    rule: "Fragments that end in a period. No exclamation marks.",
  },
];

const WIRE_ROWS: readonly { readonly tag: string; readonly head: string }[] = [
  { tag: "News", head: "Desk is live. Story first." },
  { tag: "Insights", head: "Context. Then the take." },
  { tag: "Future", head: "What is next. Said plainly." },
];

function WireFeed() {
  return (
    <Card brand="media" glass className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-ui text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-accent)]">Wire feed</p>
        <Badge tone="neutral">Sample copy</Badge>
      </div>
      <ul className="divide-y divide-[var(--b-border)]">
        {WIRE_ROWS.map((r, i) => (
          <li key={r.tag} className="flex items-baseline gap-4 py-3">
            <span className="w-8 font-mono text-sm text-[var(--b-muted)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="w-20 shrink-0 font-ui text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-accent-2)]">{r.tag}</span>
            <span className={`min-w-0 text-lg text-[var(--b-fg)] ${DISPLAY_CLS}`}>{r.head}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-[var(--b-muted)]">
        Slogan rhythm: three fragments, three full stops. Josefin Sans 300 caps carries the headline.
      </p>
    </Card>
  );
}

function RewriteTable() {
  return (
    <div className="space-y-3">
      {REWRITES.map((r) => (
        <Card key={r.on} brand="media" glass className="grid gap-4 md:grid-cols-[1fr_1fr_0.9fr]">
          <div className="space-y-1">
            <Badge tone="danger">Off voice</Badge>
            <p className="text-base text-[var(--b-muted)] line-through decoration-[color:var(--b-danger)]/60">{r.off}</p>
          </div>
          <div className="space-y-1">
            <Badge tone="accent">News-wire</Badge>
            <p className={`text-lg text-[var(--b-fg)] ${DISPLAY_CLS}`}>{r.on}</p>
          </div>
          <p className="self-center text-base text-[var(--b-muted)]">{r.rule}</p>
        </Card>
      ))}
    </div>
  );
}

/** News-wire voice in practice: a wire feed in the slogan rhythm and off-voice versus on-voice rewrites. */
export default function WireVoiceDemo() {
  return (
    <div className="space-y-4">
      <SubHeading>News-wire voice, live</SubHeading>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        <WireFeed />
        <RewriteTable />
      </div>
    </div>
  );
}
