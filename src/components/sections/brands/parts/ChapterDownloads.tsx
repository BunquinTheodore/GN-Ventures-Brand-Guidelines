import { Badge, Button, DerivedTag } from "@/components/ui";
import type { BrandAsset } from "@/content/asset-types";
import { MISSING_ASSETS, VECTOR_STATUS, assetsFor } from "@/content/assets";
import { PartFrame, SubHeading, brandOf, dimensions, formatBytes, type ChapterPartProps } from "./shared";

const PREVIEWABLE = new Set(["png", "jpg", "webp", "svg"]);
const THUMB_PX = 48;

function Thumb({ asset }: { readonly asset: BrandAsset }) {
  if (!PREVIEWABLE.has(asset.format)) {
    return (
      <span className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--b-border)] font-mono text-[0.625rem] uppercase text-[var(--b-muted)]">
        {asset.format}
      </span>
    );
  }
  return (
    // Static brand files already sized for the web. A plain img keeps the table light.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.file}
      alt=""
      width={THUMB_PX}
      height={THUMB_PX}
      loading="lazy"
      decoding="async"
      className="h-12 w-12 rounded-md border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-fg)_8%,transparent)] object-contain"
    />
  );
}

function fileName(asset: BrandAsset): string {
  return asset.file.split("/").pop() ?? asset.file;
}

/** Downloads: every file registered for this brand, tagged original or derived, with provenance. */
export default function ChapterDownloads({ brand: id, className }: ChapterPartProps) {
  const brand = brandOf(id);
  const assets = assetsFor(id);
  const missing = MISSING_ASSETS.filter((m) => m.brand === id);
  const vector = VECTOR_STATUS[id];
  const originals = assets.filter((a) => a.source === "original").length;
  return (
    <PartFrame
      brand={id}
      part="downloads"
      title="Downloads"
      lead={`${assets.length} files for ${brand.name}: ${originals} original, ${assets.length - originals} derived. Derived files are never official.`}
      className={className}
    >
      <p className="flex flex-wrap items-start gap-2 text-base leading-relaxed text-[var(--b-muted)]">
        <Badge tone={vector.status === "original" ? "accent" : "amber"}>{vector.status === "original" ? "Vectors original" : "Vectors traced"}</Badge>
        <span>{vector.note}</span>
      </p>
      <div className="overflow-x-auto rounded-[var(--b-radius)] border border-[var(--b-border)]">
        <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
          <caption className="sr-only">{brand.name} downloadable files</caption>
          <thead>
            <tr className="border-b border-[var(--b-border)] font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">
              <th scope="col" className="p-3 font-medium">Preview</th>
              <th scope="col" className="p-3 font-medium">File</th>
              <th scope="col" className="p-3 font-medium">Format</th>
              <th scope="col" className="p-3 font-medium">Size</th>
              <th scope="col" className="p-3 font-medium">Source</th>
              <th scope="col" className="p-3 font-medium"><span className="sr-only">Download</span></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id} className="border-b border-[var(--b-border)] align-middle last:border-0">
                <td className="p-3"><Thumb asset={a} /></td>
                <td className="p-3">
                  <span className="block text-[var(--b-fg)]">{a.label}</span>
                  <span className="block font-mono text-xs text-[var(--b-muted)]" title={a.provenance}>{fileName(a)}</span>
                </td>
                <td className="p-3 font-mono text-xs text-[var(--b-muted)]">{a.format.toUpperCase()}<br />{dimensions(a)}</td>
                <td className="p-3 font-mono text-xs text-[var(--b-muted)]">{formatBytes(a.bytes)}</td>
                <td className="p-3"><DerivedTag kind={a.source} note={a.provenance} /></td>
                <td className="p-3 text-right">
                  <Button variant="outline" href={a.file} download={fileName(a)} aria-label={`Download ${a.label}`} className="min-h-11 px-4 text-xs">
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {missing.length > 0 ? (
        <div>
          <SubHeading>Not collected yet</SubHeading>
          <ul className="grid gap-3 md:grid-cols-2">
            {missing.map((m) => (
              <li key={m.name} className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-4 text-[0.9375rem] leading-relaxed">
                <span className="block text-[var(--b-fg)]">{m.name}</span>
                <span className="text-[var(--b-muted)]">{m.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </PartFrame>
  );
}
