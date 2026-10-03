import { BRANDS } from "@/content/brands";
import { cn } from "@/lib/utils";
import { Doodle } from "./doodles";
import { Eyebrow, FONT, Panel, PlaceholderStamp, SketchHeading, Sticker } from "./ui";

const OCCASIONS: readonly string[] = ["Weddings", "Offices", "Birthdays"];

const PILLARS: readonly (readonly [string, string])[] = [
  ["Black and white", "Dark is the default. Light flips every token. No hue, ever."],
  ["Drawn by hand", "Wobbly 2px ink lines, hard offset shadows, tape and stickers."],
  ["Small and personal", "Warm, handwritten voice. The separator is a pipe, never a dash."],
];

/** A sketchbook poster for the tagline: proves the identity at a glance. */
export default function EssenceExtra() {
  const brand = BRANDS.commune;
  return (
    <div className="space-y-4">
      <SketchHeading>The poster</SketchHeading>
      <div className="sk-dotted-bg sk-ink relative overflow-hidden rounded-[6px_18px_8px_16px] p-6 shadow-[4px_4px_0_var(--b-fg)] sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <Eyebrow>GN Commune | Metro Manila</Eyebrow>
            <p className={cn("text-[clamp(2rem,5vw,3.75rem)] leading-[1.08] text-[var(--b-fg)]", FONT.display)}>
              {brand.tagline}
            </p>
            <p className={cn("text-2xl text-[var(--b-muted)]", FONT.hand)}>bookable for | weddings | offices | birthdays</p>
            <div className="flex flex-wrap items-center gap-3">
              {OCCASIONS.map((o, i) => (
                <Sticker key={o} rotate={i % 2 === 0 ? -2 : 1.5} inverse={i === 1}>
                  {o}
                </Sticker>
              ))}
            </div>
            <PlaceholderStamp />
          </div>
          <div className="relative mx-auto grid max-w-sm grid-cols-3 items-center gap-3">
            <Doodle name="cart" label="Cafe cart with umbrella" className="col-span-2 h-auto w-full" />
            <Doodle name="cup" label="Coffee cup with steam" className="h-auto w-full" />
            <Doodle name="star" className="h-10 w-10 justify-self-center" />
            <Doodle name="bean" label="Coffee bean" className="h-14 w-14 -rotate-6 justify-self-center" />
            <Doodle name="sparkle" className="h-10 w-10 justify-self-center" />
          </div>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {PILLARS.map(([title, text], i) => (
          <Panel key={title} rotate={i === 1 ? 1 : -1} title={title}>
            <p className="text-base leading-relaxed text-[var(--b-fg)]">{text}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
