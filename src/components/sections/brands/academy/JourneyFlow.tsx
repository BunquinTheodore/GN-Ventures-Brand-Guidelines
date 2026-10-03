import { cn } from "@/lib/utils";
import { Card, DISPLAY_CLS } from "../parts/shared";
import Block from "./Block";
import VerifiedSeal from "./VerifiedSeal";

interface Step {
  readonly num: string;
  readonly verb: string;
  readonly line: string;
  readonly detail: string;
  readonly gold?: boolean;
}

const STEPS: readonly Step[] = [
  { num: "01", verb: "Learn", line: "Score it.", detail: "Certification and e-learning for Filipinos. Start with the free AI Readiness Test." },
  { num: "02", verb: "Prove", line: "Prove it.", detail: "A verified credential is the proof. It is the only place gold appears.", gold: true },
  { num: "03", verb: "Get hired", line: "Get hired for it.", detail: "Credentials can be checked by whoever is hiring." },
];

function StepCard({ step }: { readonly step: Step }) {
  return (
    <Card brand="academy" glass zoom className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.9375rem] text-[var(--b-muted)]">{step.num}</span>
        {step.gold ? <VerifiedSeal size={28} /> : null}
      </div>
      <p className={cn("text-[1.75rem]", DISPLAY_CLS)}>{step.verb}.</p>
      <p className="text-[1.1875rem] font-semibold text-[var(--b-fg)]">{step.line}</p>
      <p className="text-[1.0625rem] leading-relaxed text-[var(--b-muted)]">{step.detail}</p>
    </Card>
  );
}

/** The tagline as a three-step journey. Pulled from the tagline and voice line only. */
export default function JourneyFlow() {
  return (
    <Block
      title="Learn. Prove. Get hired."
      lead="The tagline doubles as the structure of the product story. Use it as a three-step motif on landing pages and slides."
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.num} className="flex">
            <div className="flex w-full">
              <StepCard step={s} />
            </div>
          </li>
        ))}
      </ol>
    </Block>
  );
}
