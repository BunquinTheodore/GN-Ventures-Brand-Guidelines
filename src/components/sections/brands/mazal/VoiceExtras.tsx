import { Badge } from "@/components/ui";
import { Card, SubHeading } from "../parts";
import { BANNED_WORDS, LOCKED_CTA, TRADE_REQUIRED } from "./data";

/** Voice extras: the locked CTA, the trade post compliance checklist and the banned words. */
export default function VoiceExtras() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card brand="mazal" glass className="flex flex-col gap-3">
        <div className="flex items-center gap-2"><SubHeading>Locked CTA</SubHeading><Badge tone="accent">Never reworded</Badge></div>
        <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold leading-tight text-[var(--b-accent)]">{LOCKED_CTA}</p>
        <p className="text-base text-[var(--b-muted)]">Use the exact wording on every post.</p>
      </Card>
      <Card brand="mazal" glass className="flex flex-col gap-3">
        <SubHeading>Trade post checklist</SubHeading>
        <ul className="space-y-2 text-base text-[var(--b-fg)]">
          {TRADE_REQUIRED.map((t) => (<li key={t} className="flex items-center gap-2"><span aria-hidden="true" className="text-[var(--b-accent)]">+</span>{t} shown</li>))}
          <li className="flex items-center gap-2"><span aria-hidden="true" className="text-[var(--b-accent)]">+</span>Open trades labeled unrealised</li>
        </ul>
      </Card>
      <Card brand="mazal" glass className="flex flex-col gap-3">
        <SubHeading>Never write</SubHeading>
        <ul className="flex flex-wrap gap-2">
          {BANNED_WORDS.map((w) => (<li key={w}><Badge tone="danger">{w}</Badge></li>))}
        </ul>
        <p className="text-base text-[var(--b-muted)]">Use commas, not em dashes.</p>
      </Card>
    </div>
  );
}
