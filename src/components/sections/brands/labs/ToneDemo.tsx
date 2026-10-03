import { Badge } from "@/components/ui";
import { Card, SubHeading } from "../parts";

const PAIRS: readonly { readonly avoid: string; readonly use: string }[] = [
  { avoid: "Revolutionize your business with AI.", use: "We connect AI to the tools your team already uses." },
  { avoid: "Unlock limitless automation.", use: "Name the task, what it replaces and who checks the result." },
  { avoid: "The future is here.", use: "Book a consultation. We start with one workflow." },
];

/** Voice in practice: practical, grounded, consultative, no hype. */
export default function ToneDemo() {
  return (
    <section aria-labelledby="labs-tone-h" className="space-y-4">
      <SubHeading>
        <span id="labs-tone-h">No hype, in practice</span>
      </SubHeading>
      <div className="grid gap-4 md:grid-cols-3">
        {PAIRS.map((p) => (
          <Card key={p.use} brand="labs" glass zoom className="space-y-3">
            <Badge tone="danger">Avoid</Badge>
            <p className="text-base text-[var(--b-muted)] line-through decoration-[var(--b-border)]">{p.avoid}</p>
            <Badge tone="accent">Write</Badge>
            <p className="text-base text-[var(--b-fg)]">{p.use}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
