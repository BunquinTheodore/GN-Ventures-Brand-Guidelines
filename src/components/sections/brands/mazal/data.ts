/**
 * Mazal chapter data. Facts come from docs/BRAND-SPEC.md section 2 and src/content/brands.ts.
 * Anything not in the spec is labeled Proposed where it is rendered.
 */

export const MARK_POINTS =
  "0,0 183,0 313,380 441,0 626,0 626,214 581,214 581,330 626,330 626,577 0,577 0,330 44,330 44,214 0,214";
export const MARK_W = 626;
export const MARK_H = 577;

export const LIME = "#C0F030";
export const NAVY = "#04070C";
export const NAVY_2 = "#05090F";
export const BLUE = "#0128A9";
export const MUTED = "#8F94A8";
export const STOP_RED = "#FF5959";

/** Locked call to action. Never reworded. */
export const LOCKED_CTA = "Comment MAZAL to learn more";

export interface CompareRow {
  readonly aspect: string;
  readonly web: string;
  readonly social: string;
}

export const CHANNEL_ROWS: readonly CompareRow[] = [
  { aspect: "Surface", web: "Glass cards over black, card fill rgba(14,18,32,0.72)", social: "Flat shapes on the midnight plate. Zero glow" },
  { aspect: "Depth", web: "Blur 26px, saturate 170%, shine sweep", social: "No blur, no glow, no shadow tricks" },
  { aspect: "Type", web: "Josefin Sans 300, Manrope, Poppins", social: "Archivo only: 900, 800, 700" },
  { aspect: "Background", web: "#000, navy #0E1220, ink #020615", social: "Deep Midnight Navy #04070C to #05090F" },
  { aspect: "Electric Blue", web: "#0128A9 as a secondary color", social: "Ambient light only, never text" },
  { aspect: "Buttons", web: "Pill, 999px radius, 15px uppercase Poppins, 0.05em", social: "Archivo 800 pills and CTAs, flat lime" },
  { aspect: "Formats", web: "joinmazal.org", social: "Feed 2048 x 2048 JPEG, story 1080 x 1920" },
];

export interface PlateLayer {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly style: Readonly<Record<string, string>>;
  readonly opacity?: number;
}

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** The social kit background plate, bottom layer first. */
export const PLATE_LAYERS: readonly PlateLayer[] = [
  { id: "base", label: "Navy diagonal", detail: "135 degree gradient, #04070C to #05090F", style: { background: `linear-gradient(135deg, ${NAVY}, ${NAVY_2})` } },
  { id: "lime", label: "Lime light", detail: "Off-canvas, top left", style: { background: `radial-gradient(60% 50% at 0% 0%, color-mix(in srgb, ${LIME} 22%, transparent), transparent 70%)` } },
  { id: "blue", label: "Blue light", detail: "Off-canvas, bottom right. Ambient only", style: { background: `radial-gradient(60% 50% at 100% 100%, color-mix(in srgb, ${BLUE} 38%, transparent), transparent 70%)` } },
  { id: "dots", label: "Halftone dots", detail: "16px pitch", style: { background: "radial-gradient(color-mix(in srgb, #fff 8%, transparent) 1px, transparent 1.4px) 0 0 / 16px 16px" } },
  { id: "grid", label: "Grid", detail: "100px cells", style: { background: "linear-gradient(color-mix(in srgb, #fff 4%, transparent) 1px, transparent 1px) 0 0 / 100px 100px, linear-gradient(90deg, color-mix(in srgb, #fff 4%, transparent) 1px, transparent 1px) 0 0 / 100px 100px" } },
  { id: "grain", label: "Film grain", detail: "Fine noise over everything", style: { backgroundImage: GRAIN, backgroundSize: "160px 160px" }, opacity: 0.07 },
  { id: "vignette", label: "Vignette", detail: "Edges darken toward the corners", style: { background: "radial-gradient(120% 120% at 50% 50%, transparent 55%, color-mix(in srgb, #000 55%, transparent) 100%)" } },
];

export interface MaziPose {
  readonly name: string;
  readonly pairing: string;
}

/** Pose names are from the kit. The pairings are Proposed, the kit does not assign them. */
export const MAZI_POSES: readonly MaziPose[] = [
  { name: "Analyzing", pairing: "Chart breakdowns and trade reasoning" },
  { name: "Sunglasses", pairing: "Community moments and wins shared as a group" },
  { name: "Risk Managed", pairing: "Posts that lead with the stop and the R:R" },
  { name: "Breaking News", pairing: "Market news and event announcements" },
];

export const BANNED_WORDS: readonly string[] = [
  "Guaranteed profit",
  "Risk-free",
  "Easy money",
  "Signals",
  "Hype language",
  "Unconfirmed partner names",
];

export const TRADE_REQUIRED: readonly string[] = ["Entry", "Stop", "Target", "R:R"];

export const MARK_SIZES: readonly number[] = [96, 64, 48, 32, 24, 16];
/** Proposed. The brand kit gives no minimum size. 16px matches the smallest favicon size shipped. */
export const MARK_MIN_PX = 16;
