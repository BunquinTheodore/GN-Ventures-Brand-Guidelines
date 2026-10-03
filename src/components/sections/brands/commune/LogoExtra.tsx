import { DerivedTag } from "@/components/ui";
import { getAsset } from "@/content/assets";
import { cn } from "@/lib/utils";
import { Img, ThemedLogo } from "../parts/shared";
import { Eyebrow, FONT, Panel, SketchHeading } from "./ui";

const ORIGINAL_ID = "commune-primary-light";
const SIZE_BOX = "h-56 items-center justify-center rounded-[6px] p-4";

function Wordmark({ size }: { readonly size: string }) {
  return <span className={cn("leading-none text-[var(--b-fg)]", FONT.word, size)}>GN Commune</span>;
}

/** Logo companions: the invert test, the live wordmark and two proposed lockup arrangements. */
export default function LogoExtra() {
  const original = getAsset(ORIGINAL_ID);
  const white = getAsset("commune-mono-white");
  return (
    <div className="space-y-4">
      <SketchHeading>White version and wordmark</SketchHeading>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Original | black ink on transparent" rotate={-1}>
          <div className={cn("flex bg-white", SIZE_BOX)}>
            {original ? (
              <Img asset={original} alt="GN Commune original logo, black ink on white" sizes="224px" className="h-full w-auto object-contain" />
            ) : null}
          </div>
          <div className="mt-3">
            <DerivedTag kind="original" note={original?.provenance} />
          </div>
        </Panel>
        <Panel title="CSS invert | white on black" rotate={1}>
          <div className={cn("flex bg-black", SIZE_BOX)}>
            {original ? (
              <Img asset={original} alt="GN Commune logo inverted with CSS to white ink on black" sizes="224px" className="h-full w-auto object-contain invert" />
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DerivedTag kind="derived" note="CSS filter invert(1) of the original ink illustration. Not an official file." />
            <span className={cn("text-sm text-[var(--b-muted)]", FONT.mono)}>filter: invert(1)</span>
          </div>
        </Panel>
        <Panel title="Stored file | mono white PNG" rotate={-1}>
          <div className={cn("flex bg-black", SIZE_BOX)}>
            {white ? (
              <Img asset={white} alt="GN Commune mono white logo file on black" sizes="224px" className="h-full w-auto object-contain" />
            ) : null}
          </div>
          <div className="mt-3">
            <DerivedTag kind="derived" note={white?.provenance} />
          </div>
        </Panel>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Wordmark | live text, Jost 300" rotate={1}>
          <div className="flex min-h-40 flex-col justify-center gap-4">
            <Wordmark size="text-6xl sm:text-7xl" />
            <Eyebrow>A little cafe on wheels</Eyebrow>
          </div>
          <p className="mt-3 text-base leading-relaxed text-[var(--b-muted)]">
            No wordmark image exists. The name is set as live text in Jost 300. Case and tracking are TBC.
          </p>
        </Panel>
        <Panel title="Lockups | Proposed arrangements" rotate={-1}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-[6px] border-2 border-dashed border-[var(--b-line-strong)] p-4">
              <span className="h-16 w-16 shrink-0">
                <ThemedLogo brand="commune" sizes="64px" />
              </span>
              <Wordmark size="text-2xl" />
            </div>
            <div className="flex flex-col items-center gap-2 rounded-[6px] border-2 border-dashed border-[var(--b-line-strong)] p-4">
              <span className="h-20 w-20">
                <ThemedLogo brand="commune" sizes="80px" />
              </span>
              <Wordmark size="text-2xl" />
            </div>
          </div>
          <p className="mt-3 text-base leading-relaxed text-[var(--b-muted)]">
            Horizontal and stacked. Both are Proposed, there is no approved lockup yet.
          </p>
        </Panel>
      </div>
    </div>
  );
}
