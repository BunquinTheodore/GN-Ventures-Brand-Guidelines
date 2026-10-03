import { oklchToHex } from "@/lib/contrast";

/** One theme's value of an Academy token: the exact CSS string plus a hex for display. */
export interface TokenSide {
  readonly css: string;
  /** Hex shown on screen. Approximate when `exact` is false (converted from oklch). */
  readonly hex: string;
  readonly exact: boolean;
}

export interface AcademyToken {
  readonly name: string;
  readonly role: string;
  /** Theme-specific values. Either side can be missing when the spec lists no value. */
  readonly light?: TokenSide;
  readonly dark?: TokenSide;
  /** One value for both themes (no per-theme override is documented). */
  readonly shared?: TokenSide;
}

function side(css: string): TokenSide {
  const converted = oklchToHex(css);
  return converted ? { css, hex: converted, exact: false } : { css, hex: css.toUpperCase(), exact: true };
}

export const OKLCH = {
  bgLight: "oklch(0.977 0.004 247)",
  fgLight: "oklch(0.22 0.012 250)",
  bgDark: "oklch(0.21 0.032 258)",
  cardDark: "oklch(0.26 0.035 258)",
  primaryLight: "oklch(0.52 0.145 122)",
  primaryDark: "oklch(0.86 0.19 122)",
  neon: "oklch(0.897 0.192 122)",
  brandFg: "oklch(0.18 0.012 250)",
  cyan: "oklch(0.748 0.135 220)",
  gold: "oklch(0.665 0.115 79)",
  destructive: "oklch(0.55 0.22 27)",
} as const;

/** Display hex for any token string. Falls back to the input when it is already hex. */
export function displayHex(css: string): string {
  return side(css).hex;
}

export const ACADEMY_TOKENS: readonly AcademyToken[] = [
  { name: "Background", role: "Page base", light: side(OKLCH.bgLight), dark: side(OKLCH.bgDark) },
  { name: "Foreground", role: "Body text. Dark value TBC", light: side(OKLCH.fgLight) },
  { name: "Card", role: "Card surface", light: side("#FFFFFF"), dark: side(OKLCH.cardDark) },
  { name: "Primary", role: "Deep lime on light, brighter lime on dark", light: side(OKLCH.primaryLight), dark: side(OKLCH.primaryDark) },
  { name: "Brand neon lime", role: "Brand accent. Always paired with brand-fg", shared: side(OKLCH.neon) },
  { name: "Brand fg", role: "Text on neon lime", shared: side(OKLCH.brandFg) },
  { name: "Brand cyan", role: "Secondary accent", shared: side(OKLCH.cyan) },
  { name: "Verified gold", role: "Verified credential ONLY", shared: side(OKLCH.gold) },
  { name: "Destructive", role: "Errors and destructive actions", shared: side(OKLCH.destructive) },
];

/** Raised type scale (px) against the Tailwind default it replaces, for comparison. */
export const RAISED_SCALE: readonly { readonly step: string; readonly academy: number; readonly tailwind: number | null }[] = [
  { step: "micro", academy: 12, tailwind: null },
  { step: "xs", academy: 13, tailwind: 12 },
  { step: "sm", academy: 15, tailwind: 14 },
  { step: "base", academy: 17, tailwind: 16 },
  { step: "lg", academy: 19, tailwind: 18 },
  { step: "xl", academy: 21, tailwind: 20 },
];
