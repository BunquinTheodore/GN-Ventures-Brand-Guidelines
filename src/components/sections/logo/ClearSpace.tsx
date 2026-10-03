import SectionShell from "@/components/ui/SectionShell";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import { getAsset } from "@/content/assets";
import { SpecTable, SubHead } from "./parts";

interface DiagramProps {
  readonly assetId: string;
  readonly alt: string;
  /** x as a fraction of the artwork height. */
  readonly xRatio: number;
  readonly xLabel: string;
  readonly surface: "ink" | "paper";
}

const SURFACES = {
  ink: { bg: "#000", line: "var(--b-accent)", fill: "color-mix(in srgb, var(--b-accent) 22%, transparent)", text: "var(--b-accent)" },
  paper: { bg: "#fff", line: "#000", fill: "color-mix(in srgb, #000 12%, transparent)", text: "#000" },
} as const;

/** SVG clear space diagram: dashed exclusion zone, x-blocks on every side, real logo file. */
function ClearSpaceDiagram({ assetId, alt, xRatio, xLabel, surface }: DiagramProps) {
  const asset = getAsset(assetId);
  if (!asset?.width || !asset.height) return null;
  const w = asset.width;
  const h = asset.height;
  const x = Math.round(h * xRatio);
  const total = { w: w + x * 2, h: h + x * 2 };
  const s = SURFACES[surface];
  const label = Math.max(14, Math.round(x * 0.42));
  const blocks = [
    { id: "top", x: x + w / 2 - x / 2, y: 0 },
    { id: "bottom", x: x + w / 2 - x / 2, y: x + h },
    { id: "left", x: 0, y: x + h / 2 - x / 2 },
    { id: "right", x: x + w, y: x + h / 2 - x / 2 },
  ];
  return (
    <svg
      viewBox={`0 0 ${total.w} ${total.h}`}
      role="img"
      aria-label={`Clear space diagram. ${alt}. The exclusion zone is ${xLabel} on every side.`}
      className="h-auto w-full rounded-[var(--b-radius)]"
      style={{ background: s.bg }}
    >
      <rect x={1} y={1} width={total.w - 2} height={total.h - 2} fill="none" stroke={s.line} strokeWidth={2} strokeDasharray="10 8" />
      <image href={asset.file} x={x} y={x} width={w} height={h} />
      <rect x={x} y={x} width={w} height={h} fill="none" stroke={s.line} strokeOpacity={0.55} strokeWidth={1.5} />
      {blocks.map((b) => (
        <g key={b.id}>
          <rect x={b.x} y={b.y} width={x} height={x} fill={s.fill} stroke={s.line} strokeWidth={1.5} />
          <text x={b.x + x / 2} y={b.y + x / 2} fill={s.text} fontSize={label} textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace">
            x
          </text>
        </g>
      ))}
    </svg>
  );
}

const MIN_SIZES: readonly (readonly string[])[] = [
  ["Lockup, digital", "96 px wide", "Proposed"],
  ["Lockup, print", "25 mm wide", "Proposed"],
  ["Compact mark, digital", "24 px wide", "Proposed"],
  ["Favicon", "16 px, 32 px export", "Proposed"],
];

const COMMUNE_MIN: readonly (readonly string[])[] = [
  ["Illustration, digital", "64 px wide", "Proposed"],
  ["Illustration, print", "20 mm wide", "Proposed"],
];

function ProposedBadge() {
  return <Badge tone="amber">Proposed</Badge>;
}

export default function ClearSpace() {
  return (
    <SectionShell
      id="clear-space"
      num="04"
      eyebrow="Clear space"
      title="Room to breathe"
      lead={
        <p>
          Keep an empty margin around every logo. The margin is measured in x, a unit taken from the lockup itself so it scales with the logo.
          Nothing enters the dashed zone: no text, no edges, no other logos.
        </p>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <GlowCard className="grid gap-5">
          <SubHead aside={<ProposedBadge />}>GN Ventures lockup</SubHead>
          <div className="mx-auto w-full max-w-[34rem]">
            <ClearSpaceDiagram
              assetId="ventures-horizontal"
              alt="GN Ventures logo with x-blocks marking the clear space"
              xRatio={0.25}
              xLabel="one x"
              surface="ink"
            />
          </div>
          <p className="text-base text-[var(--b-muted)]">
            Proposed: x equals one quarter of the lockup height, so the exclusion zone is x on all four sides. The owner is to confirm the unit
            before it is treated as final.
          </p>
        </GlowCard>

        <div className="grid content-start gap-6">
          <GlowCard>
            <SubHead aside={<ProposedBadge />}>Minimum sizes</SubHead>
            <SpecTable caption="Proposed minimum logo sizes" head={["Use", "Size", "Status"]} rows={MIN_SIZES.map((r) => [r[0], r[1], <ProposedBadge key={r[0]} />])} />
            <p className="mt-4 text-base text-[var(--b-muted)]">
              Below these sizes the word in the lockup stops being legible. Switch to the compact mark instead of shrinking further.
            </p>
          </GlowCard>
          <GlowCard>
            <SubHead>Clear space wins</SubHead>
            <p className="text-base text-[var(--b-muted)]">
              When a layout is tight, shrink the logo before you reduce the margin. Clear space outranks every other placement preference.
            </p>
          </GlowCard>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <GlowCard className="grid content-start gap-4">
          <SubHead aside={<Badge tone="neutral">Exception</Badge>}>GN Commune has its own rule</SubHead>
          <p className="text-base text-[var(--b-muted)]">
            The Commune logo is a hand-drawn line illustration, strictly black and white, with no wordmark baked in. It sits on plain white or
            plain black, never on colour, glass or gradients. Its wordmark is live text set beside it.
          </p>
          <p className="text-base text-[var(--b-muted)]">Proposed: x equals one eighth of the illustration height, and the margin must stay free of tape strips, stickers and doodles.</p>
          <SpecTable caption="Proposed minimum sizes for the Commune illustration" head={["Use", "Size", "Status"]} rows={COMMUNE_MIN.map((r) => [r[0], r[1], <ProposedBadge key={r[0]} />])} />
        </GlowCard>
        <GlowCard>
          <div className="mx-auto w-full max-w-[28rem]">
            <ClearSpaceDiagram
              assetId="commune-primary-light"
              alt="GN Commune line illustration with x-blocks marking the clear space"
              xRatio={0.125}
              xLabel="one x"
              surface="paper"
            />
          </div>
        </GlowCard>
      </div>
    </SectionShell>
  );
}
