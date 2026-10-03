import { Badge } from "@/components/ui";
import { Card, SubHeading, ThemedLogo } from "../parts";

const GRADIENT = "linear-gradient(90deg, #17C9E2, #F5DC2C)";

/** The cyan to amber brand gradient: where it lives (bar, frame, text). */
export default function GradientDemo() {
  return (
    <section aria-labelledby="labs-gradient-h" className="space-y-4">
      <SubHeading>
        <span id="labs-gradient-h">Brand gradient, 90deg cyan to amber</span>
      </SubHeading>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card brand="labs" glass className="space-y-4">
          <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]">Rule bar</p>
          <div role="img" aria-label="Brand gradient bar, cyan to amber" className="h-3 w-full rounded-full" style={{ background: GRADIENT }} />
          <div className="flex justify-between font-mono text-xs text-[var(--b-muted)]">
            <span>#17C9E2</span>
            <span>#F5DC2C</span>
          </div>
          <p className="text-base text-[var(--b-muted)]">Two stops only. Lime is the accent, not a gradient stop in Labs.</p>
        </Card>
        <Card brand="labs" glass className="space-y-4">
          <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]">Logo plate frame</p>
          <div className="mx-auto w-full max-w-[12rem] rounded-[var(--b-radius)] p-[2px]" style={{ background: GRADIENT }}>
            <div className="aspect-square rounded-[calc(var(--b-radius)-2px)] bg-[var(--b-bg)] p-3">
              <ThemedLogo brand="labs" sizes="192px" fixed="dark" />
            </div>
          </div>
          <p className="text-base text-[var(--b-muted)]">A 2px gradient edge around the ink plate echoes the logo frame.</p>
        </Card>
        <Card brand="labs" glass className="space-y-4">
          <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]">Emphasis phrase</p>
          <p className="text-3xl font-semibold tracking-tight text-[var(--b-fg)] [text-wrap:balance]">
            Integration that{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
              fits your work
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge tone="cyan">One phrase per headline</Badge>
            <Badge tone="amber">Large type only</Badge>
          </div>
          <p className="text-base text-[var(--b-muted)]">Gradient text is for display sizes. Body copy stays mist on ink.</p>
        </Card>
      </div>
    </section>
  );
}
