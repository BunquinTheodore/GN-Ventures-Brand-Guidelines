import { Badge, Button } from "@/components/ui";
import type { BrandId } from "@/content/types";
import { cn } from "@/lib/utils";
import { Card, DISPLAY_CLS, PartFrame, SubHeading, ThemedLogo, UI_FONT_CLS, brandOf, resolveGlass, type ChapterPartProps } from "./shared";

const NAV_ITEMS: readonly string[] = ["Overview", "Work", "Contact"];

function inkClass(brand: BrandId): string {
  return brand === "commune" ? "border-2 border-[var(--b-fg)]" : "border border-[var(--b-border)]";
}

function ButtonsDemo({ brand, glass }: { readonly brand: BrandId; readonly glass: boolean }) {
  return (
    <Card brand={brand} glass={glass} className="space-y-5">
      <SubHeading>Buttons</SubHeading>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" data-sfx="click">Primary</Button>
        <Button variant="secondary" data-sfx="click">Secondary</Button>
        <Button variant="outline" data-sfx="click">Outline</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
      <SubHeading>Badges</SubHeading>
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent">Accent</Badge>
        <Badge tone="neutral">Neutral</Badge>
        {brand === "commune" || brand === "mazal" || brand === "academy" ? null : (
          <>
            <Badge tone="cyan">Secondary</Badge>
            <Badge tone="amber">Highlight</Badge>
          </>
        )}
      </div>
    </Card>
  );
}

function NavDemo({ brand, glass }: { readonly brand: BrandId; readonly glass: boolean }) {
  return (
    <Card brand={brand} glass={glass} className="space-y-4">
      <SubHeading>Navigation</SubHeading>
      <nav
        aria-label={`${brandOf(brand).name} sample navigation`}
        className={cn("flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[var(--b-radius)] px-4 py-2", inkClass(brand))}
      >
        <span className="h-9 w-9 shrink-0"><ThemedLogo brand={brand} sizes="36px" /></span>
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item}
            href={`#${brand}-components`}
            aria-current={i === 0 ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center text-[0.8125rem] font-medium uppercase tracking-[0.1em] hover:text-[var(--b-accent)]",
              UI_FONT_CLS,
              i === 0 ? "text-[var(--b-accent)]" : "text-[var(--b-fg)]",
            )}
          >
            {item}
          </a>
        ))}
      </nav>
      <p className="text-[0.9375rem] text-[var(--b-muted)]">Nav text is uppercase with 0.1em tracking. Labels here are samples.</p>
    </Card>
  );
}

function FormDemo({ brand, glass }: { readonly brand: BrandId; readonly glass: boolean }) {
  const id = `${brand}-sample-email`;
  return (
    <Card brand={brand} glass={glass} className="space-y-4">
      <SubHeading>Input</SubHeading>
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className={cn("text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-muted)]", UI_FONT_CLS)}>
          Email
        </label>
        <input
          id={id}
          type="email"
          placeholder="name@example.com"
          autoComplete="off"
          className={cn(
            "min-h-12 w-full rounded-[var(--b-radius)] bg-[var(--b-surface)] px-4 text-base text-[var(--b-fg)] placeholder:text-[var(--b-muted)]",
            inkClass(brand),
          )}
        />
        <span className="text-sm text-[var(--b-muted)]">Helper text sits below, in the muted color.</span>
      </div>
    </Card>
  );
}

function SampleCard({ brand, glass }: { readonly brand: BrandId; readonly glass: boolean }) {
  const b = brandOf(brand);
  return (
    <Card brand={brand} glass={glass} zoom className="flex flex-col gap-3">
      <SubHeading>Card</SubHeading>
      <Badge tone="accent" className="self-start">Sample</Badge>
      <p className={cn("text-2xl text-[var(--b-fg)]", DISPLAY_CLS)}>{b.name}</p>
      <p className="text-base leading-relaxed text-[var(--b-muted)]">{b.descriptor}</p>
      <Button variant="outline" className="self-start" data-sfx="click">Learn more</Button>
    </Card>
  );
}

/** Components: live buttons, badges, card, nav and input in this brand's tokens, plus its recipe table. */
export default function ChapterComponents({ brand: id, glass: g, className }: ChapterPartProps) {
  const brand = brandOf(id);
  const glass = resolveGlass(id, g);
  return (
    <PartFrame
      brand={id}
      part="components"
      title="Components"
      lead="Rendered live from this brand's tokens. Change the switch above, where there is one, and they follow."
      className={className}
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr]">
        <div className="space-y-4 xl:col-span-1"><ButtonsDemo brand={id} glass={glass} /><FormDemo brand={id} glass={glass} /></div>
        <SampleCard brand={id} glass={glass} />
        <div className="space-y-4"><NavDemo brand={id} glass={glass} /></div>
      </div>
      <div>
        <SubHeading>Recipe</SubHeading>
        <dl className="grid gap-3 md:grid-cols-2">
          {brand.ui.map((r) => (
            <div key={r.label} className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-4">
              <dt className="mb-1 font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">{r.label}</dt>
              <dd className="text-base leading-relaxed text-[var(--b-fg)]">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PartFrame>
  );
}
