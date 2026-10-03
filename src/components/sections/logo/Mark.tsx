import SectionShell from "@/components/ui/SectionShell";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import DerivedTag from "@/components/ui/DerivedTag";
import { getAsset } from "@/content/assets";
import type { BrandAsset } from "@/content/asset-types";
import { cn } from "@/lib/utils";
import { LogoImg, SpecTable, STAGE_BASE, SubHead } from "./parts";

interface Preview {
  readonly id: string;
  readonly title: string;
  readonly px: string;
  readonly shape: "square" | "round" | "tab";
  readonly stage: "bg-black" | "bg-white" | "bg-[var(--b-accent)]";
  readonly alt: string;
}

const PREVIEWS: readonly Preview[] = [
  { id: "ventures-favicon", title: "Favicon", px: "16 and 32 px in a tab", shape: "tab", stage: "bg-white", alt: "GN Ventures favicon in a browser tab" },
  { id: "ventures-apple-touch-180", title: "Apple touch", px: "180 px", shape: "square", stage: "bg-[var(--b-accent)]", alt: "GN Ventures apple touch icon" },
  { id: "ventures-manifest-192", title: "Manifest 192", px: "192 px", shape: "square", stage: "bg-white", alt: "GN Ventures manifest icon, 192 pixels" },
  { id: "ventures-manifest-512", title: "Manifest 512", px: "512 px", shape: "square", stage: "bg-black", alt: "GN Ventures manifest icon, 512 pixels" },
  { id: "ventures-avatar-1024", title: "Avatar 1024", px: "1024 px, circle safe", shape: "round", stage: "bg-[var(--b-accent)]", alt: "GN Ventures avatar cropped to a circle" },
];

const TABLE_KINDS: readonly string[] = ["ventures-favicon", "ventures-apple-touch-180", "ventures-manifest-192", "ventures-manifest-512", "ventures-app-icon-1024", "ventures-avatar-1024"];

function sizeOf(a: BrandAsset): string {
  return a.width && a.height ? `${a.width} x ${a.height}` : "n/a";
}

function fileName(a: BrandAsset): string {
  return a.file.split("/").pop() ?? a.file;
}

function tableRows() {
  return TABLE_KINDS.flatMap((id) => {
    const a = getAsset(id);
    return a
      ? [[a.label, <span key={id} className="font-mono text-sm">{fileName(a)}</span>, sizeOf(a), <DerivedTag key={`${id}-t`} kind={a.source} note={a.provenance} />]]
      : [];
  });
}

function PreviewTile({ p }: { readonly p: Preview }) {
  const size = p.shape === "tab" ? "h-auto w-8" : p.shape === "round" ? "h-auto w-28 rounded-full" : "h-auto w-28 rounded-[22%]";
  return (
    <GlowCard as="article" zoom className="flex flex-col gap-3">
      <div className={cn(STAGE_BASE, "aspect-square", p.stage)}>
        {p.shape === "tab" ? (
          <div className="flex items-center gap-2 rounded-t-lg bg-neutral-200 px-3 py-2">
            <LogoImg id={p.id} alt={p.alt} className={size} sizes="32px" />
            <span aria-hidden="true" className="h-2 w-12 rounded bg-neutral-400" />
          </div>
        ) : (
          <LogoImg id={p.id} alt={p.alt} className={cn(size, "overflow-hidden")} sizes="112px" />
        )}
      </div>
      <div>
        <h3 className="font-ui text-base font-semibold text-[var(--b-fg)]">{p.title}</h3>
        <p className="font-mono text-sm text-[var(--b-muted)]">{p.px}</p>
      </div>
    </GlowCard>
  );
}

function MazalCommune() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <GlowCard className="grid gap-4">
        <SubHead aside={<DerivedTag kind="original" note="mazal_m_lime.svg and mazal_m_white.svg are original vectors" />}>Mazal M mark</SubHead>
        <div className="grid grid-cols-3 gap-3">
          <div className={cn(STAGE_BASE, "aspect-square bg-black p-5")}>
            <LogoImg id="mazal-mark-lime-svg" alt="Mazal M mark, lime" sizes="96px" />
          </div>
          <div className={cn(STAGE_BASE, "aspect-square bg-white p-5")}>
            <LogoImg id="mazal-mono-ink-svg" alt="Mazal M mark, ink" sizes="96px" />
          </div>
          <div className={cn(STAGE_BASE, "aspect-square bg-black p-5")}>
            <LogoImg id="mazal-mark-white-svg" alt="Mazal M mark, white" sizes="96px" />
          </div>
        </div>
        <p className="text-base text-[var(--b-muted)]">
          The M is the only original vector in the company. One mark, one colour: lime, white or ink. Never outline, glow or redraw it. The ink
          version is a derived trace.
        </p>
      </GlowCard>
      <GlowCard className="grid gap-4">
        <SubHead aside={<Badge tone="neutral">Black and white only</Badge>}>Commune sipper mark</SubHead>
        <div className="grid grid-cols-2 gap-3">
          <div className={cn(STAGE_BASE, "aspect-square bg-white p-5")}>
            <LogoImg id="commune-logo-sipper" alt="GN Commune sipper mark, black line on white" sizes="160px" />
          </div>
          <div className={cn(STAGE_BASE, "aspect-square bg-black p-5")}>
            <LogoImg id="commune-mono-white" alt="GN Commune sipper mark, white line on black" sizes="160px" />
          </div>
        </div>
        <p className="text-base text-[var(--b-muted)]">
          The sleepy sipper is the Commune mark: black ink on white, or white ink on black. No hue, no glass, no glow.
        </p>
      </GlowCard>
    </div>
  );
}

export default function Mark() {
  return (
    <SectionShell
      id="mark"
      num="06"
      eyebrow="Compact mark and app icons"
      title="Small, square, still recognisable"
      lead={
        <p>
          When the full lockup is too small, use an icon file. Every size below is exported from the same artwork so the lime gn and the
          gradient frame read the same in a tab, on a home screen and as an avatar.
        </p>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {PREVIEWS.map((p) => (
          <PreviewTile key={p.id} p={p} />
        ))}
      </div>
      <div>
        <SubHead aside={<Badge tone="amber">Proposed</Badge>}>Files and sizes</SubHead>
        <SpecTable caption="GN Ventures icon files and sizes" head={["File", "Name", "Pixels", "Source"]} rows={tableRows()} />
        <p className="mt-4 max-w-prose text-base text-[var(--b-muted)]">
          The avatar keeps the logo at half the canvas width so a circular crop never cuts it. All icon files are derived from the raster logo
          until original vectors arrive, and the sizes are a proposed set for the owner to confirm.
        </p>
      </div>
      <MazalCommune />
    </SectionShell>
  );
}
