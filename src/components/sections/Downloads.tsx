"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ASSETS, MISSING_ASSETS, VECTOR_STATUS } from "@/content/assets";
import type { AssetBg, AssetKind, BrandAsset } from "@/content/asset-types";
import { BRANDS, BRAND_ORDER } from "@/content/brands";
import { formatBytes } from "@/content/fonts";
import { FONTS_TOTAL_BYTES } from "@/content/fonts-manifest";
import { previewFor } from "@/content/previews";
import type { BrandId } from "@/content/types";
import { Badge, Button, DerivedTag, GlowCard, SectionShell } from "@/components/ui";
import { sfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";

const KIND_LABEL: Readonly<Record<AssetKind, string>> = {
  primary: "Primary",
  "on-light": "On light",
  "mono-white": "Mono white",
  "mono-ink": "Mono ink",
  horizontal: "Horizontal",
  square: "Square",
  mark: "Mark",
  "app-icon": "App icon",
  favicon: "Favicon",
  "apple-touch": "Apple touch",
  og: "Open Graph",
  mascot: "Mascot",
  cursor: "Cursor",
  doc: "Document",
  avatar: "Avatar",
  manifest: "Manifest icon",
  watermark: "Watermark",
} as Record<AssetKind, string>;

/** Kinds where a vector version is expected, so a missing SVG gets the placeholder state. */
const VECTOR_KINDS: ReadonlySet<AssetKind> = new Set<AssetKind>([
  "primary", "on-light", "mono-white", "mono-ink", "horizontal", "square", "mark",
]);

/** Black-ink transparent files need a light tile or they vanish on the dark checker. */
const LIGHT_CHECKER_STYLE: CSSProperties = {
  backgroundColor: "var(--fog)",
  backgroundImage:
    "conic-gradient(color-mix(in srgb, var(--deep) 12%, transparent) 25%, transparent 0 50%, color-mix(in srgb, var(--deep) 12%, transparent) 0 75%, transparent 0)",
  backgroundSize: "16px 16px",
};

const CHECKER_STYLE: CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--fog) 14%, var(--deep))",
  backgroundImage:
    "conic-gradient(color-mix(in srgb, var(--fog) 10%, transparent) 25%, transparent 0 50%, color-mix(in srgb, var(--fog) 10%, transparent) 0 75%, transparent 0)",
  backgroundSize: "16px 16px",
};

const PREVIEW_ORDER = ["png", "svg", "webp", "jpg", "ico", "pdf"] as const;

/** Cards rendered up front, and added per "Show more" click. Keeps the DOM small. */
const PAGE_SIZE = 24;

interface AssetGroup {
  readonly key: string;
  readonly brand: BrandId;
  readonly kind: AssetKind;
  readonly bg: AssetBg;
  readonly source: BrandAsset["source"];
  readonly files: readonly BrandAsset[];
  readonly preview: BrandAsset;
  readonly title: string;
  readonly needsVectorPlaceholder: boolean;
}

function pickPreview(files: readonly BrandAsset[]): BrandAsset {
  // A file with a small generated preview wins over one that would load at full size.
  const rank = (a: BrandAsset) => (previewFor(a.id) ? 0 : 10) + PREVIEW_ORDER.indexOf(a.format);
  return [...files].sort((a, b) => rank(a) - rank(b))[0] ?? files[0]!;
}

function buildGroups(assets: readonly BrandAsset[]): readonly AssetGroup[] {
  const map = new Map<string, BrandAsset[]>();
  for (const a of assets) {
    const key = `${a.brand}|${a.kind}|${a.bg}|${a.source}`;
    map.set(key, [...(map.get(key) ?? []), a]);
  }
  const svgBrandKinds = new Set(assets.filter((a) => a.format === "svg").map((a) => `${a.brand}|${a.kind}`));
  return [...map.entries()].map(([key, files]) => {
    const first = files[0]!;
    const preview = pickPreview(files);
    const formats = files.map((f) => f.format);
    const hasDuplicateFormat = new Set(formats).size !== formats.length;
    return {
      key,
      brand: first.brand,
      kind: first.kind,
      bg: first.bg,
      source: first.source,
      files,
      preview,
      title: hasDuplicateFormat ? `${BRANDS[first.brand].name} ${KIND_LABEL[first.kind].toLowerCase()}` : preview.label,
      needsVectorPlaceholder:
        VECTOR_KINDS.has(first.kind) && !svgBrandKinds.has(`${first.brand}|${first.kind}`) && first.format !== "svg",
    };
  });
}

function fileButtonLabel(file: BrandAsset, group: AssetGroup): string {
  const dup = group.files.filter((f) => f.format === file.format).length > 1;
  const base = file.format.toUpperCase();
  return dup && file.width ? `${base} ${file.width}` : base;
}

function inkOnTransparent(a: { readonly kind: string; readonly brand: string }): boolean {
  return a.kind === "mono-ink" || (a.brand === "commune" && a.kind === "square");
}

function PreviewBox({ group }: { readonly group: AssetGroup }) {
  const { preview } = group;
  const surface =
    group.bg === "dark"
      ? "bg-[var(--deep)]"
      : group.bg === "light"
        ? "bg-[var(--fog)]"
        : "";
  const small = previewFor(preview.id);
  const src = small?.src ?? preview.file;
  const w = small?.width ?? preview.width ?? 256;
  const h = small?.height ?? preview.height ?? 256;
  return (
    <div
      className={cn("flex h-44 items-center justify-center overflow-hidden rounded-lg border border-[var(--b-border)] p-3", surface)}
      style={group.bg === "transparent" ? (inkOnTransparent(preview) ? LIGHT_CHECKER_STYLE : CHECKER_STYLE) : undefined}
    >
      <Image
        src={src}
        alt={`${preview.label}, preview`}
        width={w}
        height={h}
        unoptimized
        loading="lazy"
        decoding="async"
        className="max-h-full w-auto max-w-full object-contain"
      />
    </div>
  );
}

function AssetCard({ group, index, headingId }: { readonly group: AssetGroup; readonly index: number; readonly headingId: string }) {
  const [open, setOpen] = useState(false);
  const { preview } = group;
  const vector = VECTOR_STATUS[group.brand];
  const dims = preview.width && preview.height ? `${preview.width} x ${preview.height}` : "size varies";
  const panelId = `prov-${group.key.replace(/\W+/g, "-")}`;

  return (
    <GlowCard as="article" zoom shineDelay={(index % 6) * 0.5} className="flex flex-col gap-4 !p-4">
      <PreviewBox group={group} />
      <div className="space-y-2">
        <h3 id={headingId} tabIndex={-1} className="font-sans text-base font-semibold normal-case leading-snug tracking-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]">{group.title}</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">{BRANDS[group.brand].name}</Badge>
          <DerivedTag kind={group.source} />
          <Badge tone="cyan">{KIND_LABEL[group.kind]}</Badge>
        </div>
        <p className="font-mono text-xs text-[var(--b-muted)]">
          {preview.format.toUpperCase()} · {dims} · {formatBytes(preview.bytes)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.files.map((f) => (
          <Button
            key={f.id}
            variant={f.format === "svg" ? "primary" : "secondary"}
            href={f.file}
            download
            aria-label={`Download ${f.label}, ${f.format.toUpperCase()}, ${formatBytes(f.bytes)}`}
            className="min-h-11 px-4 text-xs"
          >
            {fileButtonLabel(f, group)} · {formatBytes(f.bytes)}
          </Button>
        ))}
        {group.needsVectorPlaceholder ? (
          <span
            role="note"
            title={vector.note}
            className="inline-flex min-h-11 items-center rounded-full border border-dashed border-[var(--b-border)] px-4 font-ui text-xs text-[var(--b-muted)]"
          >
            SVG placeholder: original vector pending
          </span>
        ) : null}
      </div>

      <div className="mt-auto">
        <button
          type="button"
          data-sfx="toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            sfx.play("toggle");
            setOpen((v) => !v);
          }}
          className="min-h-11 font-ui text-xs font-medium uppercase tracking-[0.1em] text-[var(--b-accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]"
        >
          {open ? "Hide provenance" : "Show provenance"}
        </button>
        {open ? (
          <div id={panelId} className="mt-2 space-y-2 text-sm text-[var(--b-muted)]">
            {group.files.map((f) => (
              <p key={f.id}>
                <span className="font-mono text-xs text-[var(--b-fg)]">{f.file.split("/").pop()}</span>
                <br />
                {f.provenance}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </GlowCard>
  );
}

function Stat({ label, value, tone }: { readonly label: string; readonly value: number; readonly tone?: "accent" | "amber" }) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-3xl leading-none" style={tone ? { color: `var(--b-accent${tone === "amber" ? "-3" : ""})` } : undefined}>
        {value}
      </p>
      <p className="gn-eyebrow">{label}</p>
    </div>
  );
}

function SummaryStrip({ assets }: { readonly assets: readonly BrandAsset[] }) {
  const original = assets.filter((a) => a.source === "original").length;
  const derived = assets.length - original;
  const svgs = assets.filter((a) => a.format === "svg");
  const originalSvgs = svgs.filter((a) => a.source === "original").length;
  return (
    <GlowCard className="grid grid-cols-2 gap-6 md:grid-cols-5">
      <Stat label="Files in pack" value={assets.length} />
      <Stat label="Original" value={original} tone="accent" />
      <Stat label="Derived" value={derived} tone="amber" />
      <Stat label="SVG files" value={svgs.length} />
      <Stat label="Original SVG" value={originalSvgs} tone="accent" />
      <p className="col-span-2 text-sm text-[var(--b-muted)] md:col-span-5">
        Derived files were generated or traced from the original rasters and are not official artwork. Original vectors
        exist only for the Mazal M mark; every other SVG is a trace.
      </p>
    </GlowCard>
  );
}

function FilterChip({ active, onClick, children, count }: { readonly active: boolean; readonly onClick: () => void; readonly children: string; readonly count: number }) {
  return (
    <button
      type="button"
      data-sfx="nav"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-4 font-ui text-xs font-medium uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]",
        active
          ? "border-[var(--b-accent)] bg-[color-mix(in_srgb,var(--b-accent)_20%,transparent)] text-[var(--b-accent)]"
          : "border-[var(--b-border)] text-[var(--b-muted)] hover:border-[var(--b-accent)] hover:text-[var(--b-fg)]",
      )}
    >
      {children} <span className="font-mono opacity-70">{count}</span>
    </button>
  );
}

function MissingNote() {
  const missing = MISSING_ASSETS;
  return (
    <GlowCard className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl">Missing and pending assets</h3>
        <Badge tone="amber">{missing.length} open</Badge>
      </div>
      <p className="text-sm text-[var(--b-muted)] md:text-base">
        These files were expected but are not in the pack. They are tracked as open items, see{" "}
        <a href="#family" data-sfx="nav" className="text-[var(--b-accent)] underline underline-offset-4">
          Decisions needed in The family
        </a>
        . The MAZAL_Brand_Kit.pdf is not bundled yet, and no per-department zip archives are published, so every file is
        a separate download.
      </p>
      <ul className="grid gap-x-8 gap-y-2 text-sm md:grid-cols-2">
        {missing.map((m) => (
          <li key={`${m.brand}-${m.name}`}>
            <span className="font-medium">{BRANDS[m.brand].name}: {m.name}.</span>{" "}
            <span className="text-[var(--b-muted)]">{m.reason}</span>
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}

function FontsPackNote() {
  return (
    <GlowCard className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-[var(--b-muted)] md:text-base">
        Fonts pack: all woff2 files and OFL licenses ({formatBytes(FONTS_TOTAL_BYTES)} of woff2), available per file.
      </p>
      <Button variant="outline" href="#fonts" data-sfx="nav" className="min-h-11 px-5 text-xs">
        Go to Fonts
      </Button>
    </GlowCard>
  );
}

export default function Downloads() {
  const [brand, setBrand] = useState<BrandId | "all">("all");
  const [kind, setKind] = useState<AssetKind | "all">("all");

  const byBrand = useMemo(() => ASSETS.filter((a) => brand === "all" || a.brand === brand), [brand]);
  const kinds = useMemo(() => [...new Set(byBrand.map((a) => a.kind))], [byBrand]);
  const activeKind = kind !== "all" && !kinds.includes(kind) ? "all" : kind;
  const visible = useMemo(() => byBrand.filter((a) => activeKind === "all" || a.kind === activeKind), [byBrand, activeKind]);
  const groups = useMemo(() => buildGroups(visible), [visible]);

  // Reveal count is tied to the active filter, so changing a filter starts again at one page.
  const filterKey = `${brand}|${activeKind}`;
  const [reveal, setReveal] = useState({ key: filterKey, count: PAGE_SIZE });
  const shown = Math.min(reveal.key === filterKey ? reveal.count : PAGE_SIZE, groups.length);
  const focusIndex = useRef<number | null>(null);
  const remaining = groups.length - shown;

  const showMore = () => {
    focusIndex.current = shown;
    setReveal({ key: filterKey, count: shown + PAGE_SIZE });
  };

  useEffect(() => {
    if (focusIndex.current === null) return;
    const target = document.getElementById(`dl-card-${focusIndex.current}`);
    focusIndex.current = null;
    target?.focus({ preventScroll: false });
  }, [shown]);

  return (
    <SectionShell
      id="downloads"
      num="30"
      eyebrow="Part III"
      title="Downloads"
      lead="The asset pack for GN Ventures and its six departments. Filter by department and file kind. Every file is tagged original or derived, and the provenance of each is one click away."
    >
      <SummaryStrip assets={ASSETS} />

      <div className="space-y-4">
        <div role="group" aria-label="Filter by department" className="flex flex-wrap gap-2">
          <FilterChip active={brand === "all"} count={ASSETS.length} onClick={() => setBrand("all")}>All</FilterChip>
          {BRAND_ORDER.map((id) => (
            <FilterChip key={id} active={brand === id} count={ASSETS.filter((a) => a.brand === id).length} onClick={() => setBrand(id)}>
              {id === "ventures" ? "Ventures" : BRANDS[id].name.replace(/^GN /, "")}
            </FilterChip>
          ))}
        </div>
        <div role="group" aria-label="Filter by file kind" className="flex flex-wrap gap-2">
          <FilterChip active={activeKind === "all"} count={byBrand.length} onClick={() => setKind("all")}>All kinds</FilterChip>
          {kinds.map((k) => (
            <FilterChip key={k} active={activeKind === k} count={byBrand.filter((a) => a.kind === k).length} onClick={() => setKind(k)}>
              {KIND_LABEL[k]}
            </FilterChip>
          ))}
        </div>
        <p role="status" className="text-sm text-[var(--b-muted)]">
          {shown < groups.length
            ? `Showing ${shown} of ${groups.length} cards, ${visible.length} files.`
            : `Showing ${groups.length} cards, ${visible.length} files.`}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {groups.slice(0, shown).map((g, i) => (
          <AssetCard key={g.key} group={g} index={i} headingId={`dl-card-${i}`} />
        ))}
      </div>
      {remaining > 0 ? (
        <div className="flex justify-center">
          <Button variant="outline" onClick={showMore} data-sfx="nav" className="min-h-11 px-6 text-xs">
            Show {Math.min(PAGE_SIZE, remaining)} more ({remaining} not shown)
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <MissingNote />
        <FontsPackNote />
      </div>
    </SectionShell>
  );
}
