import { GlowCard, SectionShell } from "@/components/ui";
import { SourceBadge, SpecTable, SubHead, type SourceKind } from "./Parts";

type SourceRow = readonly [string, string, SourceKind];

interface RadiusShape {
  readonly name: string;
  readonly value: string;
  readonly css: string;
  readonly accent: string;
  readonly pill?: boolean;
}

const RADII: readonly RadiusShape[] = [
  { name: "GN Academy", value: "0.5rem", css: "0.5rem", accent: "#C8F048" },
  { name: "GN Club", value: "0.75rem", css: "0.75rem", accent: "#C6F24E" },
  { name: "GN Labs", value: "0.9rem", css: "0.9rem", accent: "#CAF14A" },
  { name: "GN Media panels", value: "1rem", css: "1rem", accent: "#B0E62F" },
  { name: "Pills and Mazal buttons", value: "999px", css: "999px", accent: "#C0F030", pill: true },
];

const GLASS_ROWS: readonly (readonly string[])[] = [
  ["GN Media", "Raised at 58% via color-mix", "22px", "165%", "Lime-tinted shadow"],
  ["GN Club", "White 6% (strong 10%)", "20px", "140%", "Border white 14%"],
  ["GN Labs", "White 5.5% (strong 9.5%)", "Not recorded", "Not recorded", "Highlight 50%, border 14%"],
  ["Mazal web", "rgba(14,18,32,0.72)", "26px", "170%", "Stroke white 9%, green stroke 30%"],
  ["GN Academy", "Not recorded", "Not recorded", "Not recorded", "Card is white (light), oklch 0.26 (dark)"],
  ["GN Commune", "Retired. No glass", "None", "None", "2px ink outline, hard offset shadow"],
];

const CONTAINER_ROWS: readonly SourceRow[] = [
  ["Mazal web", "1180px", "Sourced"],
  ["This site", "1200px content max, 17rem side nav", "As built"],
  ["GN Media, Academy, Club, Labs, Commune", "TBC", "TBC"],
];

const SCALE = [4, 8, 12, 16, 24, 32, 48, 64, 96] as const;

const COMPONENT_ROWS: readonly SourceRow[] = [
  ["Mazal web button", "Pill 999px, padding 17px 34px, 15px uppercase Poppins, 0.05em", "Sourced"],
  ["Touch target", "44px minimum on every interactive element", "Sourced"],
  ["Mazal logo clear space", "Half the width of the M on every side", "Sourced"],
  ["Mazal social plate", "16px halftone dots, 100px grid", "Sourced"],
  ["GN Club mascot cursor", "44px and 88px PNG", "Sourced"],
  ["This site, button", "Min height 44px, padding 0.7rem 1.5rem, pill radius", "As built"],
  ["This site, glass card", "Padding 1.25rem, 1.5rem from md", "As built"],
  ["This site, section gap", "clamp 72px to 128px", "As built"],
];

function RadiusTile({ shape }: { readonly shape: RadiusShape }) {
  return (
    <figure className="m-0 flex flex-col items-start gap-3">
      <div
        aria-hidden="true"
        className="h-24 w-full border"
        style={{
          borderRadius: shape.css,
          borderColor: shape.accent,
          background: `color-mix(in srgb, ${shape.accent} 14%, transparent)`,
          height: shape.pill ? "3.5rem" : undefined,
        }}
      />
      <figcaption>
        <span className="block font-ui text-sm font-semibold text-[var(--b-fg)]">{shape.name}</span>
        <span className="font-mono text-xs text-[var(--b-muted)]">{shape.value}</span>
      </figcaption>
    </figure>
  );
}

function CommuneShape() {
  return (
    <div className="flex items-center gap-4">
      <div
        aria-hidden="true"
        className="h-12 w-28 border-2 border-[var(--b-fg)]"
        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px", boxShadow: "4px 4px 0 var(--b-fg)" }}
      />
      <p className="text-[0.875rem] leading-snug text-[var(--b-muted)]">GN Commune: wobbly outline, 2px ink, hard offset shadow. No fixed radius is recorded.</p>
    </div>
  );
}

function ScaleBars() {
  return (
    <ul className="space-y-2">
      {SCALE.map((px) => (
        <li key={px} className="flex items-center gap-3">
          <span className="w-12 shrink-0 text-right font-mono text-xs text-[var(--b-muted)]">{px}px</span>
          <span aria-hidden="true" className="h-3 rounded-sm" style={{ width: `${px * 3}px`, background: "var(--b-accent)" }} />
        </li>
      ))}
    </ul>
  );
}

export default function Spacing() {
  return (
    <SectionShell
      id="spacing"
      num="14"
      eyebrow="Foundations"
      title="Spacing and shape"
      lead="Radius, glass and container values as each department sets them. Where a department has not recorded a value it says so, and the spacing scale is a proposal."
    >
      <div>
        <SubHead title="Radius per department" note="Live shapes at each department's own radius." />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {RADII.map((r) => (
            <RadiusTile key={r.name} shape={r} />
          ))}
        </div>
        <div className="mt-6"><CommuneShape /></div>
      </div>

      <div>
        <SubHead title="Glass recipe values" note="The recipe is the same shape everywhere: a translucent fill, blur with saturate, a hairline, a top highlight." />
        <SpecTable
          caption="Glass values per department"
          head={["Department", "Fill", "Blur", "Saturate", "Edge and shadow"]}
          minWidth="44rem"
          rows={GLASS_ROWS}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <SubHead title="Container widths" />
          <SpecTable
            caption="Container widths"
            head={["Surface", "Width", "Status"]}
            minWidth="26rem"
            rows={CONTAINER_ROWS.map(([a, b, c]) => [a, b, <SourceBadge key={a} kind={c} />])}
          />
        </div>
        <div>
          <SubHead title="Spacing scale" proposed note="A 4px base. No department records a scale, so this is a proposal for the umbrella." />
          <GlowCard><ScaleBars /></GlowCard>
        </div>
      </div>

      <div>
        <SubHead title="Component paddings and sizes" />
        <SpecTable
          caption="Component paddings and sizes with their status"
          head={["Component", "Value", "Status"]}
          minWidth="36rem"
          rows={COMPONENT_ROWS.map(([a, b, c]) => [a, b, <SourceBadge key={a} kind={c} />])}
        />
      </div>
    </SectionShell>
  );
}
