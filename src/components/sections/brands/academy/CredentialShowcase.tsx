import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Card, DISPLAY_CLS, ThemedLogo } from "../parts/shared";
import Block from "./Block";
import VerifiedSeal from "./VerifiedSeal";

type CredentialState = "verified" | "pending" | "failed";

const STATE_COPY: Readonly<Record<CredentialState, { readonly label: string; readonly note: string }>> = {
  verified: { label: "Verified", note: "Checked and confirmed. The only state that earns gold." },
  pending: { label: "Not yet verified", note: "Neutral. No gold, no lime." },
  failed: { label: "Could not verify", note: "Destructive color, plain wording, a next step." },
};

function StateMark({ state }: { readonly state: CredentialState }) {
  if (state === "verified") return <VerifiedSeal size={30} label="Verified" />;
  if (state === "pending") return <VerifiedSeal size={30} muted label="Not yet verified" />;
  return (
    <span
      role="img"
      aria-label="Could not verify"
      className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--b-danger)] font-mono text-[0.9375rem] font-semibold text-[var(--b-danger)]"
    >
      !
    </span>
  );
}

function CredentialCard({ state }: { readonly state: CredentialState }) {
  const copy = STATE_COPY[state];
  const gold = state === "verified";
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[var(--b-radius)] border bg-[var(--b-surface)] p-5",
        gold ? "border-[color-mix(in_oklch,var(--b-accent-3)_70%,transparent)]" : "border-[var(--b-border)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="h-12 w-16 shrink-0"><ThemedLogo brand="academy" sizes="64px" /></span>
        <StateMark state={state} />
      </div>
      <div>
        <p className="font-ui text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[var(--b-muted)]">Credential</p>
        <p className={cn("text-[1.5rem]", DISPLAY_CLS)}>Title TBC</p>
        <p className="text-[1.0625rem] text-[var(--b-fg)]">Holder name</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 border-t border-[var(--b-border)] pt-3">
        <div>
          <dt className="text-[0.8125rem] text-[var(--b-muted)]">Issued</dt>
          <dd className="font-mono text-[0.9375rem] text-[var(--b-fg)]">TBC</dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-[var(--b-muted)]">Credential ID</dt>
          <dd className="font-mono text-[0.9375rem] text-[var(--b-fg)]">TBC</dd>
        </div>
      </dl>
      <p className="text-[0.9375rem] font-semibold text-[var(--b-fg)]">{copy.label}</p>
      <p className="-mt-3 text-[0.8125rem] text-[var(--b-muted)]">{copy.note}</p>
    </div>
  );
}

function TestCta() {
  return (
    <Card brand="academy" glass className="flex flex-col justify-between gap-5">
      <div className="space-y-3">
        <Badge tone="accent">Free</Badge>
        <h4 className={cn("text-[1.75rem]", DISPLAY_CLS)}>AI Readiness Test</h4>
        <p className="text-[1.0625rem] leading-relaxed text-[var(--b-muted)]">
          Score it first. Then prove it with a verified credential.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex min-h-11 items-center rounded-[var(--b-radius)] bg-[var(--b-brand)] px-5 font-ui text-[0.9375rem] font-semibold text-[var(--b-brand-fg)]">
          Take the free test
        </span>
        <Button variant="outline" data-sfx="click">How it works</Button>
      </div>
    </Card>
  );
}

/** Credential and verification motifs. Layout is illustrative: every value is a TBC placeholder. */
export default function CredentialShowcase() {
  return (
    <Block
      title="Credential and verification motifs"
      badge="Proposed layout"
      lead="Verification is the brand's whole promise. A credential card has three states and only the verified one wears gold. All field values are placeholders until real credential content is confirmed."
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <CredentialCard state="verified" />
        <CredentialCard state="pending" />
        <CredentialCard state="failed" />
        <TestCta />
      </div>
    </Block>
  );
}
