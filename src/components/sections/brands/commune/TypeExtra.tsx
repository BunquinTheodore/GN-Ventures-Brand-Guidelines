import type { ReactNode } from "react";
import { BRANDS } from "@/content/brands";
import { cn } from "@/lib/utils";
import { Eyebrow, FONT, Panel, SketchHeading } from "./ui";

interface Role {
  readonly tag: string;
  readonly family: string;
  readonly weight: string;
}

const HEADING: Role = { tag: "Heading", family: "Manrope", weight: "300" };
const WORDMARK: Role = { tag: "Wordmark and eyebrow", family: "Jost", weight: "300" };
const BODY: Role = { tag: "Body", family: "Inter", weight: "400 to 600" };
const HAND: Role = { tag: "Handwriting accent", family: "Caveat", weight: "400 to 700" };
const LABEL: Role = { tag: "Labels", family: "IBM Plex Mono", weight: "400" };
const ROLES: readonly Role[] = [HEADING, WORDMARK, BODY, HAND, LABEL];

function RoleTag({ role }: { readonly role: Role }) {
  return (
    <span
      className={cn(
        "inline-block border-b-2 border-dashed border-[var(--b-line-strong)] pb-0.5 text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]",
        FONT.mono,
      )}
    >
      {role.tag} | {role.family} {role.weight}
    </span>
  );
}

function Line({ role, children }: { readonly role: Role; readonly children: ReactNode }) {
  return (
    <div className="space-y-2">
      <RoleTag role={role} />
      {children}
    </div>
  );
}

/** The five roles composed on one notebook page. Eyebrow is the one fixed size, 10px caps. */
export default function TypeExtra() {
  const brand = BRANDS.commune;
  return (
    <div className="space-y-4">
      <SketchHeading>Type in situ</SketchHeading>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel rotate={-1} title="One page, five voices">
          <div className="space-y-6">
            <Line role={WORDMARK}>
              <Eyebrow>Mobile cafe cart | Metro Manila</Eyebrow>
            </Line>
            <Line role={HEADING}>
              <p className={cn("text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] text-[var(--b-fg)]", FONT.display)}>{brand.tagline}</p>
            </Line>
            <Line role={BODY}>
              <p className={cn("max-w-prose text-base leading-relaxed text-[var(--b-fg)]", FONT.body)}>{brand.descriptor}</p>
            </Line>
            <Line role={HAND}>
              <p className={cn("text-3xl text-[var(--b-fg)]", FONT.hand)}>see you at the cart</p>
            </Line>
            <Line role={LABEL}>
              <p className={cn("text-sm uppercase tracking-[0.12em] text-[var(--b-fg)]", FONT.mono)}>
                Occasion | Weddings | Offices | Birthdays
              </p>
            </Line>
          </div>
        </Panel>
        <Panel rotate={1} title="Role map">
          <ul className="divide-y-2 divide-dotted divide-[var(--b-line-strong)]">
            {ROLES.map((r) => (
              <li key={r.tag} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3">
                <span className="text-base text-[var(--b-fg)]">{r.tag}</span>
                <span className={cn("text-sm text-[var(--b-muted)]", FONT.mono)}>
                  {r.family} {r.weight}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-relaxed text-[var(--b-muted)]">
            Only the eyebrow size is fixed by the brand, 10px caps with wide tracking. Other sizes are TBC. The sample lines are
            placeholder copy.
          </p>
        </Panel>
      </div>
    </div>
  );
}
