import { Badge } from "@/components/ui";
import { Card, SubHeading } from "../parts";

const SAMPLE = "Practical AI integrations for the way your team already works";

/** Proves the Labs h1 rule: Manrope semibold, tracking-tight, balanced. Josefin is for splash and labels. */
export default function HeadlineRule() {
  return (
    <section aria-labelledby="labs-h1-h" className="space-y-4">
      <SubHeading>
        <span id="labs-h1-h">The h1 rule</span>
      </SubHeading>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card brand="labs" glass className="space-y-4">
          <Badge tone="accent">Correct</Badge>
          <p className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-[var(--b-fg)] [font-family:var(--font-manrope),Manrope,system-ui,sans-serif] [text-wrap:balance]">
            {SAMPLE}
          </p>
          <p className="font-mono text-xs text-[var(--b-muted)]">Manrope 600 | tracking-tight | text-wrap: balance</p>
        </Card>
        <Card brand="labs" glass className="space-y-4">
          <Badge tone="danger">Never for h1</Badge>
          <p
            aria-hidden="true"
            className="text-[clamp(1.75rem,3.4vw,2.75rem)] uppercase leading-[1.1] tracking-[0.04em] text-[var(--b-muted)] opacity-70 [font-family:var(--font-josefin),Josefin_Sans,sans-serif] [font-weight:300]"
          >
            {SAMPLE}
          </p>
          <p className="font-mono text-xs text-[var(--b-muted)]">Josefin Sans 300 caps: the Media and Club look</p>
          <p className="text-base text-[var(--b-muted)]">
            In Labs, Josefin Sans appears only on the splash and in small labels such as the eyebrow above each part.
          </p>
        </Card>
      </div>
    </section>
  );
}
