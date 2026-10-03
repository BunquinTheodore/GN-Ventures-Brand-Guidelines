import { CopyChip } from "@/components/ui";
import { Card, DISPLAY_CLS, SubHeading } from "../parts";

const GRADIENT = "linear-gradient(90deg, #3ed6d6, #b0e62f, #f2c14e)";

const STOPS: readonly { readonly name: string; readonly hex: string; readonly at: string }[] = [
  { name: "Cyan", hex: "#3ED6D6", at: "0%" },
  { name: "Lime", hex: "#B0E62F", at: "50%" },
  { name: "Amber", hex: "#F2C14E", at: "100%" },
];

interface Usage {
  readonly title: string;
  readonly body: string;
  readonly ok: boolean;
}

const USAGES: readonly Usage[] = [
  { title: "Logo frame", body: "The stroke of the rounded plate. Left to right: cyan, lime, amber.", ok: true },
  { title: "Thin edges", body: "Hairline rules and 1 to 2px accents under headings.", ok: true },
  { title: "Display accent", body: "One short word of a headline, large sizes only.", ok: true },
  { title: "Body text or large fills", body: "Keep the gradient off paragraphs and full-bleed backgrounds.", ok: false },
];

function Ribbon() {
  return (
    <div className="space-y-4">
      <div
        role="img"
        aria-label="GN Media brand gradient ribbon, cyan to lime to amber"
        className="h-20 w-full rounded-[var(--b-radius)] border border-[var(--b-border)]"
        style={{ background: GRADIENT }}
      />
      <ul className="grid grid-cols-3 gap-3">
        {STOPS.map((s) => (
          <li key={s.name} className="space-y-1 text-sm text-[var(--b-muted)]">
            <span aria-hidden="true" className="block h-2 w-full rounded-full" style={{ background: s.hex }} />
            <span className="block text-[var(--b-fg)]">{s.name}</span>
            <span className="block font-mono text-xs">{s.hex} at {s.at}</span>
          </li>
        ))}
      </ul>
      <CopyChip value="linear-gradient" copyValue={GRADIENT} label="Copy the GN Media gradient CSS" />
    </div>
  );
}

function Specimens() {
  return (
    <div className="space-y-4">
      <p
        className={`text-[clamp(2rem,5vw,3.25rem)] text-[var(--b-fg)] ${DISPLAY_CLS}`}
      >
        News.{" "}
        <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          Insights.
        </span>{" "}
        Future.
      </p>
      <div className="space-y-2">
        <div className="h-px w-full" style={{ background: GRADIENT }} />
        <p className="text-sm text-[var(--b-muted)]">Hairline rule, 1px.</p>
      </div>
      <div
        className="rounded-[var(--b-radius)] p-px"
        style={{ background: GRADIENT }}
      >
        <div className="rounded-[calc(var(--b-radius)-1px)] bg-[var(--b-surface)] p-4 text-base text-[var(--b-fg)]">
          Gradient frame, the logo plate idea reused on a card.
        </div>
      </div>
    </div>
  );
}

/** The cyan to lime to amber gradient: ribbon with stops, display specimens and usage rules. */
export default function GradientDemo() {
  return (
    <div className="space-y-4">
      <SubHeading>Brand gradient in use</SubHeading>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card brand="media" glass>
          <Ribbon />
        </Card>
        <Card brand="media" glass>
          <Specimens />
        </Card>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {USAGES.map((u) => (
          <li
            key={u.title}
            className="space-y-1 rounded-[var(--b-radius)] border border-[var(--b-border)] p-4"
          >
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.12em] text-[var(--b-accent)]">
              {u.ok ? "Use" : "Avoid"}
            </p>
            <p className="text-base font-semibold text-[var(--b-fg)]">{u.title}</p>
            <p className="text-sm text-[var(--b-muted)]">{u.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
