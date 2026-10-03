import type { ReactNode } from "react";
import { Badge, Button, GlowCard, SectionShell } from "@/components/ui";
import { BRANDS } from "@/content/brands";
import { CardTitle, DEPARTMENTS, LogoImg, type Department } from "./shared";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";
const ARCHIVO = "var(--font-archivo), Archivo, sans-serif";

const ICON_IDS: readonly { readonly id: string; readonly name: string }[] = [
  { id: "ventures-app-icon-1024", name: "GN Ventures" },
  ...DEPARTMENTS.map((d) => ({ id: d.iconId, name: d.name })),
];

function titleStyle() {
  return { fontFamily: "var(--b-font-display)", fontWeight: "var(--b-title-weight)", textTransform: "var(--b-title-transform)", letterSpacing: "var(--b-title-tracking)" } as const;
}

function Frame({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <figure className="m-0">
      {children}
      <figcaption className="mt-2 text-sm text-[var(--fog-dim)]">{label}</figcaption>
    </figure>
  );
}

function HeroMock({ d }: { readonly d: Department }) {
  const domain = BRANDS[d.id].domain ?? "domain TBC";
  return (
    <Frame label={`${d.name} website hero`}>
      <div data-brand={d.id} inert className={`overflow-hidden rounded-xl border border-[var(--b-border)] ${d.id === "commune" ? "sk-dotted-bg" : "brand-surface"}`} role="img" aria-label={`${d.name} website hero mock: logo, tagline ${d.tagline} and a button`}>
        <div className="flex items-center gap-1.5 border-b border-[var(--b-border)] px-3 py-2" aria-hidden="true">
          <span className="size-2 rounded-full bg-[var(--b-border)]" />
          <span className="size-2 rounded-full bg-[var(--b-border)]" />
          <span className="size-2 rounded-full bg-[var(--b-border)]" />
          <span className="ml-2 truncate rounded-full bg-[var(--b-surface)] px-3 text-[0.6875rem] text-[var(--b-muted)]">{domain}</span>
        </div>
        <div className="flex min-h-56 flex-col items-start justify-between gap-5 p-5 sm:p-6">
          <LogoImg id={d.logoId} alt={`${d.name} logo`} className={d.id === "mazal" ? "w-12" : "w-24"} sizes="120px" />
          <p className="max-w-[24ch] text-[clamp(1.1rem,2vw,1.6rem)] leading-tight text-[var(--b-fg)]" style={titleStyle()}>{d.tagline}</p>
          <Button variant="primary" tabIndex={-1}>{d.cta}</Button>
        </div>
      </div>
    </Frame>
  );
}

function OgCard({ d }: { readonly d: Department }) {
  return (
    <Frame label={`${d.name} share card, 1200x630`}>
      <div data-brand={d.id} className={`relative flex aspect-[1200/630] items-center justify-between gap-4 overflow-hidden rounded-xl border border-[var(--b-border)] p-5 ${d.id === "commune" ? "sk-dotted-bg" : "brand-surface"}`} role="img" aria-label={`${d.name} Open Graph card with logo and tagline ${d.tagline}`}>
        {d.id !== "commune" ? <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(60% 80% at 0% 0%, color-mix(in srgb, var(--b-accent) 20%, transparent), transparent 70%)" }} /> : null}
        <p className="relative max-w-[16ch] text-[clamp(0.9rem,1.7vw,1.35rem)] leading-tight text-[var(--b-fg)]" style={titleStyle()}>{d.tagline}</p>
        <LogoImg id={d.logoId} alt="" className={`relative ${d.id === "mazal" ? "w-14" : "w-[34%]"}`} sizes="160px" />
      </div>
    </Frame>
  );
}

function Plate({ children, className }: { readonly children: ReactNode; readonly className: string }) {
  return (
    <div data-brand="mazal" data-channel="social" className={`mazal-plate relative overflow-hidden rounded-xl border border-[var(--b-border)] ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.16] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.62) 100%)" }} />
      <div className="relative flex h-full flex-col items-center justify-center gap-4 p-5 text-center">{children}</div>
    </div>
  );
}

function Pill({ children }: { readonly children: string }) {
  return (
    <span className="rounded-full bg-[#c0f030] px-4 py-2 text-[clamp(0.6rem,1.2vw,0.8rem)] text-[#04070c]" style={{ fontFamily: ARCHIVO, fontWeight: 800 }}>
      {children}
    </span>
  );
}

function MazalFormats() {
  return (
    <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <Frame label="Feed post, 2048 x 2048 JPEG (shown square)">
        <Plate className="aspect-square" >
          <LogoImg id="mazal-mark" alt="Mazal M mark" className="w-1/5" sizes="120px" />
          <p className="max-w-[16ch] text-[clamp(1.3rem,3.2vw,2.4rem)] leading-[1.05] text-white" style={{ fontFamily: ARCHIVO, fontWeight: 900 }}>A friend who trades. Not a bank.</p>
          <Pill>Comment MAZAL to learn more</Pill>
        </Plate>
      </Frame>
      <Frame label="Story, 1080 x 1920 (shown 9:16)">
        <Plate className="mx-auto aspect-[9/16] max-w-64">
          <LogoImg id="mazal-mark" alt="Mazal M mark" className="w-1/4" sizes="100px" />
          <p className="text-[clamp(1.1rem,2.4vw,1.6rem)] leading-[1.05] text-white" style={{ fontFamily: ARCHIVO, fontWeight: 900 }}>A community. Not just a page.</p>
          <Pill>Comment MAZAL to learn more</Pill>
        </Plate>
      </Frame>
    </div>
  );
}

function Splash() {
  return (
    <Frame label="Splash screen: site name, logo, loader">
      <div className="relative flex aspect-video flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--deep)]" role="img" aria-label="Splash screen with the GN Ventures logo, the site name GN Ventures Brand Guidelines and a loading bar">
        <LogoImg id="ventures-horizontal" alt="" className="w-1/4" sizes="160px" />
        <p className="font-display text-[clamp(0.7rem,1.6vw,1.1rem)] font-light uppercase tracking-[0.12em] text-[var(--fog)]">GN Ventures Brand Guidelines</p>
        <span aria-hidden="true" className="block h-[3px] w-1/3 rounded-full" style={{ background: "var(--brand-gradient)" }} />
      </div>
    </Frame>
  );
}

function AppIcons() {
  return (
    <ul className="grid grid-cols-4 gap-4 sm:grid-cols-7" aria-label="App icons">
      {ICON_IDS.map((i) => (
        <li key={i.id} className="list-none text-center">
          <LogoImg id={i.id} alt={`${i.name} app icon`} className="mx-auto w-full max-w-24 rounded-[22%] border border-[var(--glass-border)]" sizes="96px" />
          <p className="mt-2 text-[0.8125rem] leading-tight text-[var(--fog-dim)]">{i.name}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Applications() {
  return (
    <SectionShell
      id="applications"
      num="20"
      eyebrow="Applications"
      title="The system in the wild"
      lead={<p>Mock frames show the rules at work: a website hero per department, share cards, Mazal social formats, the splash screen and app icons. Every line of copy is from the brand facts, and every logo is the real file.</p>}
    >
      <div>
        <CardTitle eyebrow="Websites" title="Hero per department" badge={<Badge tone="neutral">Mock</Badge>} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DEPARTMENTS.map((d) => <HeroMock key={d.id} d={d} />)}
        </div>
      </div>
      <div>
        <CardTitle eyebrow="Link previews" title="Share cards" badge={<Badge tone="neutral">Mock</Badge>} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DEPARTMENTS.map((d) => <OgCard key={d.id} d={d} />)}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <GlowCard>
          <CardTitle eyebrow="Mazal social kit" title="Feed and story" />
          <MazalFormats />
        </GlowCard>
        <div className="space-y-6">
          <GlowCard>
            <CardTitle eyebrow="Loading" title="Splash screen" />
            <Splash />
          </GlowCard>
          <GlowCard>
            <CardTitle eyebrow="Icons" title="App icons" />
            <AppIcons />
          </GlowCard>
        </div>
      </div>
    </SectionShell>
  );
}
