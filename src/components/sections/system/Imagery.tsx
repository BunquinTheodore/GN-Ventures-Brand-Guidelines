import { Badge, GlowCard, SectionShell } from "@/components/ui";
import { CardTitle, LogoImg } from "./shared";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

interface Direction {
  readonly title: string;
  readonly body: string;
}

const DIRECTIONS: readonly Direction[] = [
  { title: "Dark ink first", body: "Near-black base, lime as the one bright accent, cyan to amber only as a gradient edge or a soft glow." },
  { title: "Glass layers", body: "Translucent panels over the ink with blur, a top highlight and a brand-tinted shadow. Depth comes from layering, not from drop shadows." },
  { title: "Full-color photography on GN Club", body: "Real event photography stays in full color. No duotone, no lime wash over faces." },
  { title: "Honest imagery", body: "Only photos we own or were given. No stock-photo claims, no invented partner logos, no fake screenshots." },
];

function InkTile() {
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--ink)]"
      role="img"
      aria-label="Dark ink surface with a lime glow at top left and a cyan to amber glow at bottom right"
    >
      <div className="absolute inset-0" style={{ background: "radial-gradient(55% 55% at 12% 10%, color-mix(in srgb, var(--lime) 34%, transparent), transparent 70%), radial-gradient(60% 60% at 92% 95%, color-mix(in srgb, var(--cyan) 30%, transparent), transparent 70%), radial-gradient(40% 40% at 100% 100%, color-mix(in srgb, var(--amber) 26%, transparent), transparent 70%)" }} />
      <div className="gn-glass gn-shine absolute inset-x-[12%] bottom-[14%] top-[34%] overflow-hidden p-4">
        <p className="gn-eyebrow text-[0.75rem]">Glass over ink</p>
      </div>
    </div>
  );
}

function PhotoTile({ good }: { readonly good: boolean }) {
  const bg = good
    ? "linear-gradient(135deg, #f2b84e 0%, #e8606a 34%, #33c7e0 68%, #c6f24e 100%)"
    : "linear-gradient(135deg, color-mix(in srgb, var(--lime) 30%, #000), color-mix(in srgb, var(--lime) 90%, #000))";
  return (
    <figure className="m-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)]" style={{ background: bg }} role="img" aria-label={good ? "Placeholder showing a full-color treatment" : "Placeholder showing a duotone treatment that is not allowed"}>
        <span className="absolute left-3 top-3"><Badge tone="neutral">Placeholder, not a photo</Badge></span>
      </div>
      <figcaption className="mt-2 flex items-center gap-2 text-sm text-[var(--b-muted)]">
        <Badge tone={good ? "accent" : "danger"}>{good ? "Do" : "Do not"}</Badge>
        {good ? "Full color, natural contrast" : "Duotone or single-hue wash"}
      </figcaption>
    </figure>
  );
}

function MazalPlate() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] mazal-plate" role="img" aria-label="Mazal social plate: navy diagonal gradient with lime light top left, blue light bottom right, halftone dots, grid, grain and vignette">
      <div className="absolute inset-0 opacity-[0.16] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.62) 100%)" }} />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <LogoImg id="mazal-mark" alt="Mazal M mark in Cyber Lime" className="w-1/4" sizes="120px" />
        <p className="text-[clamp(1.1rem,2.4vw,1.6rem)] leading-tight text-white" style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", fontWeight: 900 }}>
          A friend who trades. Not a bank.
        </p>
      </div>
    </div>
  );
}

const PLATE_LAYERS: readonly { readonly name: string; readonly spec: string }[] = [
  { name: "Base", spec: "Navy diagonal gradient, #04070C to #05090F" },
  { name: "Light", spec: "Lime light off-canvas top left, Electric Blue #0128A9 bottom right (ambient only)" },
  { name: "Texture", spec: "16px halftone dots, 100px grid, film grain" },
  { name: "Finish", spec: "Vignette. Flat shapes on top, zero glow" },
];

function Doodles() {
  return (
    <div data-brand="commune" className="sk-dotted-bg relative aspect-square w-full overflow-hidden rounded-[var(--b-radius)] border-2 border-[var(--b-fg)] p-5 text-[var(--b-fg)]" role="img" aria-label="Commune sketchbook style: wobbly ink doodles of a coffee cup, steam and a cart on a dotted notebook page">
      <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M58 96c-2 30 6 52 34 52s38-22 36-52c-24 4-48 4-70 0z" />
        <path d="M128 104c18-4 26 8 18 20-5 7-13 9-20 8" />
        <path d="M78 74c-8-10 8-14 0-26M98 74c-8-10 8-14 0-26M118 74c-8-10 8-14 0-26" strokeDasharray="1 7" />
        <path d="M42 158c30 6 86 6 118 0" strokeDasharray="6 6" />
        <circle cx="60" cy="172" r="9" />
        <circle cx="140" cy="172" r="9" />
        <path d="M30 40l14 14M44 40L30 54" />
      </svg>
      <p className="absolute bottom-3 right-4 -rotate-2 text-xl" style={{ fontFamily: "var(--font-caveat), Caveat, cursive" }}>sketchbook</p>
    </div>
  );
}

function ScreenshotFrame() {
  return (
    <div className="rounded-[1.25rem] bg-[var(--ink)] p-4 sm:p-6">
      <div className="overflow-hidden rounded-xl border border-[var(--glass-border)] shadow-[0_24px_60px_-24px_color-mix(in_srgb,var(--lime)_30%,transparent)]" role="img" aria-label="Screenshot treatment: rounded corners, one pixel glass border, set on ink">
        <div className="flex items-center gap-1.5 border-b border-[var(--glass-border)] bg-[var(--raised)] px-3 py-2" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[var(--glass-strong)]" />
          <span className="size-2.5 rounded-full bg-[var(--glass-strong)]" />
          <span className="size-2.5 rounded-full bg-[var(--glass-strong)]" />
        </div>
        <div className="grid h-36 grid-cols-3 gap-2 bg-[var(--deep)] p-3" aria-hidden="true">
          <div className="col-span-2 rounded-lg bg-[var(--glass)]" />
          <div className="rounded-lg bg-[color-mix(in_srgb,var(--lime)_18%,transparent)]" />
          <div className="rounded-lg bg-[var(--glass)]" />
          <div className="col-span-2 rounded-lg bg-[var(--glass)]" />
        </div>
      </div>
    </div>
  );
}

export default function Imagery() {
  return (
    <SectionShell
      id="imagery"
      num="17"
      eyebrow="Imagery"
      title="Ink, glass and real photos"
      lead={<p>Imagery direction for the umbrella and every department: dark ink, a bright lime accent, glass layers, and photography that stays honest and in full color. Each recipe below is rendered live in CSS.</p>}
    >
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Imagery direction">
        {DIRECTIONS.map((d, i) => (
          <GlowCard as="li" key={d.title} zoom shineDelay={i * 0.5} className="list-none">
            <h3 className="mb-2 text-lg text-[var(--b-fg)]">{d.title}</h3>
            <p className="text-[0.9375rem] text-[var(--b-muted)]">{d.body}</p>
          </GlowCard>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlowCard>
          <CardTitle eyebrow="Family look" title="Ink with lime, cyan and amber light" />
          <InkTile />
          <p className="mt-3 text-sm text-[var(--b-muted)]">Glows use color-mix over the site tokens: lime top left, cyan to amber bottom right. No new hex values.</p>
        </GlowCard>
        <GlowCard>
          <CardTitle eyebrow="GN Club" title="Photography: full color, no duotone" badge={<Badge tone="amber">Proposed</Badge>} />
          <div className="grid gap-4 sm:grid-cols-2">
            <PhotoTile good />
            <PhotoTile good={false} />
          </div>
          <p className="mt-3 text-sm text-[var(--b-muted)]">Tiles are CSS placeholders that show the treatment only. Real photography is supplied by the owner.</p>
        </GlowCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div data-brand="mazal" data-channel="social" className="contents">
        <GlowCard>
          <CardTitle eyebrow="Mazal social kit" title="The plate" />
          <MazalPlate />
          <ul className="mt-4 space-y-2 text-sm text-[var(--b-muted)]">
            {PLATE_LAYERS.map((l) => (
              <li key={l.name}><strong className="text-[var(--b-fg)]">{l.name}.</strong> {l.spec}</li>
            ))}
          </ul>
        </GlowCard>
        </div>
        <GlowCard>
          <CardTitle eyebrow="GN Commune" title="Sketchbook doodles" />
          <Doodles />
          <p className="mt-4 text-sm text-[var(--b-muted)]">Strictly black and white. Wobbly SVG, 2px ink outlines, hard offset shadows, dashed and dotted lines, dotted notebook page. Glass is retired for Commune.</p>
        </GlowCard>
        <GlowCard>
          <CardTitle eyebrow="Product shots" title="Screenshot treatment" />
          <ScreenshotFrame />
          <p className="mt-4 text-sm text-[var(--b-muted)]">Rounded corners, a 1px glass border, set on ink with a lime-tinted shadow. Show real product only, never mocked data presented as real.</p>
        </GlowCard>
      </div>
    </SectionShell>
  );
}
