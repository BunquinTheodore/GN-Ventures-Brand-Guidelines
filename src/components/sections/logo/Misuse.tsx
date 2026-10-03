import SectionShell from "@/components/ui/SectionShell";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { LogoImg, STAGE_BASE, SubHead } from "./parts";

interface Misuse {
  readonly key: string;
  readonly title: string;
  readonly caption: string;
  readonly stage: string;
  readonly logo: string;
}

const MISUSES: readonly Misuse[] = [
  {
    key: "stretch",
    title: "Do not stretch",
    caption: "Never squash or stretch the logo. Scale it in proportion only.",
    stage: "bg-black",
    logo: "[transform:scale(1.55,0.7)]",
  },
  {
    key: "recolor",
    title: "Do not recolour",
    caption: "The lime, cyan and amber are fixed. No hue shifts, no tints, no brand swaps.",
    stage: "bg-black",
    logo: "[filter:hue-rotate(150deg)]",
  },
  {
    key: "shadow",
    title: "Do not add effects",
    caption: "No drop shadows, glows, outlines or bevels on the logo.",
    stage: "bg-black",
    logo: "[filter:drop-shadow(8px_8px_0_var(--b-accent-3))]",
  },
  {
    key: "rotate",
    title: "Do not rotate",
    caption: "Keep the logo level. No tilting, no vertical stacking.",
    stage: "bg-black",
    logo: "[transform:rotate(-18deg)]",
  },
  {
    key: "contrast",
    title: "Do not hide it",
    caption: "Never place the logo on a background close to its own colours. Lime on lime disappears.",
    stage: "bg-[var(--b-accent)]",
    logo: "",
  },
  {
    key: "crop",
    title: "Do not crop or re-space",
    caption: "Do not cut the frame, move the word, or change the gap between the gn and the word.",
    stage: "bg-black",
    logo: "[transform:scale(1.9)_translate(-14%,6%)]",
  },
];

function RedX() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--b-danger)] bg-black/70 text-[var(--b-danger)]"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M5 5l14 14M19 5L5 19" />
      </svg>
    </span>
  );
}

function MisuseTile({ m }: { readonly m: Misuse }) {
  return (
    <GlowCard as="article" zoom className="flex flex-col gap-3">
      <div className={cn(STAGE_BASE, "aspect-[4/3]", m.stage)}>
        <RedX />
        <LogoImg
          id="ventures-primary-transparent"
          alt={`GN Ventures logo shown with this misuse: ${m.title}`}
          className={cn("h-auto w-[62%]", m.logo)}
          sizes="(min-width: 1024px) 20vw, 60vw"
        />
      </div>
      <div className="flex items-center gap-2">
        <Badge tone="danger">Wrong</Badge>
        <h3 className="font-ui text-base font-semibold text-[var(--b-fg)]">{m.title}</h3>
      </div>
      <p className="text-base text-[var(--b-muted)]">{m.caption}</p>
    </GlowCard>
  );
}

export default function Misuse() {
  return (
    <SectionShell
      id="misuse"
      num="08"
      eyebrow="Misuse"
      title="What not to do"
      lead={
        <p>
          These tiles are live: each one applies a real CSS transform to the real logo so you can see exactly what goes wrong. If you are
          unsure whether a treatment is allowed, it is not.
        </p>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {MISUSES.map((m) => (
          <MisuseTile key={m.key} m={m} />
        ))}
      </div>
      <GlowCard className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
        <div>
          <SubHead aside={<Badge tone="danger">Never</Badge>}>Do not improvise a light theme</SubHead>
          <p className="text-base text-[var(--b-muted)]">
            Do not invert the logo, place the black plate on white, or recolour it to suit a light page. If a light surface is unavoidable, use
            the on-light or ink mono variant from the Lockups section, or ask the owner for artwork. Inventing your own breaks the family look.
          </p>
        </div>
        <div className={cn(STAGE_BASE, "relative aspect-[16/7] bg-white")}>
          <RedX />
          <LogoImg id="ventures-primary-dark" alt="GN Ventures black plate logo wrongly placed on a white background" className="h-auto w-[34%]" sizes="200px" />
        </div>
      </GlowCard>
    </SectionShell>
  );
}
