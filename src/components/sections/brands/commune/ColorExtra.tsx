import type { CSSProperties } from "react";
import { BRANDS } from "@/content/brands";
import { cn } from "@/lib/utils";
import { ThemedLogo } from "../parts/shared";
import { FONT, Panel, SketchHeading, Sticker } from "./ui";

interface Step {
  readonly token: string;
  readonly fill: string;
  readonly mix: string;
}

/** Every grey is foreground mixed over background. Percentages are the spec values per theme. */
const LADDER: readonly Step[] = [
  { token: "Surface", fill: "var(--b-surface)", mix: "light 4%" },
  { token: "Line", fill: "var(--b-border)", mix: "dark 18% | light 16%" },
  { token: "Line strong", fill: "var(--b-line-strong)", mix: "dark 38% | light 36%" },
  { token: "Subtle", fill: "var(--b-subtle)", mix: "both 62%" },
  { token: "Muted", fill: "var(--b-muted)", mix: "dark 76% | light 74%" },
  { token: "Foreground", fill: "var(--b-fg)", mix: "100%" },
];

function Ladder() {
  return (
    <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {LADDER.map((s, i) => (
        <li key={s.token} className="flex flex-col gap-2">
          <div
            style={{ background: s.fill, transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
            className="sk-ink sk-wobble h-20 shadow-[3px_3px_0_var(--b-fg)]"
          />
          <p className={cn("text-sm text-[var(--b-fg)]", FONT.mono)}>{s.token}</p>
          <p className="text-sm text-[var(--b-muted)]">{s.mix}</p>
        </li>
      ))}
    </ol>
  );
}

interface ThemePanelProps {
  readonly theme: "dark" | "light";
  readonly logo: "dark" | "ink";
}

/** A self-contained themed surface. data-theme is local, so both themes show at once. */
function ThemePanel({ theme, logo }: ThemePanelProps) {
  const style: CSSProperties = { background: "var(--b-bg)", color: "var(--b-fg)" };
  const isDark = theme === "dark";
  return (
    <div
      data-brand="commune"
      data-theme={theme}
      style={style}
      className="sk-dotted-bg sk-ink flex flex-col gap-4 rounded-[6px_18px_8px_16px] p-6 shadow-[4px_4px_0_var(--b-fg)]"
    >
      <div className="flex items-center gap-4">
        <span className="h-20 w-20 shrink-0">
          <ThemedLogo brand="commune" fixed={logo} sizes="80px" />
        </span>
        <div>
          <p className={cn("text-3xl", FONT.display)}>{isDark ? "Dark" : "Light"}</p>
          <p className={cn("text-xl text-[var(--b-muted)]", FONT.hand)}>{isDark ? "white on black, default" : "black on white"}</p>
        </div>
      </div>
      <p className="text-base leading-relaxed text-[var(--b-muted)]">{BRANDS.commune.descriptor}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Sticker inverse>Book the cart</Sticker>
        <Sticker>Metro Manila</Sticker>
        <span aria-hidden="true" className="h-0 w-16 border-t-2 border-dotted border-[var(--b-line-strong)]" />
      </div>
    </div>
  );
}

/** Color extras: the grey ladder and both themes side by side. */
export default function ColorExtra() {
  return (
    <div className="space-y-6">
      <SketchHeading>Grey ladder</SketchHeading>
      <Panel title="Foreground over background, never a new color" rotate={-1}>
        <Ladder />
      </Panel>
      <SketchHeading>Both themes at once</SketchHeading>
      <div className="grid gap-5 lg:grid-cols-2">
        <ThemePanel theme="dark" logo="dark" />
        <ThemePanel theme="light" logo="ink" />
      </div>
    </div>
  );
}
