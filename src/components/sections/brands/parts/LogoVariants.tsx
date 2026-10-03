import { DerivedTag } from "@/components/ui";
import type { AssetKind, BrandAsset } from "@/content/asset-types";
import { VECTOR_STATUS } from "@/content/assets";
import type { BrandId } from "@/content/types";
import {
  Img,
  PreviewTile,
  SubHeading,
  ThemedLogo,
  brandOf,
  darkSurface,
  dimensions,
  lightSurface,
  rasterAssets,
} from "./shared";

const VARIANT_KINDS: readonly AssetKind[] = ["primary", "on-light", "mono-white", "mono-ink", "horizontal", "square", "mark"];

/** Raster logo files shown on the page, one tile per distinct file. */
export function variantAssets(brand: BrandId): readonly BrandAsset[] {
  const seen = new Set<string>();
  return VARIANT_KINDS.flatMap((k) => rasterAssets(brand, k)).filter((a) => {
    if (seen.has(a.file) || a.format === "webp") return false;
    seen.add(a.file);
    return true;
  });
}

function previewIsLight(a: BrandAsset): boolean {
  return a.bg === "light" || a.kind === "on-light" || a.kind === "mono-ink";
}

export function LogoHero({ brand }: { readonly brand: BrandId }) {
  return (
    <PreviewTile
      label={`${brandOf(brand).name} primary logo`}
      background="var(--b-surface)"
      className="min-h-[18rem] p-6 sm:p-10"
    >
      <div className="h-56 w-full max-w-[22rem] sm:h-72">
        <ThemedLogo brand={brand} sizes="(min-width: 640px) 352px, 80vw" />
      </div>
    </PreviewTile>
  );
}

export function LogoVariantGrid({ brand }: { readonly brand: BrandId }) {
  const name = brandOf(brand).name;
  return (
    <div>
      <SubHeading>Variants</SubHeading>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {variantAssets(brand).map((a) => (
          <li key={a.file} className="flex flex-col gap-3">
            <PreviewTile
              label={a.label}
              background={previewIsLight(a) ? lightSurface(brand) : darkSurface(brand)}
              className="h-44 p-4"
              checker={a.bg === "transparent"}
            >
              <Img asset={a} alt={`${name}, ${a.label}`} sizes="(min-width: 1280px) 260px, 45vw" className="h-full w-full object-contain" />
            </PreviewTile>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-[var(--b-fg)]">{a.label}</span>
              <DerivedTag kind={a.source} note={a.provenance} />
            </div>
            <span className="font-mono text-xs text-[var(--b-muted)]">
              {a.format.toUpperCase()} / {dimensions(a)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LogoProvenance({ brand }: { readonly brand: BrandId }) {
  const rows = variantAssets(brand);
  const vector = VECTOR_STATUS[brand];
  return (
    <div>
      <SubHeading>Original versus derived</SubHeading>
      <p className="mb-4 max-w-3xl text-base leading-relaxed text-[var(--b-muted)]">
        Files tagged Original came from the owner or the live site. Derived files were generated for this guide from an original
        (background removed, recolored, cropped or traced) and are never official. {vector.note}
      </p>
      <div className="overflow-x-auto rounded-[var(--b-radius)] border border-[var(--b-border)]">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--b-border)] font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">
              <th scope="col" className="p-3 font-medium">File</th>
              <th scope="col" className="p-3 font-medium">Source</th>
              <th scope="col" className="p-3 font-medium">Provenance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.file} className="border-b border-[var(--b-border)] align-top last:border-0">
                <td className="p-3 text-[var(--b-fg)]">{a.label}</td>
                <td className="p-3"><DerivedTag kind={a.source} /></td>
                <td className="p-3 text-[var(--b-muted)]">{a.provenance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
