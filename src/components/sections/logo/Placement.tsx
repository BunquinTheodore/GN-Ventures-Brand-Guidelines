import type { ReactNode } from "react";
import SectionShell from "@/components/ui/SectionShell";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { LogoImg, SpecTable, STAGE_BASE, SubHead } from "./parts";

const ALT_PRIMARY = "GN Ventures logo";
const BAR = "block h-2 rounded-full bg-[color-mix(in_srgb,currentColor_22%,transparent)]";

interface FrameProps {
  readonly title: string;
  readonly spec: string;
  readonly aspect: string;
  readonly surface: "bg-black" | "bg-white";
  readonly children: ReactNode;
}

function Frame({ title, spec, aspect, surface, children }: FrameProps) {
  return (
    <GlowCard as="article" className="flex flex-col gap-3">
      <div className={cn(STAGE_BASE, aspect, surface, surface === "bg-white" ? "text-black" : "text-white")}>{children}</div>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-ui text-base font-semibold text-[var(--b-fg)]">{title}</h3>
        <Badge tone="amber">Proposed</Badge>
      </div>
      <p className="font-mono text-sm text-[var(--b-muted)]">{spec}</p>
    </GlowCard>
  );
}

function Header() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between border-b border-white/15 px-[6%] py-[3%]">
        <LogoImg id="ventures-horizontal" alt={ALT_PRIMARY} className="h-auto w-[22%]" sizes="120px" />
        <span className="flex w-[40%] justify-between" aria-hidden="true">
          <span className={cn(BAR, "w-[22%]")} />
          <span className={cn(BAR, "w-[22%]")} />
          <span className={cn(BAR, "w-[22%]")} />
        </span>
      </div>
      <div className="grid flex-1 content-center gap-2 px-[6%]" aria-hidden="true">
        <span className={cn(BAR, "w-3/5")} />
        <span className={cn(BAR, "w-2/5")} />
      </div>
    </div>
  );
}

function SlideTitle() {
  return <LogoImg id="ventures-horizontal" alt={ALT_PRIMARY} className="h-auto w-[34%]" sizes="200px" />;
}

function SlideContent() {
  return (
    <div className="absolute inset-0 grid content-start gap-2 p-[8%]" aria-hidden="true">
      <span className={cn(BAR, "w-1/2")} />
      <span className={cn(BAR, "w-4/5")} />
      <span className={cn(BAR, "w-3/5")} />
      <span className="absolute bottom-[7%] right-[6%] w-[14%]">
        <LogoImg id="ventures-horizontal" alt="" className="h-auto w-full" sizes="60px" />
      </span>
    </div>
  );
}

function SlideClosing() {
  return (
    <div className="grid justify-items-center gap-3">
      <LogoImg id="ventures-horizontal" alt={ALT_PRIMARY} className="h-auto w-[40%]" sizes="200px" />
      <span className={cn(BAR, "w-24")} aria-hidden="true" />
    </div>
  );
}

function Document() {
  return (
    <div className="absolute inset-0 grid content-start gap-2 p-[9%]" aria-hidden="true">
      <span className="mb-3 block w-[38%]">
        <LogoImg id="ventures-on-light" alt="" className="h-auto w-full" sizes="90px" />
      </span>
      <span className={cn(BAR, "w-4/5")} />
      <span className={cn(BAR, "w-full")} />
      <span className={cn(BAR, "w-full")} />
      <span className={cn(BAR, "w-3/5")} />
      <span className={cn(BAR, "mt-3 w-full")} />
      <span className={cn(BAR, "w-2/3")} />
    </div>
  );
}

function Watermark() {
  return (
    <div className="absolute inset-0 grid content-start gap-2 p-[8%]" aria-hidden="true">
      <span className={cn(BAR, "w-1/2")} />
      <span className={cn(BAR, "w-4/5")} />
      <span className="absolute bottom-[6%] right-[5%] w-[38%] opacity-60">
        <LogoImg id="ventures-watermark" alt="" className="h-auto w-full" sizes="140px" />
      </span>
    </div>
  );
}

const SIZE_ROWS: readonly (readonly string[])[] = [
  ["Website header", "Logo height 32 px, left aligned", "Proposed"],
  ["Deck title slide", "Logo 34% of slide width, centred", "Proposed"],
  ["Deck content slide", "Logo 14% of slide width, bottom right", "Proposed"],
  ["Deck closing slide", "Logo 40% of slide width, centred", "Proposed"],
  ["A4 document", "Logo 35 mm wide, top left, on-light variant", "Proposed"],
  ["OG image", "1200 x 630 px, logo 30% of width", "Proposed"],
  ["Watermark", "Logo 38% of width, 60% opacity, one corner", "Proposed"],
];

function CoBranding() {
  return (
    <GlowCard className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
      <div className={cn(STAGE_BASE, "aspect-[16/9] w-full bg-black")}>
        <div className="grid justify-items-center gap-3">
          <LogoImg id="mazal-primary-dark" alt="Mazal logo" className="h-auto w-24 sm:w-32" sizes="128px" />
          <div className="flex items-center gap-2">
            <span className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]">Powered by</span>
            <LogoImg id="ventures-horizontal" alt={ALT_PRIMARY} className="h-auto w-14 sm:w-20" sizes="80px" />
          </div>
        </div>
      </div>
      <div>
        <SubHead aside={<Badge tone="amber">Proposed</Badge>}>Co-branding</SubHead>
        <ul className="grid gap-2 text-base text-[var(--b-muted)]">
          <li>The department logo leads. The line reads Powered by GN Ventures, set in Poppins caps with generous tracking.</li>
          <li>The GN Ventures logo sits at half the height of the department logo, never larger, never equal.</li>
          <li>Keep one clear space unit between the two. They never touch or overlap.</li>
          <li>Partner logos get the same clear space as ours and never share a plate with a GN logo.</li>
        </ul>
      </div>
    </GlowCard>
  );
}

export default function Placement() {
  return (
    <SectionShell
      id="placement"
      num="07"
      eyebrow="Placement and co-branding"
      title="Where the logo lives"
      lead={
        <p>
          Place the logo in the same spot on the same kind of surface, every time. The frames below are live mock-ups built with the real
          files. All sizes are proposals until the owner signs them off.
        </p>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Frame title="Website header" spec="32 px logo, left" aspect="aspect-[16/10]" surface="bg-black"><Header /></Frame>
        <Frame title="Deck title" spec="34% width, centred" aspect="aspect-video" surface="bg-black"><SlideTitle /></Frame>
        <Frame title="Deck content" spec="14% width, bottom right" aspect="aspect-video" surface="bg-black"><SlideContent /></Frame>
        <Frame title="Deck closing" spec="40% width, centred" aspect="aspect-video" surface="bg-black"><SlideClosing /></Frame>
        <Frame title="A4 document" spec="35 mm wide, top left" aspect="aspect-[210/297] w-3/5 mx-auto" surface="bg-white"><Document /></Frame>
        <Frame title="OG 1200 x 630" spec="Social share image" aspect="aspect-[1200/630]" surface="bg-black">
          <LogoImg id="ventures-og" alt="GN Ventures social share image" className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 1280px) 30vw, 90vw" />
        </Frame>
        <Frame title="Watermark" spec="38% width, 60% opacity" aspect="aspect-video" surface="bg-black"><Watermark /></Frame>
      </div>

      <CoBranding />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
        <div>
          <SubHead aside={<Badge tone="amber">Proposed</Badge>}>Sizes by surface</SubHead>
          <SpecTable caption="Proposed logo sizes by surface" head={["Surface", "Rule", "Status"]} rows={SIZE_ROWS.map((r) => [r[0], r[1], <Badge key={r[0]} tone="amber">Proposed</Badge>])} />
        </div>
        <div className="grid content-start gap-5">
          <GlowCard>
            <SubHead>One logo per surface</SubHead>
            <p className="text-base text-[var(--b-muted)]">A page, slide or sheet carries one GN logo. Repeating it, or stacking two departments, weakens both.</p>
          </GlowCard>
          <GlowCard>
            <SubHead>Clear space wins</SubHead>
            <p className="text-base text-[var(--b-muted)]">If a layout cannot give the logo its clear space, the layout changes. The logo does not.</p>
          </GlowCard>
        </div>
      </div>
    </SectionShell>
  );
}
