import { Badge, DerivedTag } from "@/components/ui";
import { assetsFor } from "@/content/assets";
import { Card, SubHeading } from "../parts";
import { LIME, MARK_MIN_PX, MARK_SIZES, NAVY, STOP_RED } from "./data";
import { MazalMark, type MarkTreatment } from "./Mark";

const CLEAR_MARK_PX = 120;

function ClearSpace() {
  const pad = CLEAR_MARK_PX / 2;
  return (
    <Card brand="mazal" glass className="flex flex-col gap-4">
      <SubHeading>Clear space: half the mark width</SubHeading>
      <div className="flex justify-center rounded-[var(--b-radius)] p-4" style={{ background: NAVY }}>
        <div
          className="relative border border-dashed"
          style={{ padding: pad, borderColor: "color-mix(in srgb, #fff 45%, transparent)" }}
        >
          <MazalMark width={CLEAR_MARK_PX} label="Mazal M mark with clear space shown" />
          <span aria-hidden="true" className="absolute left-1 top-1 font-mono text-xs text-white">0.5 W</span>
          <span aria-hidden="true" className="absolute bottom-1 right-1 font-mono text-xs text-white">0.5 W</span>
        </div>
      </div>
      <p className="text-base leading-relaxed text-[var(--b-muted)]">
        Keep clear space of half the mark width on every side. Nothing enters it: no text, no edge of the plate, no
        other graphic.
      </p>
    </Card>
  );
}

function MinimumSize() {
  return (
    <Card brand="mazal" glass className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <SubHeading>Minimum size</SubHeading>
        <Badge tone="amber">Proposed</Badge>
      </div>
      <ul className="flex flex-wrap items-end gap-6 rounded-[var(--b-radius)] p-4" style={{ background: NAVY }}>
        {MARK_SIZES.map((px) => (
          <li key={px} className="flex flex-col items-center gap-2">
            <MazalMark width={px} label={`Mazal M mark at ${px} pixels wide`} />
            <span className="font-mono text-xs text-white">{px} px</span>
          </li>
        ))}
      </ul>
      <p className="text-base leading-relaxed text-[var(--b-muted)]">
        The brand kit sets no minimum. Proposed: {MARK_MIN_PX} px wide on screen, the smallest favicon size shipped.
        Needs owner sign-off.
      </p>
    </Card>
  );
}

interface Misuse {
  readonly rule: string;
  readonly treatment: MarkTreatment;
  readonly fill?: string;
}

const MISUSES: readonly Misuse[] = [
  { rule: "Never recolor", treatment: "plain", fill: STOP_RED },
  { rule: "Never outline", treatment: "outline" },
  { rule: "Never glow", treatment: "glow" },
  { rule: "Never redraw or distort", treatment: "stretched" },
];

function Misuses() {
  return (
    <div>
      <SubHeading>Never do this to the M</SubHeading>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MISUSES.map((m) => (
          <li key={m.rule} className="flex flex-col gap-2">
            <div
              className="relative flex h-36 items-center justify-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)]"
              style={{ background: NAVY }}
            >
              <MazalMark width={64} fill={m.fill ?? LIME} treatment={m.treatment} label={`Incorrect: ${m.rule}`} />
              <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <line x1="6" y1="94" x2="94" y2="6" stroke={STOP_RED} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <Badge tone="danger" className="self-start">{m.rule}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Vectors() {
  const vectors = assetsFor("mazal").filter((a) => a.format === "svg" && a.source === "original" && a.kind !== "cursor");
  return (
    <Card brand="mazal" glass className="flex flex-col gap-4">
      <SubHeading>The one original vector: lime and white</SubHeading>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex h-32 items-center justify-center rounded-[var(--b-radius)]" style={{ background: NAVY }}>
          <MazalMark width={72} label="Mazal M mark, lime" />
        </div>
        <div className="flex h-32 items-center justify-center rounded-[var(--b-radius)]" style={{ background: NAVY }}>
          <MazalMark width={72} fill="#FFFFFF" label="Mazal M mark, white" />
        </div>
      </div>
      <ul className="space-y-2">
        {vectors.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--b-fg)]">
            <span>{a.label}</span>
            <DerivedTag kind={a.source} note={a.provenance} />
          </li>
        ))}
      </ul>
      <p className="text-base leading-relaxed text-[var(--b-muted)]">
        One mark, one color. Cyber Lime on the midnight plate, or white. These two SVGs are the only original vector
        files in the whole company.
      </p>
    </Card>
  );
}

/** Mazal logo extras: the M as live vector, clear space, minimum size and the four forbidden treatments. */
export default function MarkLab() {
  return (
    <div className="space-y-6" data-mazal="mark-lab">
      <div className="grid gap-4 lg:grid-cols-3">
        <Vectors />
        <ClearSpace />
        <MinimumSize />
      </div>
      <Misuses />
    </div>
  );
}
