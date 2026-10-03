import { Badge, DerivedTag } from "@/components/ui";
import { assetsFor } from "@/content/assets";
import type { BrandId } from "@/content/types";
import { Card, Img, PartFrame, SubHeading, ThemedLogo, brandOf, resolveGlass, type ChapterPartProps } from "./shared";

type Demo = "glass" | "plate" | "sketch";

interface ImageryNotes {
  readonly demo: Demo;
  readonly points: readonly string[];
}

/** Only facts the spec records. No photography rules exist yet for any brand, so none are invented. */
const NOTES: Readonly<Record<BrandId, ImageryNotes>> = {
  ventures: { demo: "glass", points: ["Glass over ink, with the cyan to lime to amber gradient kept to the logo frame and thin edges.", "Photography direction: TBC."] },
  media: { demo: "glass", points: ["Glass: raised surface at 58%, blur 22px, saturate 165%, lime-tinted shadow.", "The otter mascot (Cash Captain) has an unconfirmed link to the brand and is not part of the identity.", "Photography direction: TBC."] },
  academy: { demo: "glass", points: ["Light first, with a full dark theme.", "Gold appears only on verified credentials.", "Photography direction: TBC."] },
  club: { demo: "glass", points: ["Dark, lime and glass. A redesign with mint, indigo and Instrument Sans was rejected.", "A mascot cursor PNG exists at 44 and 88 px.", "Photography direction: TBC."] },
  labs: { demo: "glass", points: ["Dark only. Glass fill 5.5%, strong 9.5%, highlight at 50%.", "Gradient runs cyan to amber at 90 degrees.", "Photography direction: TBC."] },
  mazal: { demo: "plate", points: ["Web: glass with blur 26px and saturate 170%.", "Social kit: flat shapes, zero glow, on the midnight plate with halftone dots, a 100px grid, film grain and a vignette.", "Mascot MAZI poses: Analyzing, Sunglasses, Risk Managed, Breaking News.", "Feed 2048 x 2048 JPEG, story 1080 x 1920."] },
  commune: { demo: "sketch", points: ["Hand-drawn sketchbook: wobbly SVG, 2px ink outlines, hard offset ink shadows.", "Dashed and dotted lines, tape strips, stickers, rotations from -2 to 2 degrees, dotted notebook background.", "No hue, no glass."] },
};

function GlassDemo({ brand, glass }: { readonly brand: BrandId; readonly glass: boolean }) {
  return (
    <div className="relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] p-6" style={{ background: "var(--b-bg)" }}>
      <span aria-hidden="true" className="absolute -left-10 -top-10 h-56 w-56 rounded-full opacity-60 blur-3xl" style={{ background: "var(--b-accent)" }} />
      <span aria-hidden="true" className="absolute -bottom-12 right-0 h-56 w-56 rounded-full opacity-50 blur-3xl" style={{ background: "var(--b-accent-2)" }} />
      <span aria-hidden="true" className="absolute bottom-6 left-1/3 h-32 w-32 rounded-full opacity-40 blur-3xl" style={{ background: "var(--b-accent-3)" }} />
      <Card brand={brand} glass={glass} className="relative z-10 flex w-full max-w-sm items-center gap-4">
        <span className="h-16 w-16 shrink-0"><ThemedLogo brand={brand} sizes="64px" /></span>
        <p className="text-base leading-snug text-[var(--b-fg)]">Glass over the brand&apos;s own light, with a soft top highlight.</p>
      </Card>
    </div>
  );
}

function PlateDemo() {
  return (
    <div className="mazal-plate relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] p-6">
      <div className="h-32 w-36"><ThemedLogo brand="mazal" fixed="dark" sizes="144px" /></div>
      <p className="absolute bottom-4 left-4 right-4 text-sm text-[var(--b-muted)]">Social kit plate, shown for reference. Flat, no glow.</p>
    </div>
  );
}

function SketchDemo() {
  return (
    <div className="sk-dotted-bg relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-[var(--b-radius)] border-2 border-[var(--b-fg)] p-6">
      <div className="sk-tape sk-ink -rotate-2 bg-[var(--b-bg)] px-6 py-5 shadow-[4px_4px_0_var(--b-fg)]">
        <svg aria-hidden="true" viewBox="0 0 160 40" className="mb-2 h-8 w-40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 22c12-14 20 14 32 0s20 14 32 0 20 14 32 0 20 14 28 0" className="text-[var(--b-fg)]" />
        </svg>
        <p className="[font-family:var(--b-font-hand)] text-3xl text-[var(--b-fg)]">small, personal, hand drawn</p>
      </div>
      <span className="sk-ink sk-wobble absolute bottom-5 right-6 rotate-2 bg-[var(--b-fg)] px-3 py-1 font-mono text-xs text-[var(--b-bg)]">sticker</span>
    </div>
  );
}

function Extras({ brand }: { readonly brand: BrandId }) {
  const extras = assetsFor(brand).filter((a) => (a.kind === "mascot" || a.kind === "cursor") && a.format !== "svg");
  if (extras.length === 0) return null;
  return (
    <div>
      <SubHeading>Mascot and cursor files</SubHeading>
      <ul className="flex flex-wrap gap-4">
        {extras.map((a) => (
          <li key={a.id} className="flex w-40 flex-col gap-2">
            <div className="flex h-32 items-center justify-center rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--b-surface)] p-3">
              <Img asset={a} alt={`${brandOf(brand).name} ${a.kind}, ${a.label}`} sizes="160px" className="max-h-full w-auto object-contain" />
            </div>
            <span className="text-sm text-[var(--b-fg)]">{a.label}</span>
            <DerivedTag kind={a.source} note={a.provenance} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Imagery: the visual surface language of the brand, shown live, with only facts the spec records. */
export default function ChapterImagery({ brand: id, glass: g, className }: ChapterPartProps) {
  const glass = resolveGlass(id, g);
  const notes = NOTES[id];
  return (
    <PartFrame
      brand={id}
      part="imagery"
      title="Imagery"
      lead="The surfaces, light and illustration that make this brand recognisable. Photography rules are not written yet."
      className={className}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {notes.demo === "glass" ? <GlassDemo brand={id} glass={glass} /> : null}
        {notes.demo === "plate" ? <PlateDemo /> : null}
        {notes.demo === "sketch" ? <SketchDemo /> : null}
        <ul className="space-y-3">
          {notes.points.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-[var(--b-radius)] border border-[var(--b-border)] p-4 text-base leading-relaxed text-[var(--b-fg)]">
              {p.includes("TBC") || p.includes("unconfirmed") ? <Badge tone="amber" className="mt-0.5 shrink-0">TBC</Badge> : <Badge tone="accent" className="mt-0.5 shrink-0">Fact</Badge>}
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <Extras brand={id} />
    </PartFrame>
  );
}
