import type { Brand, BrandId, FontSpec } from "./types";

/**
 * Brand facts for every department. Facts only, taken from docs/BRAND-SPEC.md.
 * Anything unconfirmed carries a flag string. Data is deeply readonly.
 */

const JOSEFIN: FontSpec = {
  family: "Josefin Sans",
  weights: "300",
  role: "h1 and h2 titles, caps via CSS, +0.04em tracking",
  googleName: "Josefin+Sans:wght@300",
  cssVar: "--font-josefin",
};
const MANROPE: FontSpec = {
  family: "Manrope",
  weights: "400 to 700",
  role: "Body copy",
  googleName: "Manrope",
  cssVar: "--font-manrope",
};
const POPPINS: FontSpec = {
  family: "Poppins",
  weights: "400, 500, 600",
  role: "UI: buttons, nav, labels, badges",
  googleName: "Poppins:wght@400;500;600",
  cssVar: "--font-poppins",
};
const GEIST_MONO: FontSpec = {
  family: "Geist Mono",
  weights: "400 to 600",
  role: "Numerals and tabular figures",
  googleName: "Geist+Mono",
  cssVar: "--font-geist-mono",
};

const VENTURES: Brand = {
  id: "ventures",
  name: "GN Ventures",
  descriptor:
    "The GN Ventures family of independent brands: Media, Academy, Club, Labs, Mazal and Commune.",
  status: "live",
  swatches: [
    { name: "Lime", hex: "#C6F24E", role: "Primary accent. Proposed canonical lime (GN Club's), needs owner sign-off", group: "Brand" },
    { name: "Cyan", hex: "#33C7E0", role: "Gradient start, logo frame left", group: "Brand" },
    { name: "Amber", hex: "#F2B84E", role: "Gradient end, logo frame right", group: "Brand" },
    { name: "Brand gradient", css: "linear-gradient(90deg, #33C7E0, #C6F24E, #F2B84E)", role: "Logo frame stroke, left to right: cyan, lime, amber", group: "Brand" },
    { name: "Ink", hex: "#08090A", role: "Page base", group: "Neutrals" },
    { name: "Raised", hex: "#111316", role: "Raised surfaces", group: "Neutrals" },
    { name: "Deep", hex: "#030404", role: "Deepest background, logo plate", group: "Neutrals" },
    { name: "Fog", hex: "#F3F4F0", role: "Primary text on ink", group: "Neutrals" },
    { name: "Fog dim", hex: "#9A9DA3", role: "Secondary text on ink", group: "Neutrals" },
    { name: "Glass", css: "rgba(255,255,255,0.06)", role: "Glass fill (strong 0.10)", group: "Glass" },
    { name: "Glass border", css: "rgba(255,255,255,0.14)", role: "Glass edge", group: "Glass" },
  ],
  fonts: [JOSEFIN, MANROPE, POPPINS, GEIST_MONO],
  voice: [
    "Proposed family voice: plain, practical, confident.",
    "Each department keeps its own voice. The umbrella stays quiet.",
    "No official umbrella tagline exists. None is invented here.",
  ],
  dos: [
    "Set the lime on near-black ink.",
    "Keep the gradient to the logo frame and thin edges.",
    "Swap only the word in the lockup for each department.",
    "Mark proposed values as Proposed until the owner signs off.",
  ],
  donts: [
    "Do not invent a tagline for the umbrella.",
    "Do not recolor the logo or redraw the frame.",
    "Do not present derived or traced logo files as official.",
    "Do not use dashes as sentence punctuation in copy.",
  ],
  ui: [
    { label: "Radius", value: "0.75rem (cards), 1rem (large panels)" },
    { label: "Glass", value: "6% white over ink, blur 20px, saturate 140%, 1px border at 14% white" },
    { label: "Shadow", value: "Tinted toward lime, never pure black" },
    { label: "Buttons", value: "Bright lime primary, glass secondary, outline" },
    { label: "Nav", value: "Uppercase, tracking 0.1em to 0.12em" },
  ],
  accent: "#C6F24E",
  accentRgb: [198, 242, 78],
  flags: [
    "No official umbrella palette, tagline or description exists. Values are derived from the sites.",
    "Canonical GN lime #C6F24E is a proposal and needs owner sign-off.",
    "Original vector logo files do not exist. Logos on this site are traced and labeled derived.",
  ],
};

const MEDIA: Brand = {
  id: "media",
  name: "GN Media",
  domain: "gnmedia.co",
  tagline: "News. Insights. Future.",
  descriptor:
    "Crypto, blockchain, tech and finance news, plus media distribution, KOL hiring, speaker booking, podcast, onsite media team and studio rental.",
  status: "live",
  swatches: [
    { name: "Lime", hex: "#B0E62F", role: "Accent", group: "Brand" },
    { name: "Accent fg", hex: "#0A0A0F", role: "Text on lime", group: "Brand" },
    { name: "Gradient start", hex: "#3ED6D6", role: "Gradient: cyan", group: "Brand" },
    { name: "Gradient end", hex: "#F2C14E", role: "Gradient: amber", group: "Brand" },
    { name: "Brand gradient", css: "linear-gradient(90deg, #3ED6D6, #B0E62F, #F2C14E)", role: "Cyan, lime, amber", group: "Brand" },
    { name: "Background", hex: "#0A0A0F", role: "Page base", group: "Neutrals" },
    { name: "Raised", hex: "#0D0D12", role: "Raised surfaces, glass source", group: "Neutrals" },
    { name: "Foreground", hex: "#F2F2F0", role: "Primary text", group: "Neutrals" },
    { name: "Muted", hex: "#8A8F98", role: "Secondary text", group: "Neutrals" },
    { name: "Border", css: "rgba(255,255,255,0.10)", role: "Hairlines (#ffffff1a)", group: "Neutrals" },
    { name: "Error", hex: "#F87171", role: "Error states", group: "Status" },
  ],
  fonts: [JOSEFIN, MANROPE, POPPINS],
  voice: [
    "News-wire. Punchy fragments with periods.",
    "Say \"Inquire for rates\". Never print prices.",
    "Short, factual, forward-looking.",
  ],
  dos: [
    "Write headlines as fragments that end in a period.",
    "Use \"Inquire for rates\" wherever a price would go.",
    "Keep Josefin Sans 300 caps for h1 and h2.",
  ],
  donts: [
    "Do not publish prices.",
    "Do not treat the otter mascot (Cash Captain) as part of the identity. Its brand link is unconfirmed.",
    "Do not use lime as a text color on light surfaces.",
  ],
  ui: [
    { label: "Glass", value: "Raised at 58% via color-mix, blur 22px, saturate 165%, 1px border" },
    { label: "Radius", value: "1rem" },
    { label: "Shadow", value: "Lime-tinted" },
    { label: "Type", value: "Josefin Sans 300 caps (h1, h2), Manrope body, Poppins UI" },
  ],
  accent: "#B0E62F",
  accentRgb: [176, 230, 47],
  flags: ["Mascot artwork (Cash Captain otter) is unconfirmed and not part of the identity."],
};

const ACADEMY: Brand = {
  id: "academy",
  name: "GN Academy",
  domain: "gnacademy.institute",
  tagline: "Learn. Prove. Get hired.",
  descriptor:
    "Certification and e-learning for Filipinos: a free AI Readiness Test and verified credentials.",
  status: "live",
  swatches: [
    { name: "Brand neon lime", hex: "#C8F048", css: "oklch(0.897 0.192 122)", role: "Brand accent. Always paired with brand-fg. Hex is approximate", group: "Brand" },
    { name: "Brand fg", css: "oklch(0.18 0.012 250)", role: "Text on neon lime", group: "Brand" },
    { name: "Primary (light)", css: "oklch(0.52 0.145 122)", role: "Deep lime, primary on light theme", group: "Brand" },
    { name: "Brand cyan", hex: "#08C0E8", css: "oklch(0.748 0.135 220)", role: "Secondary accent. Hex is approximate", group: "Brand" },
    { name: "Verified gold", css: "oklch(0.665 0.115 79)", role: "Verified credential ONLY", group: "Brand" },
    { name: "Background (light)", hex: "#F5F7FA", css: "oklch(0.977 0.004 247)", role: "Light page base. Hex is approximate", group: "Light" },
    { name: "Foreground (light)", css: "oklch(0.22 0.012 250)", role: "Text on light", group: "Light" },
    { name: "Card (light)", hex: "#FFFFFF", role: "Card surface on light", group: "Light" },
    { name: "Destructive", css: "oklch(0.55 0.22 27)", role: "Errors and destructive actions", group: "Status" },
    { name: "Background (dark)", css: "oklch(0.21 0.032 258)", role: "Dark page base", group: "Dark" },
    { name: "Card (dark)", css: "oklch(0.26 0.035 258)", role: "Dark card surface", group: "Dark" },
    { name: "Primary (dark)", css: "oklch(0.86 0.19 122)", role: "Primary on dark theme", group: "Dark" },
  ],
  fonts: [
    { ...JOSEFIN, role: "h1 and h2, Light caps, tracking 0.05em" },
    { ...MANROPE, role: "Body and h3 and below" },
    POPPINS,
    GEIST_MONO,
  ],
  voice: [
    "Plain, practical, trust and verification.",
    "\"Score it. Prove it. Get hired for it.\"",
    "Speak to Filipinos entering or moving up in work.",
  ],
  dos: [
    "Default to the light theme. Offer dark as the alternate.",
    "Use brand neon lime only with brand-fg on top.",
    "Keep gold exclusive to verified credentials.",
    "Use the raised type scale: xs 13, sm 15, base 17, lg 19, xl 21, micro 12 px.",
  ],
  donts: [
    "Do not use gold for anything except a verified credential.",
    "Do not promote the logo amber (#F8D028) to a UI token.",
    "Do not set neon lime text on white.",
  ],
  ui: [
    { label: "Radius", value: "0.5rem" },
    { label: "Type scale", value: "xs 13, sm 15, base 17, lg 19, xl 21, micro 12 px" },
    { label: "Themes", value: "Light default, dark alternate" },
    { label: "Type", value: "Josefin Sans Light caps (tracking 0.05em), Manrope, Poppins, Geist Mono" },
  ],
  accent: "#C8F048",
  accentRgb: [200, 240, 72],
  flags: ["Only light-first department. Hex values for oklch tokens are approximate."],
};

const CLUB: Brand = {
  id: "club",
  name: "GN Club",
  domain: "gnclubs.events",
  tagline: "Activations · Events · Full Production · Global Experience",
  descriptor:
    "Events and activations agency for tech and Web3 brands. Incubates Mazal.",
  status: "live",
  swatches: [
    { name: "Lime", hex: "#C6F24E", role: "Primary accent", group: "Brand" },
    { name: "Cyan", hex: "#33C7E0", role: "Gradient and secondary accent", group: "Brand" },
    { name: "Amber", hex: "#F2B84E", role: "Gradient end", group: "Brand" },
    { name: "Ink", hex: "#08090A", role: "Page base", group: "Neutrals" },
    { name: "Raised", hex: "#111316", role: "Raised surfaces", group: "Neutrals" },
    { name: "Deep", hex: "#030404", role: "Deepest background", group: "Neutrals" },
    { name: "Fog", hex: "#F3F4F0", role: "Primary text", group: "Neutrals" },
    { name: "Fog dim", hex: "#9A9DA3", role: "Secondary text", group: "Neutrals" },
    { name: "Glass", css: "rgba(255,255,255,0.06)", role: "Glass fill (strong 0.10)", group: "Glass" },
    { name: "Glass border", css: "rgba(255,255,255,0.14)", role: "Glass edge", group: "Glass" },
  ],
  fonts: [JOSEFIN, MANROPE, POPPINS],
  voice: [
    "Agency-confident, brand-partner oriented.",
    "Talk about the partner's launch, not the agency's history.",
  ],
  dos: [
    "Stay dark, lime and glass.",
    "Address brand partners directly.",
    "Use the full-color imagery treatment on dark ink.",
  ],
  donts: [
    "Do not quote the hero stats. They are unverified placeholders.",
    "Do not adopt the rejected mint, indigo and Instrument Sans redesign.",
    "Do not mix the two logo styles on one surface.",
  ],
  ui: [
    { label: "Radius", value: "0.75rem" },
    { label: "Glass", value: "Backdrop blur 20px, saturate 140%" },
    { label: "Cursor", value: "Mascot cursor PNG, 44px and 88px" },
  ],
  accent: "#C6F24E",
  accentRgb: [198, 242, 78],
  flags: [
    "Two logo styles exist. Which one is current needs owner confirmation.",
    "Hero stats on the live site are unverified placeholders and are ignored here.",
    "A GN Ventures Service Catalog PDF is referenced in GN Club notes but was not found.",
  ],
};

const LABS: Brand = {
  id: "labs",
  name: "GN Labs",
  tagline: "AI integration for business",
  descriptor:
    "Practical AI integrations and automations, consultation booking, a jobs board and a talent pool.",
  status: "dev",
  swatches: [
    { name: "Lime", hex: "#CAF14A", role: "Primary accent", group: "Brand" },
    { name: "Cyan", hex: "#17C9E2", role: "Gradient start", group: "Brand" },
    { name: "Amber", hex: "#F5DC2C", role: "Gradient end", group: "Brand" },
    { name: "Brand gradient", css: "linear-gradient(90deg, #17C9E2, #F5DC2C)", role: "90 degrees, cyan to amber", group: "Brand" },
    { name: "Ink", hex: "#050605", role: "Page base", group: "Neutrals" },
    { name: "Raised", hex: "#0E120D", role: "Raised surfaces", group: "Neutrals" },
    { name: "Deep", hex: "#010201", role: "Deepest background", group: "Neutrals" },
    { name: "Mist", hex: "#EEF3F5", role: "Primary text", group: "Neutrals" },
    { name: "Mist dim", hex: "#97A2A8", role: "Secondary text", group: "Neutrals" },
    { name: "Glass", css: "rgba(255,255,255,0.055)", role: "Glass fill (strong 0.095)", group: "Glass" },
    { name: "Glass border", css: "rgba(255,255,255,0.14)", role: "Glass edge (highlight 0.5)", group: "Glass" },
    { name: "Destructive", css: "oklch(0.65 0.22 25)", role: "Errors", group: "Status" },
  ],
  fonts: [
    { family: "Manrope", weights: "600", role: "h1 semibold, tracking-tight, balanced (not Josefin)", googleName: "Manrope", cssVar: "--font-manrope" },
    { family: "Josefin Sans", weights: "300", role: "Splash and labels only", googleName: "Josefin+Sans:wght@300", cssVar: "--font-josefin" },
    POPPINS,
  ],
  voice: ["Practical, grounded, consultative.", "No hype."],
  dos: [
    "Set h1 in Manrope semibold, tracking-tight, balanced.",
    "Describe what an integration does and what it replaces.",
    "Stay dark only.",
  ],
  donts: [
    "Do not set h1 in Josefin Sans. It is for the splash and labels.",
    "Do not use hype language.",
    "Do not add a light theme.",
  ],
  ui: [
    { label: "Radius", value: "0.9rem" },
    { label: "Gradient", value: "90deg, cyan to amber" },
    { label: "Theme", value: "Dark only" },
  ],
  accent: "#CAF14A",
  accentRgb: [202, 241, 74],
  flags: ["Production domain is TBC. The site runs in development only."],
};

const MAZAL: Brand = {
  id: "mazal",
  name: "Mazal",
  domain: "joinmazal.org",
  tagline: "it's more fun in mazal!",
  descriptor:
    "The trading and finance community of GN Ventures in the Philippines. A free community for crypto and gold: workshops, live sessions, Discord. A community. Not just a page.",
  status: "live",
  swatches: [
    { name: "Lime (web)", hex: "#C0F030", css: "var(--green)", role: "Web accent", group: "Web" },
    { name: "Lime 2 (web)", hex: "#9ECA1D", css: "var(--green2)", role: "Web accent, darker step", group: "Web" },
    { name: "Blue (web)", hex: "#0128A9", role: "Web secondary", group: "Web" },
    { name: "Navy (web)", hex: "#0E1220", role: "Web surface", group: "Web" },
    { name: "Ink (web)", hex: "#020615", role: "Web deep surface", group: "Web" },
    { name: "Background (web)", hex: "#000000", role: "Web page base", group: "Web" },
    { name: "Text (web)", hex: "#FFFFFF", role: "Primary text. Secondary 72%, tertiary 50%", group: "Web" },
    { name: "Card (web)", css: "rgba(14,18,32,0.72)", role: "Glass card fill", group: "Web" },
    { name: "Stroke (web)", css: "rgba(255,255,255,0.09)", role: "Hairline. Green stroke is rgba(192,240,48,0.3)", group: "Web" },
    { name: "Cyber Lime", hex: "#C0F030", role: "Social kit: the M, headline accent, CTAs", group: "Social kit" },
    { name: "Deep Midnight Navy", hex: "#04070C", role: "Social kit: plate, gradient to #05090F", group: "Social kit" },
    { name: "Electric Blue", hex: "#0128A9", role: "Social kit: ambient light only, never text", group: "Social kit" },
    { name: "White", hex: "#FFFFFF", role: "Social kit: text", group: "Social kit" },
    { name: "Muted", hex: "#8F94A8", role: "Social kit: secondary text", group: "Social kit" },
    { name: "Stop Red", hex: "#FF5959", role: "Social kit: stop-loss values only", group: "Social kit" },
  ],
  fonts: [
    JOSEFIN,
    MANROPE,
    POPPINS,
    { family: "Archivo", weights: "700, 800, 900", role: "Social kit only: 900 Archivo Black headlines and stats, 800 pills and CTAs, 700 body", googleName: "Archivo:wght@700;800;900", cssVar: "--font-archivo" },
  ],
  voice: [
    "A friend who trades. Not a bank.",
    "\"it's more fun in mazal!\"",
    "A community. Not just a page.",
    "Locked CTA: \"Comment MAZAL to learn more\".",
  ],
  dos: [
    "Show entry, stop, target and R:R on every trade post.",
    "Label open trades as unrealised.",
    "Keep the M one mark, one color. Clear space is half the mark width.",
    "Use commas, not em dashes.",
  ],
  donts: [
    "Never promise guaranteed profit, risk-free or easy money.",
    "Do not call posts \"signals\". No hype. No unconfirmed partner names.",
    "Never recolor, outline, glow or redraw the M.",
    "Never set text in Electric Blue.",
    "No glow on social creative: flat shapes only.",
  ],
  ui: [
    { label: "Web glass", value: "Card rgba(14,18,32,0.72), blur 26px, saturate 170%" },
    { label: "Web buttons", value: "Pill, radius 999px, 15px uppercase Poppins, 0.05em, padding 17px 34px" },
    { label: "Social kit", value: "Flat shapes, zero glow, Archivo only" },
    { label: "Plate", value: "Navy diagonal gradient, lime light off-canvas top left, blue bottom right, 16px halftone dots, 100px grid, film grain, vignette" },
    { label: "Formats", value: "Feed 2048 x 2048 JPEG, story 1080 x 1920" },
    { label: "Mascot", value: "MAZI: Analyzing, Sunglasses, Risk Managed, Breaking News" },
  ],
  accent: "#C0F030",
  accentRgb: [192, 240, 48],
  flags: [
    "Two styling worlds conflict: web (glass, Josefin) versus the social kit (flat, Archivo). Both are documented as channels.",
    "Powered by GN Club: Mazal was incubated by GN Club. It is a department of GN Ventures.",
    "The M SVGs are the only original vector files in the whole company.",
  ],
};

const COMMUNE: Brand = {
  id: "commune",
  name: "GN Commune",
  tagline: "A little cafe on wheels, for your big day.",
  descriptor:
    "A mobile cafe cart bookable for weddings, offices and birthdays in Metro Manila.",
  status: "placeholder",
  swatches: [
    { name: "Black", hex: "#000000", role: "Dark background, light foreground", group: "Core" },
    { name: "White", hex: "#FFFFFF", role: "Light background, dark foreground", group: "Core" },
    { name: "Muted (dark)", hex: "#C2C2C2", css: "color-mix(in srgb, #fff 76%, #000)", role: "Dark theme secondary text", group: "Dark greys" },
    { name: "Subtle (dark)", hex: "#9E9E9E", css: "color-mix(in srgb, #fff 62%, #000)", role: "Dark theme tertiary text", group: "Dark greys" },
    { name: "Line (dark)", hex: "#2E2E2E", css: "color-mix(in srgb, #fff 18%, #000)", role: "Dark theme hairline", group: "Dark greys" },
    { name: "Line strong (dark)", hex: "#616161", css: "color-mix(in srgb, #fff 38%, #000)", role: "Dark theme strong line", group: "Dark greys" },
    { name: "Surface (light)", hex: "#F5F5F5", css: "color-mix(in srgb, #000 4%, #fff)", role: "Light theme surface", group: "Light greys" },
    { name: "Muted (light)", hex: "#424242", css: "color-mix(in srgb, #000 74%, #fff)", role: "Light theme secondary text", group: "Light greys" },
    { name: "Subtle (light)", hex: "#616161", css: "color-mix(in srgb, #000 62%, #fff)", role: "Light theme tertiary text", group: "Light greys" },
    { name: "Line (light)", hex: "#D6D6D6", css: "color-mix(in srgb, #000 16%, #fff)", role: "Light theme hairline", group: "Light greys" },
    { name: "Line strong (light)", hex: "#A3A3A3", css: "color-mix(in srgb, #000 36%, #fff)", role: "Light theme strong line", group: "Light greys" },
  ],
  fonts: [
    { family: "Manrope", weights: "300", role: "Large headings", googleName: "Manrope:wght@300", cssVar: "--font-manrope" },
    { family: "Jost", weights: "300", role: "Wordmark and 10px caps tracked eyebrows", googleName: "Jost:wght@300", cssVar: "--font-jost" },
    { family: "Inter", weights: "400 to 600", role: "Body", googleName: "Inter", cssVar: "--font-inter" },
    { family: "Caveat", weights: "400 to 700", role: "Handwriting accent", googleName: "Caveat", cssVar: "--font-caveat" },
    { family: "IBM Plex Mono", weights: "400", role: "Labels", googleName: "IBM+Plex+Mono:wght@400", cssVar: "--font-plex-mono" },
  ],
  voice: [
    "Warm, handwritten, small and personal.",
    "No dash punctuation. Use \" | \" as the separator.",
    "Brand copy is placeholder: confirm with owner.",
  ],
  dos: [
    "Stay strictly black and white. Greys come only from color-mix of foreground over background.",
    "Draw with wobbly SVG, 2px ink outlines and hard offset ink shadows.",
    "Use dashed and dotted lines, tape strips, stickers and rotations from -2 to 2 degrees.",
    "Set the wordmark as live text in Jost 300.",
  ],
  donts: [
    "No hue of any kind, by owner directive.",
    "No glassmorphism. It is retired for Commune.",
    "No dash punctuation in copy.",
    "Do not treat the placeholder copy as final.",
  ],
  ui: [
    { label: "Outline", value: "2px ink" },
    { label: "Shadow", value: "Hard offset ink, no blur" },
    { label: "Background", value: "Dotted notebook grid" },
    { label: "Lines", value: "Dashed and dotted" },
    { label: "Rotation", value: "-2 to 2 degrees" },
    { label: "Themes", value: "Dark default (white on black), light variant (black on white)" },
  ],
  accent: "#FFFFFF",
  accentRgb: [255, 255, 255],
  flags: [
    "Brand copy placeholder, confirm with owner.",
    "Logo is a black ink line illustration on transparent (sleepy person with coffee cup, no text). A wordmark image does not exist.",
  ],
};

export const BRANDS: Record<BrandId, Brand> = {
  ventures: VENTURES,
  media: MEDIA,
  academy: ACADEMY,
  club: CLUB,
  labs: LABS,
  mazal: MAZAL,
  commune: COMMUNE,
};

/** Display order: umbrella first, then the six departments. */
export const BRAND_ORDER: readonly BrandId[] = [
  "ventures",
  "media",
  "academy",
  "club",
  "labs",
  "mazal",
  "commune",
];

/** The six departments (everything except the umbrella). */
export const DEPARTMENT_ORDER: readonly BrandId[] = BRAND_ORDER.filter(
  (id) => id !== "ventures",
);

export function getBrand(id: BrandId): Brand {
  return BRANDS[id];
}
