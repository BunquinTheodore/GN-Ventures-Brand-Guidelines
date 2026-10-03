import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Doodle, GeometricCup, type DoodleName } from "./doodles";
import { FONT, Panel, SketchHeading, Sticker } from "./ui";

interface Entry {
  readonly name: DoodleName;
  readonly label: string;
  readonly note: string;
}

const LIBRARY: readonly Entry[] = [
  { name: "cup", label: "Cup with steam", note: "Steam drifts. Static under reduced motion." },
  { name: "bean", label: "Bean", note: "One crease, one wobble." },
  { name: "cart", label: "Cart with umbrella", note: "The hero doodle." },
  { name: "star", label: "Star", note: "Filler. Twinkles a little." },
  { name: "sparkle", label: "Sparkle", note: "Accent next to a headline." },
  { name: "squiggle", label: "Squiggle", note: "Underline or divider." },
  { name: "arrow", label: "Arrow", note: "Points at the thing that matters." },
];

const STICKERS: readonly string[] = ["weddings", "offices", "birthdays", "Metro Manila", "placeholder"];

function DoodleCard({ entry, index }: { readonly entry: Entry; readonly index: number }) {
  return (
    <li className="flex">
      <Panel title={entry.label} rotate={index % 2 === 0 ? -1 : 1} className="flex w-full flex-col items-center gap-3 text-center">
        <Doodle name={entry.name} label={entry.label} className="h-24 w-24" />
        <p className="text-sm text-[var(--b-muted)]">{entry.note}</p>
      </Panel>
    </li>
  );
}

/** Imagery proof: the doodle library, hand drawn versus geometric, and the sticker sheet. */
export default function ImageryExtra() {
  return (
    <div className="space-y-6">
      <SketchHeading>Doodle library</SketchHeading>
      <ul className="grid grid-cols-2 gap-5 md:grid-cols-4 xl:grid-cols-7">
        {LIBRARY.map((e, i) => (
          <DoodleCard key={e.name} entry={e} index={i} />
        ))}
      </ul>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Hand drawn | wobbly, uneven, 2px ink" rotate={-1}>
          <div className="flex items-center gap-5">
            <Doodle name="cup" label="Hand drawn cup" className="h-28 w-28" />
            <div className="space-y-2">
              <Badge tone="accent">Do</Badge>
              <p className="text-base leading-relaxed text-[var(--b-fg)]">Paths drift off the grid. Corners are never perfect.</p>
            </div>
          </div>
        </Panel>
        <Panel title="Geometric | rects, circles, ruler lines" rotate={1}>
          <div className="relative flex items-center gap-5">
            <GeometricCup className="h-28 w-28" />
            <div className="space-y-2">
              <Badge tone="neutral">Do not</Badge>
              <p className="text-base leading-relaxed text-[var(--b-fg)]">Perfect shapes read as clip art, not a sketchbook.</p>
            </div>
          </div>
        </Panel>
      </div>
      <SketchHeading>Sticker sheet</SketchHeading>
      <div className="sk-dotted-bg sk-ink flex flex-wrap items-center gap-4 rounded-[6px_18px_8px_16px] p-6 shadow-[4px_4px_0_var(--b-fg)]">
        {STICKERS.map((s, i) => (
          <Sticker key={s} rotate={[-2, 1, -1, 2, -1.5][i]} inverse={i % 2 === 1}>
            {s}
          </Sticker>
        ))}
        <span aria-hidden="true" className={cn("text-3xl", FONT.hand)}>*</span>
      </div>
    </div>
  );
}
