import { Badge, GlowCard } from "@/components/ui";
import { SubHeading } from "../parts";

interface Pair {
  readonly say: string;
  readonly avoid: string;
  readonly why: string;
}

/** Sample lines are Proposed illustrations of the agency voice. They contain no numbers, dates or client names. */
const PAIRS: readonly Pair[] = [
  {
    say: "We build the room your launch deserves.",
    avoid: "Our agency has done this for many years.",
    why: "Lead with the partner's launch, not the agency's history.",
  },
  {
    say: "Bring us the idea. We handle staging, build and run.",
    avoid: "We are the best events company around.",
    why: "Confident and specific. No empty superlatives.",
  },
  {
    say: "Tell us what you are launching and where.",
    avoid: "Submit an enquiry to our team.",
    why: "Speak to the brand partner directly.",
  },
];

/** Agency-confident do and don't pairs, rendered as live cards. */
export default function AgencyVoice() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SubHeading>Agency voice in practice</SubHeading>
        <Badge tone="amber">Proposed sample copy</Badge>
      </div>
      <ul className="grid gap-4 lg:grid-cols-3">
        {PAIRS.map((p, i) => (
          <li key={p.say} className="contents">
            <GlowCard shineDelay={i * 1.2} className="flex h-full flex-col gap-4">
              <div className="space-y-2">
                <Badge tone="accent">Say</Badge>
                <p className="text-lg leading-snug text-[var(--b-fg)]">{p.say}</p>
              </div>
              <div className="space-y-2">
                <Badge tone="danger">Avoid</Badge>
                <p className="text-base leading-snug text-[var(--b-muted)] line-through decoration-[var(--b-border)]">{p.avoid}</p>
              </div>
              <p className="mt-auto text-sm text-[var(--b-muted)]">{p.why}</p>
            </GlowCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
