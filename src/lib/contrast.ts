import type { Swatch } from "@/content/types";

/**
 * Pure WCAG 2.x contrast helpers.
 * Self-check (known values): contrastRatio("#000000", "#ffffff") === 21;
 * contrastRatio("#777777", "#ffffff") is about 4.48 (just under AA for body text).
 */

export type Rgb = readonly [number, number, number];

export function parseHex(hex: string): Rgb | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb: Rgb): number {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

/** WCAG contrast ratio between two hex colors, 1 to 21. Returns null if either is unparseable. */
export function contrastRatio(fgHex: string, bgHex: string): number | null {
  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);
  if (!fg || !bg) return null;
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export type WcagGrade = "AAA" | "AA" | "AA Large" | "Fail";

export function wcagGrade(ratio: number): WcagGrade {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

const to255 = (v: number): number => Math.round(Math.min(1, Math.max(0, v)) * 255);
const gamma = (v: number): number => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);

/** Convert oklch(L C h) to an sRGB hex (gamut-clipped). Returns null if the string is not oklch(). */
export function oklchToHex(css: string): string | null {
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/i.exec(css.trim());
  if (!m) return null;
  const L = parseFloat(m[1]);
  const C = parseFloat(m[2]);
  const h = (parseFloat(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const mm = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  const r = 4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s;
  const hex = [r, g, bl].map((v) => to255(gamma(v)).toString(16).padStart(2, "0")).join("");
  return `#${hex.toUpperCase()}`;
}

/** Best opaque hex for a swatch: its hex, else its oklch() css converted. Null for gradients and alpha colors. */
export function swatchHex(swatch: Pick<Swatch, "hex" | "css">): string | null {
  if (swatch.hex && parseHex(swatch.hex)) return swatch.hex;
  if (swatch.css) return oklchToHex(swatch.css);
  return null;
}

export interface ContrastRow {
  readonly fg: Swatch;
  readonly bg: Swatch;
  readonly fgHex: string;
  readonly bgHex: string;
  readonly ratio: number;
  readonly grade: WcagGrade;
}

/** Every foreground against every background, skipping swatches that have no opaque color. */
export function contrastRows(fgs: readonly Swatch[], bgs: readonly Swatch[]): readonly ContrastRow[] {
  const rows: ContrastRow[] = [];
  for (const bg of bgs) {
    const bgHex = swatchHex(bg);
    if (!bgHex) continue;
    for (const fg of fgs) {
      const fgHex = swatchHex(fg);
      if (!fgHex) continue;
      const ratio = contrastRatio(fgHex, bgHex);
      if (ratio === null) continue;
      rows.push({ fg, bg, fgHex, bgHex, ratio, grade: wcagGrade(ratio) });
    }
  }
  return rows;
}
