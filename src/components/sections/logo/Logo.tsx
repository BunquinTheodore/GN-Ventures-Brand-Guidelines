import SectionShell from "@/components/ui/SectionShell";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import DerivedTag from "@/components/ui/DerivedTag";
import { LazyLogoViewer3D } from "@/components/three";
import { getAsset } from "@/content/assets";
import { BRANDS } from "@/content/brands";
import { thumbFor } from "@/content/thumbs";
import type { BrandId } from "@/content/types";
import { LogoImg, SubHead } from "./parts";

const VIEWER_ORDER: readonly BrandId[] = ["ventures", "media", "academy", "club", "labs", "mazal", "commune"];
const SHARED_FRAME: readonly BrandId[] = ["ventures", "media", "academy", "club", "labs"];

const ANATOMY: readonly { readonly n: string; readonly title: string; readonly body: string }[] = [
  { n: "1", title: "The gn", body: "Lowercase, geometric, neon lime. Never retyped, never recoloured." },
  { n: "2", title: "The word", body: "Small bold caps tucked beside or below the gn. This is the only part that changes between departments." },
  { n: "3", title: "The frame", body: "Rounded rectangle. Its stroke runs left to right from cyan to lime to amber." },
  { n: "4", title: "The plate", body: "Solid black. The primary lockup lives on ink, never on a light surface." },
];

function viewerItems() {
  return VIEWER_ORDER.flatMap((id) => {
    const asset = getAsset(`${id}-primary-dark`);
    return asset ? [{ id, label: BRANDS[id].name, src: asset.file, thumb: thumbFor(id) }] : [];
  });
}

function altFor(id: BrandId): string {
  return `${BRANDS[id].name} logo`;
}

export default function Logo() {
  const items = viewerItems();
  return (
    <SectionShell
      id="logo"
      num="03"
      eyebrow="Logo"
      title="One lockup, six words"
      lead={
        <p>
          Every GN logo is the same lockup. The lime gn, the rounded gradient frame and the black plate stay fixed. A department swaps the
          word and nothing else.
        </p>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <GlowCard className="grid gap-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center">
          <div className="mx-auto w-full max-w-[14rem] overflow-hidden rounded-[var(--b-radius)] bg-black">
            <LogoImg id="ventures-primary-dark" alt="GN Ventures logo" sizes="224px" />
          </div>
          <div>
            <SubHead aside={<DerivedTag kind="original" note="Original raster file from the owner" />}>Lockup anatomy</SubHead>
            <ol className="grid gap-3">
              {ANATOMY.map((a) => (
                <li key={a.n} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--b-accent)] font-mono text-sm text-[var(--b-accent)]">
                    {a.n}
                  </span>
                  <p className="text-base text-[var(--b-muted)]">
                    <strong className="font-semibold text-[var(--b-fg)]">{a.title}.</strong> {a.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </GlowCard>

        <GlowCard>
          <SubHead aside={<Badge tone="neutral">Rule</Badge>}>Departments swap the word</SubHead>
          <ul className="grid grid-cols-5 gap-2 sm:gap-3">
            {SHARED_FRAME.map((id) => (
              <li key={id} className="overflow-hidden rounded-[var(--b-radius)] bg-black">
                <LogoImg id={`${id}-primary-dark`} alt={altFor(id)} sizes="(min-width: 1024px) 8vw, 18vw" />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base text-[var(--b-muted)]">
            Ventures, Media, Academy, Club and Labs share one frame, one gn and one gradient. Mazal and GN Commune are departments too and
            carry their own artwork: Mazal leads with the M, Commune with its line illustration. Their chapters in Part II cover both.
          </p>
        </GlowCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlowCard>
          <SubHead aside={<Badge tone="danger">Never</Badge>}>Custom lettering</SubHead>
          <p className="text-base text-[var(--b-muted)]">
            The lettering is artwork, not a font. Never retype a logo in live text and never rebuild it. Always place the supplied file at its
            native proportions. If a file is missing, request it from the owner instead of improvising.
          </p>
        </GlowCard>
        <GlowCard>
          <SubHead aside={<Badge tone="cyan">Alt text</Badge>}>Alt text pattern</SubHead>
          <p className="text-base text-[var(--b-muted)]">Write the brand name followed by the word logo. Keep it plain, with no slogan.</p>
          <ul className="mt-3 flex flex-wrap gap-2 font-mono text-sm">
            {VIEWER_ORDER.map((id) => (
              <li key={id} className="rounded-full border border-[var(--b-border)] px-3 py-1 text-[var(--b-fg)]">
                {altFor(id)}
              </li>
            ))}
          </ul>
        </GlowCard>
      </div>

      <div>
        <SubHead>Inspect the family in 3D</SubHead>
        <p className="mb-4 max-w-prose text-base text-[var(--b-muted)]">
          Drag to rotate. Pick any of the seven logos: the ventures lockup and the six departments. Arrow keys rotate, Home resets.
        </p>
        <div className="gn-glass overflow-hidden p-3 md:p-5" data-sfx="open">
          <LazyLogoViewer3D items={items} />
        </div>
      </div>
    </SectionShell>
  );
}
