import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { DISPLAY_CLS, ThemedLogo } from "../parts/shared";
import Block from "./Block";
import VerifiedSeal from "./VerifiedSeal";

type Theme = "light" | "dark";

/** Nested data-brand scope pinned to one theme, so both render at once whatever the chapter switch says. */
function Pane({ theme }: { readonly theme: Theme }) {
  const name = theme === "light" ? "Light theme (default)" : "Dark theme (alternate)";
  return (
    <div
      data-brand="academy"
      data-theme={theme}
      role="group"
      aria-label={name}
      className="flex flex-col gap-5 overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--b-bg)] p-5 text-[var(--b-fg)] md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="h-12 w-16 shrink-0">
          <ThemedLogo brand="academy" fixed={theme} sizes="64px" />
        </span>
        <span className="font-ui text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[var(--b-muted)]">{name}</span>
      </div>
      <p className="font-ui text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[var(--b-accent)]">Free AI Readiness Test</p>
      <h4 className={cn("text-[1.75rem] md:text-[2.25rem]", DISPLAY_CLS)}>Learn. Prove. Get hired.</h4>
      <p className="text-[1.0625rem] leading-relaxed text-[var(--b-muted)]">
        Score it. Prove it. Get hired for it. Plain steps, one verified result.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex min-h-11 items-center rounded-[var(--b-radius)] bg-[var(--b-brand)] px-5 font-ui text-[0.9375rem] font-semibold text-[var(--b-brand-fg)]">
          Take the test
        </span>
        <Button variant="outline" data-sfx="click">Learn more</Button>
      </div>
      <div className="flex items-center gap-3 rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--b-surface)] p-4">
        <VerifiedSeal size={28} />
        <div className="min-w-0">
          <p className="text-[1.0625rem] font-semibold text-[var(--b-fg)]">Verified credential</p>
          <p className="text-[0.8125rem] text-[var(--b-muted)]">Gold appears here and nowhere else.</p>
        </div>
      </div>
    </div>
  );
}

/** Light and dark rendered next to each other, independent of the chapter's theme switch. */
export default function ThemePair() {
  return (
    <Block
      title="Light and dark, side by side"
      lead="Academy is the only light-first department. Light is the default, dark is the alternate. Both panes below stay fixed. The switch at the top of the chapter re-themes everything else."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Pane theme="light" />
        <Pane theme="dark" />
      </div>
    </Block>
  );
}
