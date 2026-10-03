import type { ReactNode } from "react";
import { Badge } from "@/components/ui";
import { contrastRatio, wcagGrade } from "@/lib/contrast";
import { Card } from "../parts/shared";
import Block from "./Block";
import { OKLCH, displayHex } from "./tokens";
import VerifiedSeal from "./VerifiedSeal";

const WHITE = "#FFFFFF";
const LOGO_AMBER = "#F8D028";

function ratioLabel(fg: string, bg: string): string {
  const r = contrastRatio(displayHex(fg), displayHex(bg));
  return r === null ? "n/a" : `${r.toFixed(2)}:1 ${wcagGrade(r)}`;
}

function Verdict({ ok, children }: { readonly ok: boolean; readonly children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone={ok ? "accent" : "danger"}>{ok ? "Do" : "Do not"}</Badge>
      <span className="text-[0.9375rem] text-[var(--b-fg)]">{children}</span>
    </div>
  );
}

function LimeRules() {
  return (
    <Card brand="academy" glass className="space-y-5">
      <h4 className="text-[1.1875rem] font-semibold text-[var(--b-fg)]">Neon lime always carries brand-fg</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div
            className="flex min-h-24 items-center justify-center rounded-[var(--b-radius)] px-4 text-center font-ui text-[1.0625rem] font-semibold"
            style={{ background: OKLCH.neon, color: OKLCH.brandFg }}
          >
            Take the free test
          </div>
          <Verdict ok>Dark brand-fg on neon lime</Verdict>
          <p className="font-mono text-[0.8125rem] text-[var(--b-muted)]">{ratioLabel(OKLCH.brandFg, OKLCH.neon)}</p>
        </div>
        <div className="space-y-3">
          <div
            className="flex min-h-24 items-center justify-center rounded-[var(--b-radius)] border border-[var(--b-border)] px-4 text-center font-ui text-[1.0625rem] font-semibold"
            style={{ background: WHITE, color: OKLCH.neon }}
          >
            Take the free test
          </div>
          <Verdict ok={false}>Neon lime text on white</Verdict>
          <p className="font-mono text-[0.8125rem] text-[var(--b-muted)]">{ratioLabel(OKLCH.neon, WHITE)}</p>
        </div>
      </div>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">
        On light surfaces the deep primary carries lime text and links: {ratioLabel(OKLCH.primaryLight, OKLCH.bgLight)} on the light background.
      </p>
    </Card>
  );
}

function GoldRules() {
  return (
    <Card brand="academy" glass className="space-y-5">
      <h4 className="text-[1.1875rem] font-semibold text-[var(--b-fg)]">Gold is for verified credentials only</h4>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-3">
          <div className="flex min-h-24 items-center justify-center rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--b-surface)]">
            <VerifiedSeal size={44} label="Verified credential seal in gold" />
          </div>
          <Verdict ok>A verified credential</Verdict>
        </div>
        <div className="space-y-3">
          <div className="flex min-h-24 items-center justify-center rounded-[var(--b-radius)] border border-dashed border-[var(--b-border)] bg-[var(--b-surface)] p-3">
            <span className="rounded-[var(--b-radius)] px-4 py-2 font-ui text-[0.9375rem] font-semibold" style={{ background: OKLCH.gold, color: OKLCH.brandFg }}>
              Sample button
            </span>
          </div>
          <Verdict ok={false}>Gold on a button, badge or promo</Verdict>
        </div>
        <div className="space-y-3">
          <div className="flex min-h-24 items-center justify-center rounded-[var(--b-radius)] border border-dashed border-[var(--b-border)] bg-[var(--b-surface)]">
            <span className="rounded-full px-4 py-2 font-mono text-[0.8125rem]" style={{ background: LOGO_AMBER, color: OKLCH.brandFg }}>
              {LOGO_AMBER}
            </span>
          </div>
          <Verdict ok={false}>The logo amber as a UI token</Verdict>
        </div>
      </div>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">
        Gold on the light background reads {ratioLabel(OKLCH.gold, OKLCH.bgLight)}. Treat it as a graphic, not as text color:
        the label beside the seal stays in foreground. (Proposed pairing.)
      </p>
    </Card>
  );
}

/** Color usage rules proven live, with contrast computed from the real values. */
export default function ColorRules() {
  return (
    <Block
      title="Color rules in use"
      lead="Two colors carry hard rules. Neon lime is never text on white. Gold means one thing only."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <LimeRules />
        <GoldRules />
      </div>
    </Block>
  );
}
