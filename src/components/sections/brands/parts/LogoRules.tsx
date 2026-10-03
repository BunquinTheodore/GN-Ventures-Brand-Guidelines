import type { CSSProperties } from "react";
import { Badge, type BadgeTone } from "@/components/ui";
import { BRANDS } from "@/content/brands";
import type { BrandId } from "@/content/types";
import { PreviewTile, SubHeading, ThemedLogo, brandOf, type LogoMode } from "./shared";
import { cn } from "@/lib/utils";

/** Commune is strictly black and white, so its warnings stay neutral. */
const warnTone = (brand: BrandId): BadgeTone => (brand === "commune" ? "neutral" : "danger");

/* ------------------------------------------------------------- backgrounds */

interface BgTile {
  readonly label: string;
  readonly background: string;
  readonly mode: LogoMode;
}

function backgroundTiles(brand: BrandId): readonly BgTile[] {
  const gradient = BRANDS[brand].swatches.find((s) => s.name === "Brand gradient")?.css;
  const tiles: BgTile[] = [
    { label: "Brand background", background: "var(--b-bg)", mode: "dark" },
    { label: "Surface", background: "var(--b-surface)", mode: "dark" },
    { label: "Accent", background: "var(--b-accent)", mode: "ink" },
  ];
  if (gradient) tiles.push({ label: "Brand gradient", background: gradient, mode: "ink" });
  tiles.push({ label: "Light", background: brand === "commune" ? "#fff" : "var(--fog)", mode: "light" });
  return tiles;
}

export function LogoBackgrounds({ brand }: { readonly brand: BrandId }) {
  const tiles = backgroundTiles(brand);
  return (
    <div>
      <SubHeading>Approved backgrounds</SubHeading>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {tiles.map((t) => (
          <li key={t.label} className="flex flex-col gap-2">
            <PreviewTile label={`${t.label} background`} background={t.background} className="h-36 p-4">
              <div className="h-full w-full max-w-[9rem]">
                <ThemedLogo brand={brand} fixed={t.mode} sizes="144px" />
              </div>
            </PreviewTile>
            <span className="text-sm text-[var(--b-muted)]">{t.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------- clear space, minimum size */

const MIN_WIDTH_PX = 96;
const MIN_SAMPLES: readonly number[] = [192, 128, 96, 64];

export function LogoSpacing({ brand }: { readonly brand: BrandId }) {
  const official = brand === "mazal";
  const pad = official ? 80 : 40;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <SubHeading>Clear space</SubHeading>
        <PreviewTile label="Clear space diagram" background="var(--b-surface)" className="min-h-[18rem] p-6">
          <div
            className="relative border-2 border-dashed border-[var(--b-accent)]"
            style={{ padding: pad }}
          >
            <div className="h-40 w-40">
              <ThemedLogo brand={brand} sizes="160px" />
            </div>
            {(["left-1/2 top-2 -translate-x-1/2", "bottom-2 left-1/2 -translate-x-1/2", "left-2 top-1/2 -translate-y-1/2", "right-2 top-1/2 -translate-y-1/2"] as const).map((pos) => (
              <span key={pos} aria-hidden="true" className={cn("absolute font-mono text-sm text-[var(--b-accent)]", pos)}>x</span>
            ))}
          </div>
        </PreviewTile>
        <p className="mt-3 flex flex-wrap items-start gap-2 text-base leading-relaxed text-[var(--b-muted)]">
          {official ? <Badge tone="accent">Brand kit</Badge> : <Badge tone="amber">Proposed</Badge>}
          <span>
            {official
              ? "x is half the mark width, on every side. Keep it clear of text, edges and other marks."
              : "x is one quarter of the logo width, on every side. Keep it clear of text, edges and other marks."}
          </span>
        </p>
      </div>
      <div>
        <SubHeading>Minimum size</SubHeading>
        <PreviewTile label="Minimum size samples" background="var(--b-surface)" className="min-h-[18rem] flex-wrap items-end justify-center gap-6 p-6">
          {MIN_SAMPLES.map((w) => (
            <figure key={w} className="flex flex-col items-center gap-2">
              <div style={{ width: w, height: w }} className={w < MIN_WIDTH_PX ? "opacity-70" : undefined}>
                <ThemedLogo brand={brand} sizes={`${w}px`} />
              </div>
              <figcaption className="flex flex-col items-center gap-1 font-mono text-xs text-[var(--b-muted)]">
                {w} px
                {w < MIN_WIDTH_PX ? <Badge tone={warnTone(brand)}>Too small</Badge> : null}
              </figcaption>
            </figure>
          ))}
        </PreviewTile>
        <p className="mt-3 flex flex-wrap items-start gap-2 text-base leading-relaxed text-[var(--b-muted)]">
          <Badge tone="amber">Proposed</Badge>
          <span>
            Do not run the logo narrower than {MIN_WIDTH_PX} px on screen. Below that, switch to the square mark or app icon.
          </span>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ misuse */

interface Misuse {
  readonly label: string;
  readonly style: CSSProperties;
}

function misuseList(brand: BrandId): readonly Misuse[] {
  const recolor: Misuse =
    brand === "commune"
      ? { label: "Do not blur or soften the line work", style: { filter: "blur(2px)" } }
      : { label: "Do not recolor", style: { filter: "hue-rotate(150deg) saturate(2.2)" } };
  return [
    { label: "Do not stretch or squash", style: { transform: "scaleX(1.5)" } },
    { label: "Do not rotate", style: { transform: "rotate(-18deg)" } },
    recolor,
    { label: "Do not add glow, outline or shadow", style: { filter: "drop-shadow(0 0 10px var(--b-accent)) drop-shadow(0 0 2px var(--b-fg))" } },
    { label: "Do not lower the contrast", style: { opacity: 0.28 } },
    { label: "Do not crop", style: { transform: "scale(1.7) translate(18%, 12%)" } },
  ];
}

export function LogoMisuse({ brand }: { readonly brand: BrandId }) {
  const name = brandOf(brand).name;
  return (
    <div>
      <SubHeading>Misuse</SubHeading>
      <p className="mb-4 max-w-3xl text-base leading-relaxed text-[var(--b-muted)]">
        Never recolor, outline, glow, stretch or redraw the {name} logo. These are the six most common mistakes.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {misuseList(brand).map((m) => (
          <li key={m.label} className="flex flex-col gap-2">
            <PreviewTile label={m.label} background="var(--b-surface)" className="relative h-40 p-4">
              <div className="h-full w-full max-w-[8rem]" style={m.style}>
                <ThemedLogo brand={brand} sizes="128px" />
              </div>
              <span aria-hidden="true" className={cn("absolute inset-x-0 top-1/2 h-0.5 -rotate-12", brand === "commune" ? "bg-[var(--b-fg)]" : "bg-[var(--b-danger)]/70")} />
            </PreviewTile>
            <div className="flex items-start gap-2 text-sm text-[var(--b-fg)]">
              <Badge tone={warnTone(brand)} className="shrink-0">No</Badge>
              <span>{m.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
