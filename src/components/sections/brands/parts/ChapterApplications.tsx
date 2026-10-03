import { Button, DerivedTag } from "@/components/ui";
import type { AssetKind, BrandAsset } from "@/content/asset-types";
import { assetsFor } from "@/content/assets";
import type { BrandId } from "@/content/types";
import { cn } from "@/lib/utils";
import {
  DISPLAY_CLS,
  Img,
  PartFrame,
  SubHeading,
  ThemedLogo,
  UI_FONT_CLS,
  brandOf,
  dimensions,
  type ChapterPartProps,
} from "./shared";

const RASTER_OR_ICO = new Set(["png", "jpg", "webp", "ico"]);

function firstOf(brand: BrandId, kind: AssetKind): BrandAsset | undefined {
  return assetsFor(brand).find((a) => a.kind === kind && RASTER_OR_ICO.has(a.format) && a.format !== "webp");
}

function HeroMock({ brand }: { readonly brand: BrandId }) {
  const b = brandOf(brand);
  return (
    <figure className="overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)]" aria-label={`${b.name} website hero mock`}>
      <div className="flex items-center gap-3 border-b border-[var(--b-border)] bg-[var(--b-surface)] px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          {[0, 1, 2].map((i) => (<span key={i} className="h-2.5 w-2.5 rounded-full bg-[var(--b-border)]" />))}
        </span>
        <span className="min-w-0 truncate rounded-full border border-[var(--b-border)] px-3 py-0.5 font-mono text-xs text-[var(--b-muted)]">
          {b.domain ?? "domain TBC"}
        </span>
      </div>
      <div className="space-y-8 p-6 sm:p-10" style={{ background: "var(--b-bg)" }}>
        <div className="flex items-center justify-between gap-4">
          <span className="h-10 w-10"><ThemedLogo brand={brand} sizes="40px" /></span>
          <span className={cn("hidden gap-6 text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-[var(--b-fg)] sm:flex", UI_FONT_CLS)}>
            <span>Overview</span><span>Work</span><span>Contact</span>
          </span>
        </div>
        <div className="max-w-2xl space-y-5">
          <p className={cn("text-[clamp(2rem,5vw,3.5rem)] text-[var(--b-fg)]", DISPLAY_CLS)}>{b.tagline ?? b.name}</p>
          <p className="max-w-xl text-base leading-relaxed text-[var(--b-muted)]">{b.descriptor}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary action</Button>
            <Button variant="outline">Secondary</Button>
          </div>
        </div>
      </div>
    </figure>
  );
}

function OgMocks({ brand }: { readonly brand: BrandId }) {
  const name = brandOf(brand).name;
  const seen = new Set<string>();
  const ogs = assetsFor(brand).filter((a) => {
    if (a.kind !== "og" || a.format === "webp" || seen.has(a.file)) return false;
    seen.add(a.file);
    return true;
  });
  if (ogs.length === 0) return <p className="text-base text-[var(--b-muted)]">No Open Graph image yet. TBC.</p>;
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {ogs.map((a) => (
        <li key={a.id} className="flex flex-col gap-2">
          <Img asset={a} alt={`${name} social share image, ${a.label}`} sizes="(min-width: 768px) 45vw, 90vw" className="h-auto w-full rounded-[var(--b-radius)] border border-[var(--b-border)]" />
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--b-muted)]">
            <span>{a.label}</span>
            <DerivedTag kind={a.source} note={a.provenance} />
          </div>
        </li>
      ))}
    </ul>
  );
}

interface IconSlot {
  readonly kind: AssetKind;
  readonly title: string;
  readonly px: number;
  readonly shape: string;
}

const ICON_SLOTS: readonly IconSlot[] = [
  { kind: "app-icon", title: "App icon", px: 96, shape: "rounded-[22%]" },
  { kind: "apple-touch", title: "Apple touch", px: 80, shape: "rounded-[22%]" },
  { kind: "manifest", title: "Manifest", px: 64, shape: "rounded-[22%]" },
  { kind: "favicon", title: "Favicon", px: 32, shape: "rounded-sm" },
  { kind: "avatar", title: "Avatar", px: 96, shape: "rounded-full" },
];

function IconSet({ brand }: { readonly brand: BrandId }) {
  const name = brandOf(brand).name;
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {ICON_SLOTS.map((slot) => {
        const a = firstOf(brand, slot.kind);
        if (!a) return null;
        return (
          <li key={slot.kind} className="flex flex-col items-center gap-3 rounded-[var(--b-radius)] border border-[var(--b-border)] p-4">
            <div className="flex h-24 items-center">
              <div style={{ width: slot.px, height: slot.px }}>
                <Img asset={a} alt={`${name} ${slot.title}`} sizes={`${slot.px}px`} className={cn("h-full w-full object-cover", slot.shape)} />
              </div>
            </div>
            <span className="text-sm text-[var(--b-fg)]">{slot.title}</span>
            <span className="font-mono text-xs text-[var(--b-muted)]">{dimensions(a)}</span>
            <DerivedTag kind={a.source} note={a.provenance} />
          </li>
        );
      })}
    </ul>
  );
}

/** Applications: website hero mock, Open Graph images (real files) and the icon set. */
export default function ChapterApplications({ brand: id, className }: ChapterPartProps) {
  return (
    <PartFrame
      brand={id}
      part="applications"
      title="Applications"
      lead="The brand in use: a site hero, the image that shows when a link is shared, and the icon set."
      className={className}
    >
      <HeroMock brand={id} />
      <div>
        <SubHeading>Open Graph</SubHeading>
        <OgMocks brand={id} />
      </div>
      <div>
        <SubHeading>Icon set</SubHeading>
        <IconSet brand={id} />
      </div>
    </PartFrame>
  );
}
