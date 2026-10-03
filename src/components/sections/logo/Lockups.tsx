import SectionShell from "@/components/ui/SectionShell";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import DerivedTag from "@/components/ui/DerivedTag";
import { getAsset } from "@/content/assets";
import { cn } from "@/lib/utils";
import { LogoImg, SpecTable, STAGE_BASE, SubHead } from "./parts";

type Stage = "ink" | "paper" | "lime";

interface Variant {
  readonly key: string;
  readonly title: string;
  readonly pngId?: string;
  readonly svgId?: string;
  readonly stage: Stage;
  readonly alt: string;
  readonly placeholder?: string;
  readonly useFor: string;
}

const STAGE_CLASS: Readonly<Record<Stage, string>> = {
  ink: "bg-black",
  paper: "bg-white",
  lime: "bg-[var(--b-accent)]",
};

const VARIANTS: readonly Variant[] = [
  { key: "primary", title: "Primary on ink", pngId: "ventures-primary-dark", stage: "ink", alt: "GN Ventures logo on black", useFor: "Default everywhere on dark surfaces: websites, decks, video, social." },
  { key: "on-light", title: "On light", pngId: "ventures-on-light", svgId: "ventures-on-light-svg", stage: "paper", alt: "GN Ventures logo, version for light backgrounds", useFor: "Print and documents on white or light paper where a dark surface is impossible." },
  { key: "mono-white", title: "White mono", pngId: "ventures-mono-white", svgId: "ventures-mono-white-svg", stage: "ink", alt: "GN Ventures logo, white single colour", useFor: "Single colour printing, embossing, photos and busy dark images." },
  { key: "mono-ink", title: "Ink mono", pngId: "ventures-mono-ink", svgId: "ventures-mono-ink-svg", stage: "paper", alt: "GN Ventures logo, ink single colour", useFor: "One colour print on light stock, stamps and fax-safe documents." },
  { key: "horizontal", title: "Horizontal", svgId: "ventures-horizontal-svg", stage: "ink", alt: "GN Ventures horizontal logo placeholder", placeholder: "Horizontal lockup: Proposed. Final artwork pending, only a cropped copy of the primary exists.", useFor: "Narrow banners and headers. Use the primary until artwork is supplied." },
  { key: "square", title: "Square", pngId: "ventures-square", stage: "ink", alt: "GN Ventures logo centred on a square canvas", useFor: "Avatars, profile images and tiles that need a 1:1 crop." },
];

const TABLE_ROWS: readonly (readonly string[])[] = VARIANTS.map((v) => [v.title, v.useFor, v.stage === "paper" ? "Light surface" : "Ink surface"]);

function SvgLine({ svgId }: { readonly svgId?: string }) {
  const svg = svgId ? getAsset(svgId) : undefined;
  if (svg) {
    return (
      <p className="text-sm text-[var(--b-muted)]">
        SVG available, traced from the raster. <span className="font-mono">{svg.width}x{svg.height}</span>
      </p>
    );
  }
  return <p className="text-sm text-[var(--b-muted)]">SVG placeholder: original vector pending</p>;
}

function Tile({ v }: { readonly v: Variant }) {
  const png = v.pngId ? getAsset(v.pngId) : undefined;
  return (
    <GlowCard as="article" zoom className="flex flex-col gap-4" >
      <div className={cn(STAGE_BASE, "aspect-[4/3] p-6", STAGE_CLASS[v.stage])}>
        {v.pngId ? (
          <LogoImg id={v.pngId} alt={v.alt} className="h-auto max-h-full w-auto max-w-[75%] object-contain" sizes="(min-width: 1024px) 22vw, 70vw" />
        ) : (
          <p role="img" aria-label={v.alt} className="max-w-[16rem] rounded-[var(--b-radius)] border border-dashed border-[var(--b-border)] p-4 text-center text-sm text-[var(--b-muted)]">
            {v.placeholder}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-ui text-base font-semibold text-[var(--b-fg)]">{v.title}</h3>
        {png ? <DerivedTag kind={png.source} note={png.provenance} /> : <Badge tone="amber">Proposed</Badge>}
        {v.key === "on-light" ? <Badge tone="amber">Derived variant, not official</Badge> : null}
      </div>
      <SvgLine svgId={v.svgId} />
    </GlowCard>
  );
}

export default function Lockups() {
  return (
    <SectionShell
      id="lockups"
      num="05"
      eyebrow="Lockups"
      title="Variants and backgrounds"
      lead={
        <p>
          The primary lockup is built for ink. Other variants exist for the places where a dark plate is impossible. Pick the variant by the
          surface it sits on, not by taste.
        </p>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {VARIANTS.map((v) => (
          <Tile key={v.key} v={v} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div>
          <SubHead>Use it for</SubHead>
          <SpecTable caption="Which lockup to use where" head={["Variant", "Use it for", "Surface"]} rows={TABLE_ROWS} />
        </div>
        <GlowCard className="self-start">
          <SubHead aside={<Badge tone="danger">Never</Badge>}>Primary on light</SubHead>
          <p className="text-base text-[var(--b-muted)]">
            Never place the primary lockup, with its black plate, on a light background. Use the on-light or ink mono variant instead. The
            on-light colours are darkened from the originals for contrast and are a derived, proposed variant until the owner supplies official
            artwork.
          </p>
        </GlowCard>
      </div>
    </SectionShell>
  );
}
