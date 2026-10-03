import { Badge, ContrastTable, SwatchCard } from "@/components/ui";
import type { BrandId, Swatch } from "@/content/types";
import { PartFrame, SubHeading, brandOf, groupSwatches, type ChapterPartProps } from "./shared";

interface ContrastSpec {
  readonly title: string;
  readonly fg: readonly string[];
  readonly bg: readonly string[];
}

/** Which swatches to test against which, by swatch name. Computed live from the real values. */
const CONTRAST: Readonly<Record<BrandId, readonly ContrastSpec[]>> = {
  ventures: [
    { title: "Text and accents on ink", fg: ["Lime", "Cyan", "Amber", "Fog", "Fog dim"], bg: ["Ink", "Raised", "Deep"] },
    { title: "Ink on lime", fg: ["Ink"], bg: ["Lime"] },
  ],
  media: [
    { title: "Text and accents on dark", fg: ["Lime", "Gradient start", "Foreground", "Muted", "Error"], bg: ["Background", "Raised"] },
    { title: "Accent foreground on lime", fg: ["Accent fg"], bg: ["Lime"] },
  ],
  academy: [
    { title: "Light theme", fg: ["Foreground (light)", "Primary (light)", "Brand cyan", "Verified gold"], bg: ["Background (light)", "Card (light)"] },
    { title: "Dark theme", fg: ["Primary (dark)", "Brand neon lime"], bg: ["Background (dark)", "Card (dark)"] },
    { title: "Brand foreground on neon lime", fg: ["Brand fg"], bg: ["Brand neon lime"] },
  ],
  club: [
    { title: "Text and accents on ink", fg: ["Lime", "Cyan", "Amber", "Fog", "Fog dim"], bg: ["Ink", "Raised", "Deep"] },
    { title: "Ink on lime", fg: ["Ink"], bg: ["Lime"] },
  ],
  labs: [
    { title: "Text and accents on ink", fg: ["Lime", "Cyan", "Amber", "Mist", "Mist dim", "Destructive"], bg: ["Ink", "Raised", "Deep"] },
    { title: "Ink on lime", fg: ["Ink"], bg: ["Lime"] },
  ],
  mazal: [
    { title: "Web channel", fg: ["Lime (web)", "Text (web)", "Blue (web)"], bg: ["Background (web)", "Navy (web)", "Ink (web)"] },
    { title: "Social kit channel (Electric Blue is for ambient light only, never text)", fg: ["Cyber Lime", "White", "Muted", "Stop Red", "Electric Blue"], bg: ["Deep Midnight Navy"] },
  ],
  commune: [
    { title: "Dark theme", fg: ["White", "Muted (dark)", "Subtle (dark)"], bg: ["Black"] },
    { title: "Light theme", fg: ["Black", "Muted (light)", "Subtle (light)"], bg: ["White", "Surface (light)"] },
  ],
};

const NOTES: Readonly<Partial<Record<BrandId, readonly string[]>>> = {
  academy: [
    "Verified gold marks a verified credential and nothing else. The logo amber #F8D028 is deliberately not a token.",
    "Neon lime is always paired with the brand foreground. Hex values for oklch tokens are approximate.",
  ],
  labs: ["The brand gradient runs cyan to amber only, at 90 degrees."],
  mazal: [
    "Two palettes, two channels: the web site and the social kit. Use the switch above to preview each.",
    "Stop Red is for stop-loss values only. Electric Blue is ambient light only, never text.",
  ],
  commune: ["Strictly black and white by owner directive. Greys come only from color-mix of foreground over background."],
  ventures: ["The canonical GN lime #C6F24E is a proposal and needs owner sign-off."],
};

function pick(swatches: readonly Swatch[], names: readonly string[]): readonly Swatch[] {
  return names.flatMap((n) => swatches.filter((s) => s.name === n));
}

/** Color: click-to-copy swatches by group, usage notes and contrast computed from this brand's tokens. */
export default function ChapterColor({ brand: id, className }: ChapterPartProps) {
  const brand = brandOf(id);
  const notes = NOTES[id] ?? [];
  return (
    <PartFrame
      brand={id}
      part="color"
      title="Color"
      lead="Click any swatch to copy its value. Contrast is computed from the real values, not estimated."
      className={className}
    >
      {groupSwatches(brand).map(([group, swatches]) => (
        <div key={group}>
          <SubHeading>{group}</SubHeading>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {swatches.map((s) => (
              <li key={s.name} className="flex">
                <SwatchCard swatch={s} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      {notes.length > 0 ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {notes.map((n) => (
            <li key={n} className="flex items-start gap-3 rounded-[var(--b-radius)] border border-[var(--b-border)] p-4 text-[0.9375rem] leading-relaxed text-[var(--b-fg)]">
              <Badge tone="amber" className="mt-0.5 shrink-0">Rule</Badge>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-2">
        {CONTRAST[id].map((spec) => (
          <div key={spec.title}>
            <SubHeading>Contrast: {spec.title}</SubHeading>
            <ContrastTable foregrounds={pick(brand.swatches, spec.fg)} backgrounds={pick(brand.swatches, spec.bg)} />
          </div>
        ))}
      </div>
    </PartFrame>
  );
}
