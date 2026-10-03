import { FONTS_MANIFEST, type FontManifestEntry } from "./fonts-manifest";

/** Thin typed view over the fonts manifest, with derived strings for the Fonts section. */
export interface FontView {
  readonly entry: FontManifestEntry;
  /** Private @font-face family name used by the live specimen. */
  readonly specimenFamily: string;
  /** Identifier exported by next/font/google, for example Josefin_Sans. */
  readonly nextFontId: string;
  readonly cssVar: string;
  readonly snippet: string;
  readonly totalBytes: number;
  /** Specimen is shown in caps (Josefin headings are caps via CSS). */
  readonly caps: boolean;
}

const KB = 1024;

export function formatBytes(bytes: number): string {
  if (bytes < KB) return `${bytes} B`;
  if (bytes < KB * KB) return `${(bytes / KB).toFixed(1)} KB`;
  return `${(bytes / (KB * KB)).toFixed(2)} MB`;
}

function buildSnippet(entry: FontManifestEntry, nextFontId: string, cssVar: string): string {
  const weights = entry.weights.map((w) => `"${w}"`).join(", ");
  return [
    `import { ${nextFontId} } from "next/font/google";`,
    "",
    `const ${entry.slug.replace(/-(\w)/g, (_m, c: string) => c.toUpperCase())} = ${nextFontId}({`,
    `  subsets: ["latin"],`,
    `  weight: [${weights}],`,
    `  display: "swap",`,
    `  variable: "${cssVar}",`,
    `});`,
  ].join("\n");
}

function toView(entry: FontManifestEntry): FontView {
  const nextFontId = entry.family.replace(/\s+/g, "_");
  const cssVar = `--font-${entry.slug}`;
  return {
    entry,
    specimenFamily: `GN Specimen ${entry.family}`,
    nextFontId,
    cssVar,
    snippet: buildSnippet(entry, nextFontId, cssVar),
    totalBytes: entry.files.reduce((sum, f) => sum + f.bytes, 0),
    caps: entry.slug === "josefin-sans",
  };
}

export const FONT_VIEWS: readonly FontView[] = FONTS_MANIFEST.map(toView);

/** @font-face rules so the specimen renders from the shipped woff2 files. */
export function specimenFontFaceCss(views: readonly FontView[] = FONT_VIEWS): string {
  return views
    .flatMap((v) =>
      v.entry.files.map(
        (f) =>
          `@font-face{font-family:"${v.specimenFamily}";font-weight:${f.weight};font-style:normal;font-display:swap;src:url("${f.file}") format("woff2");}`,
      ),
    )
    .join("\n");
}

/** No zip is published, so there is no bulk font download. Flip only when a real file exists. */
export const FONTS_ZIP: { readonly href: string; readonly bytes: number } | null = null;
