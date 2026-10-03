import { Badge, CopyChip, GlowCard, SectionShell } from "@/components/ui";
import { BRANDS, DEPARTMENT_ORDER } from "@/content/brands";
import { getFontFamily } from "@/content/fonts-manifest";
import type { BrandId } from "@/content/types";
import { SubHead } from "./Parts";

interface Specimen {
  readonly family: string;
  readonly slug: string;
  readonly cssVar: string;
  readonly role: string;
  readonly weights: readonly number[];
  readonly weightNote: string;
  readonly sample: string;
  readonly caps?: boolean;
  readonly nextFont: string;
  readonly tier: "core" | "secondary";
}

const CORE: readonly Specimen[] = [
  {
    family: "Josefin Sans", slug: "josefin-sans", cssVar: "--font-josefin", tier: "core",
    role: "h1, h2 and titles. Weight 300, caps via CSS, +0.04em tracking.",
    weights: [300, 400], weightNote: "300 for titles. 400 loaded as a fallback weight.",
    sample: "News. Insights. Future.", caps: true,
    nextFont: 'Josefin_Sans({ subsets: ["latin"], weight: ["300", "400"], display: "swap", variable: "--font-josefin" })',
  },
  {
    family: "Manrope", slug: "manrope", cssVar: "--font-manrope", tier: "core",
    role: "Body copy and h3 and below. Labs h1 and Commune large headings also use it.",
    weights: [300, 400, 500, 600, 700], weightNote: "Variable family, 400 to 700 for body.",
    sample: "Plain, practical, built to be read.",
    nextFont: 'Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" })',
  },
  {
    family: "Poppins", slug: "poppins", cssVar: "--font-poppins", tier: "core",
    role: "UI: buttons, nav, labels and badges.",
    weights: [400, 500, 600], weightNote: "400, 500 and 600 only.",
    sample: "Get started",
    nextFont: 'Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-poppins" })',
  },
  {
    family: "Geist Mono", slug: "geist-mono", cssVar: "--font-geist-mono", tier: "core",
    role: "Numerals and tabular figures. Named for GN Academy, used here for every number.",
    weights: [400, 500, 600], weightNote: "Variable family, 400 to 600.",
    sample: "0123456789 PHP 1,000",
    nextFont: 'Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" })',
  },
];

const SECONDARY: readonly Specimen[] = [
  {
    family: "Archivo", slug: "archivo", cssVar: "--font-archivo", tier: "secondary",
    role: "Mazal social creative only. 900 (Archivo Black) headlines and stats, 800 pills and CTAs, 700 body.",
    weights: [700, 800, 900], weightNote: "700, 800, 900.",
    sample: "it's more fun in mazal!",
    nextFont: 'Archivo({ subsets: ["latin"], weight: ["700", "800", "900"], display: "swap", variable: "--font-archivo" })',
  },
  {
    family: "Jost", slug: "jost", cssVar: "--font-jost", tier: "secondary",
    role: "GN Commune wordmark (live text) and 10px caps tracked eyebrows.",
    weights: [300], weightNote: "300 only.", caps: true,
    sample: "GN Commune",
    nextFont: 'Jost({ subsets: ["latin"], weight: ["300"], display: "swap", variable: "--font-jost" })',
  },
  {
    family: "Inter", slug: "inter", cssVar: "--font-inter", tier: "secondary",
    role: "GN Commune body.",
    weights: [400, 500, 600], weightNote: "400 to 600.",
    sample: "A little cafe on wheels.",
    nextFont: 'Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })',
  },
  {
    family: "Caveat", slug: "caveat", cssVar: "--font-caveat", tier: "secondary",
    role: "GN Commune handwriting accent.",
    weights: [400, 700], weightNote: "400 to 700.",
    sample: "for your big day",
    nextFont: 'Caveat({ subsets: ["latin"], display: "swap", variable: "--font-caveat" })',
  },
  {
    family: "IBM Plex Mono", slug: "ibm-plex-mono", cssVar: "--font-plex-mono", tier: "secondary",
    role: "GN Commune labels.",
    weights: [400], weightNote: "400 only.",
    sample: "BOOKING | METRO MANILA",
    nextFont: 'IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], display: "swap", variable: "--font-plex-mono" })',
  },
];

const SAMPLE_WEIGHT: Readonly<Record<string, number>> = {
  "josefin-sans": 300,
  poppins: 500,
  archivo: 900,
  jost: 300,
  caveat: 700,
};

function usedBy(family: string): readonly string[] {
  const ids: readonly BrandId[] = ["ventures", ...DEPARTMENT_ORDER];
  return ids.filter((id) => BRANDS[id].fonts.some((f) => f.family === family)).map((id) => BRANDS[id].name);
}

function importName(snippet: string): string {
  return snippet.slice(0, snippet.indexOf("("));
}

function SpecimenCard({ spec }: { readonly spec: Specimen }) {
  const link = getFontFamily(spec.slug)?.googleUrl;
  const font = `var(${spec.cssVar}), "${spec.family}", sans-serif`;
  const brands = usedBy(spec.family);
  const snippet = `import { ${importName(spec.nextFont)} } from "next/font/google";\nconst font = ${spec.nextFont};`;
  return (
    <GlowCard as="article" zoom className="flex flex-col gap-4">
      <div>
        <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">{spec.family}</p>
        <p
          className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight text-[var(--b-fg)]"
          style={{
            fontFamily: font,
            fontWeight: SAMPLE_WEIGHT[spec.slug] ?? 400,
            textTransform: spec.caps ? "uppercase" : "none",
            letterSpacing: spec.caps ? "0.04em" : undefined,
          }}
        >
          {spec.sample}
        </p>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xl text-[var(--b-fg)]" style={{ fontFamily: font }} aria-label={`Weights: ${spec.weightNote}`}>
        {spec.weights.map((w) => (
          <span key={w} style={{ fontWeight: w }}>
            Aa<span className="ml-1 font-mono text-[0.6875rem] text-[var(--b-muted)]">{w}</span>
          </span>
        ))}
      </div>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">{spec.role}</p>
      <p className="text-[0.8125rem] leading-snug text-[var(--b-muted)]">
        <span className="text-[var(--b-fg)]">Used by:</span> {brands.join(", ")}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <CopyChip value="next/font snippet" copyValue={snippet} label={`Copy next/font code for ${spec.family}`} />
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 items-center rounded-md border border-[var(--b-border)] px-2.5 py-1 font-ui text-xs text-[var(--b-fg)] hover:border-[var(--b-accent)]"
          >
            Google Fonts<span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </GlowCard>
  );
}

function Pairing() {
  return (
    <GlowCard className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
      <div>
        <p
          className="text-[clamp(1.75rem,3.6vw,2.75rem)] uppercase leading-[1.08] text-[var(--b-fg)]"
          style={{ fontFamily: "var(--b-font-display)", fontWeight: 300, letterSpacing: "0.04em" }}
        >
          Built to be found.
        </p>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-[var(--b-muted)]">
          Josefin Sans sets the title, Manrope carries the paragraph and Poppins labels the action. Numbers fall back to Geist Mono.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full px-5 py-2.5 font-ui text-sm font-semibold uppercase tracking-[0.08em] text-[#08090a]" style={{ background: "var(--lime)" }}>
          Poppins 600
        </span>
        <span className="font-mono text-2xl text-[var(--b-fg)]">1,080 px</span>
      </div>
    </GlowCard>
  );
}

export default function Typography() {
  return (
    <SectionShell
      id="typography"
      num="11"
      eyebrow="Foundations"
      title="Typography"
      lead={
        <>
          Four families run across the umbrella. Mazal&apos;s social kit and GN Commune add their own. Every family loads through next/font with swap. Need the files? Go to{" "}
          <a href="#fonts" className="text-[var(--b-accent)] underline underline-offset-4">Fonts</a> for woff2 downloads.
        </>
      }
    >
      <Pairing />
      <div>
        <SubHead title="Core families" note="The shared GN type system. Specimens are live, set in the real font." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {CORE.map((s) => (
            <SpecimenCard key={s.slug} spec={s} />
          ))}
        </div>
      </div>
      <div>
        <SubHead
          title="Secondary families"
          note="Scoped to one channel each. They are loaded without preload, so they never slow the core pages."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SECONDARY.map((s) => (
            <SpecimenCard key={s.slug} spec={s} />
          ))}
        </div>
        <p className="mt-5 flex flex-wrap items-center gap-3 text-[0.9375rem] text-[var(--b-muted)]">
          <Badge tone="neutral">Mazal</Badge>
          Archivo applies to the social kit only. The Mazal web channel uses Josefin Sans, Manrope and Poppins.
        </p>
      </div>
    </SectionShell>
  );
}
