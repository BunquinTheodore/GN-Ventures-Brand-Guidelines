import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { AssetBg, AssetKind, BrandAsset } from "@/content/asset-types";
import { assetsFor } from "@/content/assets";
import { BRANDS } from "@/content/brands";
import type { Brand, BrandId } from "@/content/types";
import { GlowCard } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Shared contract for every chapter part. A part receives the brand id and reads
 * src/content/brands.ts and assets.ts itself, so a chapter can render any part
 * on its own, replace it, or extend it.
 */
export interface ChapterPartProps {
  readonly brand: BrandId;
  /** Glass cards on or off. Defaults to on for every brand except Commune (sketchbook). */
  readonly glass?: boolean;
  readonly className?: string;
}

export type ChapterPartKey =
  | "essence"
  | "logo"
  | "color"
  | "type"
  | "voice"
  | "components"
  | "imagery"
  | "applications"
  | "downloads";

export const PART_ORDER: readonly ChapterPartKey[] = [
  "essence",
  "logo",
  "color",
  "type",
  "voice",
  "components",
  "imagery",
  "applications",
  "downloads",
];

export const PART_LABELS: Readonly<Record<ChapterPartKey, string>> = {
  essence: "Essence",
  logo: "Logo",
  color: "Color",
  type: "Type",
  voice: "Voice",
  components: "Components",
  imagery: "Imagery",
  applications: "Applications",
  downloads: "Downloads",
};

/** Deep link id for a chapter sub-section, for example "media-logo". */
export function partId(brand: BrandId, part: ChapterPartKey): string {
  return `${brand}-${part}`;
}

export function resolveGlass(brand: BrandId, glass?: boolean): boolean {
  return glass ?? brand !== "commune";
}

export function brandOf(id: BrandId): Brand {
  return BRANDS[id];
}

/** Tailwind classes that apply the active brand's display type treatment. */
export const DISPLAY_CLS =
  "[font-family:var(--b-font-display)] [font-weight:var(--b-title-weight)] [text-transform:var(--b-title-transform)] [letter-spacing:var(--b-title-tracking)] leading-[1.08]";

export const UI_FONT_CLS = "[font-family:var(--b-font-ui)]";

/* ------------------------------------------------------------------ assets */

const RASTER = new Set(["png", "jpg", "webp"]);

export function rasterAssets(brand: BrandId, kind: AssetKind): readonly BrandAsset[] {
  return assetsFor(brand).filter((a) => a.kind === kind && RASTER.has(a.format));
}

function findRaster(brand: BrandId, kind: AssetKind, bg?: AssetBg): BrandAsset | undefined {
  return rasterAssets(brand, kind).find((a) => bg === undefined || a.bg === bg);
}

export type LogoMode = "dark" | "light" | "ink";

/** Best raster logo for a surface: dark (light logo on dark), light (dark logo on light), ink (pure dark silhouette). */
export function logoFor(brand: BrandId, mode: LogoMode): BrandAsset | undefined {
  if (mode === "ink") return findRaster(brand, "mono-ink") ?? findRaster(brand, "on-light");
  if (mode === "light") return findRaster(brand, "on-light") ?? findRaster(brand, "mono-ink");
  if (brand === "mazal") return findRaster(brand, "mark") ?? findRaster(brand, "primary");
  if (brand === "commune") return findRaster(brand, "mono-white") ?? findRaster(brand, "primary", "dark");
  return (
    findRaster(brand, "primary", "transparent") ??
    findRaster(brand, "primary", "dark") ??
    findRaster(brand, "mono-white")
  );
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function dimensions(a: BrandAsset): string {
  return a.width && a.height ? `${a.width} x ${a.height}` : "size TBC";
}

interface ImgProps {
  readonly asset: BrandAsset;
  readonly alt: string;
  readonly sizes?: string;
  readonly className?: string;
  readonly priority?: boolean;
}

/** next/image for a brand asset. SVG and ICO skip the optimizer. */
export function Img({ asset, alt, sizes = "(min-width: 1024px) 320px, 90vw", className, priority }: ImgProps) {
  const skip = asset.format === "svg" || asset.format === "ico";
  return (
    <Image
      src={asset.file}
      alt={alt}
      width={asset.width ?? 512}
      height={asset.height ?? 512}
      sizes={sizes}
      unoptimized={skip}
      priority={priority}
      className={className}
    />
  );
}

/* Brands whose chapter flips light and dark. The default theme is what renders without data-theme. */
const DEFAULT_THEME: Readonly<Partial<Record<BrandId, "light" | "dark">>> = {
  academy: "light",
  commune: "dark",
};

interface ThemedLogoProps {
  readonly brand: BrandId;
  readonly className?: string;
  readonly sizes?: string;
  /** Force one logo mode. Omit to follow the chapter theme. */
  readonly fixed?: LogoMode;
  readonly priority?: boolean;
}

/** Logo that follows the chapter theme (Academy and Commune) or stays fixed for one mode. */
export function ThemedLogo({ brand, className, sizes, fixed, priority }: ThemedLogoProps) {
  const name = BRANDS[brand].name;
  const alt = `${name} logo`;
  const dark = logoFor(brand, "dark");
  const light = logoFor(brand, "light");
  const cls = cn("h-full w-full object-contain", className);
  const one = (fixed ? logoFor(brand, fixed) : undefined) ?? dark ?? light;
  const base = DEFAULT_THEME[brand];
  if (fixed || !base || !dark || !light) {
    return one ? <Img asset={one} alt={alt} sizes={sizes} className={cls} priority={priority} /> : null;
  }
  const lightFirst = base === "light";
  const lightCls = lightFirst ? "block [[data-theme=dark]_&]:hidden" : "hidden [[data-theme=light]_&]:block";
  const darkCls = lightFirst ? "hidden [[data-theme=dark]_&]:block" : "block [[data-theme=light]_&]:hidden";
  return (
    <>
      <Img asset={light} alt={alt} sizes={sizes} className={cn(cls, lightCls)} priority={priority} />
      <Img asset={dark} alt="" sizes={sizes} className={cn(cls, darkCls)} />
    </>
  );
}

/* ------------------------------------------------------------------ layout */

interface PartFrameProps {
  readonly brand: BrandId;
  readonly part: ChapterPartKey;
  readonly title: string;
  readonly lead?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

/** Anchored sub-section frame. Renders id="<brand>-<part>" so deep links work. */
export function PartFrame({ brand, part, title, lead, children, className }: PartFrameProps) {
  const index = PART_ORDER.indexOf(part) + 1;
  return (
    <div id={partId(brand, part)} data-chapter-part={part} className={cn("scroll-mt-28 space-y-6", className)}>
      <header className="flex flex-col gap-3 border-b border-[var(--b-border)] pb-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div>
          <p className="gn-eyebrow mb-2">
            <span className="font-mono">{String(index).padStart(2, "0")}</span> / {PART_LABELS[part]}
          </p>
          <h3 className={cn("text-[1.75rem] md:text-[2.25rem]", DISPLAY_CLS)}>{title}</h3>
        </div>
        {lead ? <p className="max-w-xl text-base leading-relaxed text-[var(--b-muted)]">{lead}</p> : null}
      </header>
      {children}
    </div>
  );
}

interface CardProps {
  readonly brand: BrandId;
  readonly glass: boolean;
  readonly children: ReactNode;
  readonly className?: string;
  readonly zoom?: boolean;
  readonly style?: CSSProperties;
}

/** GlowCard when glass is on, a flat bordered card (ink sketchbook for Commune) when it is off. */
export function Card({ brand, glass, children, className, zoom, style }: CardProps) {
  if (glass) {
    return (
      <GlowCard className={className} zoom={zoom} style={style}>
        {children}
      </GlowCard>
    );
  }
  const ink = brand === "commune";
  return (
    <div
      style={style}
      className={cn(
        "rounded-[var(--b-radius)] bg-[var(--b-surface)] p-5 md:p-6",
        ink ? "border-2 border-[var(--b-fg)] shadow-[4px_4px_0_var(--b-fg)]" : "border border-[var(--b-border)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SubHeading({ children }: { readonly children: ReactNode }) {
  return (
    <h4 className="mb-3 font-ui text-sm font-semibold uppercase tracking-[0.12em] text-[var(--b-muted)]">{children}</h4>
  );
}

const CHECKER =
  "conic-gradient(rgba(128,128,128,0.22) 25%, transparent 0 50%, rgba(128,128,128,0.22) 0 75%, transparent 0) 0 0 / 14px 14px";

interface PreviewTileProps {
  readonly background: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly checker?: boolean;
  readonly label: string;
}

/** Plain preview surface. `label` is the accessible name of the group. */
export function PreviewTile({ background, children, className, checker, label }: PreviewTileProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex items-center justify-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)]", className)}
      style={{ background: checker ? `${CHECKER}, ${background}` : background }}
    >
      {children}
    </div>
  );
}

/** Preview background token for a light or dark logo. Commune stays strictly black and white. */
export function lightSurface(brand: BrandId): string {
  return brand === "commune" ? "#fff" : "var(--fog)";
}

export function darkSurface(brand: BrandId): string {
  return brand === "commune" ? "#000" : "var(--ink)";
}

export function groupSwatches(brand: Brand): readonly (readonly [string, Brand["swatches"]])[] {
  const order: string[] = [];
  brand.swatches.forEach((s) => {
    const g = s.group ?? "Colors";
    if (!order.includes(g)) order.push(g);
  });
  return order.map((g) => [g, brand.swatches.filter((s) => (s.group ?? "Colors") === g)] as const);
}
