import { Fragment, type ComponentType, type ReactNode } from "react";
import { Badge, SectionShell } from "@/components/ui";
import type { BrandId } from "@/content/types";
import { findSection } from "@/content/nav";
import {
  ChapterApplications,
  ChapterColor,
  ChapterComponents,
  ChapterDownloads,
  ChapterEssence,
  ChapterImagery,
  ChapterLogo,
  ChapterSwitch,
  ChapterType,
  ChapterVoice,
} from "./parts";
import type { ChapterSwitchConfig } from "./parts";
import { PART_LABELS, PART_ORDER, ThemedLogo, brandOf, partId, resolveGlass } from "./parts/shared";
import type { ChapterPartKey, ChapterPartProps } from "./parts/shared";

export type { ChapterPartKey, ChapterPartProps } from "./parts/shared";
export type { ChapterSwitchConfig } from "./parts";

type PartComponent = ComponentType<ChapterPartProps>;

const DEFAULT_PARTS: Readonly<Record<ChapterPartKey, PartComponent>> = {
  essence: ChapterEssence,
  logo: ChapterLogo,
  color: ChapterColor,
  type: ChapterType,
  voice: ChapterVoice,
  components: ChapterComponents,
  imagery: ChapterImagery,
  applications: ChapterApplications,
  downloads: ChapterDownloads,
};

/** Theme or channel switches a chapter gets by default. Pass `switcher={false}` to remove, or your own config. */
const DEFAULT_SWITCH: Readonly<Partial<Record<BrandId, ChapterSwitchConfig>>> = {
  academy: {
    attr: "theme",
    legend: "Theme",
    initial: "light",
    options: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }],
  },
  commune: {
    attr: "theme",
    legend: "Theme",
    initial: "dark",
    options: [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }],
  },
  mazal: {
    attr: "channel",
    legend: "Channel",
    initial: "web",
    options: [{ value: "web", label: "Web" }, { value: "social", label: "Social kit" }],
  },
};

const STATUS_LABEL = { live: "Live", dev: "In development", placeholder: "Placeholder", unbranded: "Unbranded" } as const;

export interface BrandChapterProps {
  readonly brand: BrandId;
  /** Brand-specific live demos. Rendered after Applications and before Downloads. */
  readonly children?: ReactNode;
  /**
   * Replace a part with your own component, or pass null to hide it.
   * A replacement receives the same ChapterPartProps and should render its own PartFrame.
   */
  readonly overrides?: Partial<Record<ChapterPartKey, PartComponent | null>>;
  /** Extra content rendered directly after a part. */
  readonly extras?: Partial<Record<ChapterPartKey, ReactNode>>;
  /** Glass cards. Defaults to on, except Commune (sketchbook, glass is retired). */
  readonly glass?: boolean;
  /** Theme or channel switch. Defaults per brand (Academy, Commune, Mazal). false removes it. */
  readonly switcher?: ChapterSwitchConfig | false;
  readonly title?: string;
  readonly eyebrow?: string;
  readonly lead?: ReactNode;
  /**
   * Render one part only (departments sheet detail pane): a themed frame with the chapter header,
   * that part and its extras. Brand-specific children show under Applications. No SectionShell title.
   */
  readonly onlyPart?: ChapterPartKey;
}

function visibleParts(overrides: BrandChapterProps["overrides"]): readonly ChapterPartKey[] {
  return PART_ORDER.filter((k) => overrides?.[k] !== null);
}

function ChapterHeader({ brand, switcher }: { readonly brand: BrandId; readonly switcher?: ChapterSwitchConfig }) {
  const b = brandOf(brand);
  return (
    <div className="grid items-center gap-6 rounded-[var(--b-radius)] border border-[var(--b-border)] p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
      <div className="h-24 w-24 shrink-0 sm:h-28 sm:w-28">
        <ThemedLogo brand={brand} sizes="112px" />
      </div>
      <div className="min-w-0 space-y-2">
        <p className="text-xl font-semibold text-[var(--b-fg)]">{b.name}</p>
        <p className="font-mono text-sm text-[var(--b-muted)]">{b.domain ?? "Domain TBC"}</p>
        {b.tagline ? <p className="text-base text-[var(--b-fg)]">{b.tagline}</p> : null}
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{STATUS_LABEL[b.status]}</Badge>
          {b.flags.length > 0 ? <Badge tone="amber">{b.flags.length} to confirm</Badge> : null}
        </div>
      </div>
      {switcher ? <ChapterSwitch {...switcher} /> : null}
    </div>
  );
}

function SubNav({ brand, parts }: { readonly brand: BrandId; readonly parts: readonly ChapterPartKey[] }) {
  return (
    <nav
      aria-label={`${brandOf(brand).name} chapter sections`}
      className={`sticky top-[var(--topbar-h)] z-20 -mx-1 overflow-x-auto rounded-full border px-2 py-1 ${
        brand === "commune" ? "border-dashed border-[var(--b-fg)]" : "border-[var(--b-border)] backdrop-blur-md"
      }`}
      // Glass is retired for Commune: solid fill, dashed ink border, no backdrop filter.
      style={{ background: brand === "commune" ? "var(--b-bg)" : "color-mix(in srgb, var(--b-bg) 82%, transparent)" }}
    >
      <ul className="flex min-w-max items-center gap-1">
        {parts.map((k) => (
          <li key={k}>
            <a
              href={`#${partId(brand, k)}`}
              data-sfx="nav"
              className="inline-flex min-h-11 items-center rounded-full px-4 font-ui text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--b-accent)_16%,transparent)] hover:text-[var(--b-accent)]"
            >
              {PART_LABELS[k]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function PartOnlyView({
  brand, part, overrides, extras, glass, switchConfig, brandExtra,
}: {
  readonly brand: BrandId;
  readonly part: ChapterPartKey;
  readonly overrides: BrandChapterProps["overrides"];
  readonly extras: BrandChapterProps["extras"];
  readonly glass: boolean;
  readonly switchConfig?: ChapterSwitchConfig;
  readonly brandExtra: ReactNode;
}) {
  const Part = overrides?.[part] ?? DEFAULT_PARTS[part];
  return (
    <div
      id={brand}
      data-brand={brand}
      data-only-part={part}
      className={`brand-surface scroll-mt-20 space-y-8 rounded-[1.5rem] border border-[var(--b-border)] p-5 sm:p-8 lg:p-12${
        brand === "commune" ? " sk-dotted-bg" : ""
      }`}
    >
      <ChapterHeader brand={brand} switcher={switchConfig} />
      <Part brand={brand} glass={glass} />
      {extras?.[part]}
      {part === "applications" ? brandExtra : null}
    </div>
  );
}

/**
 * The complete department mini-guide. Wraps a themed SectionShell (data-brand on the section,
 * data-theme or data-channel set by the switch), a chapter header, a local sub-nav and the
 * nine parts in order. Sub-section ids are "<brand>-logo", "<brand>-color" and so on.
 */
export default function BrandChapter({
  brand,
  children,
  overrides,
  extras,
  glass,
  switcher,
  title,
  eyebrow = "Department",
  lead,
  onlyPart,
}: BrandChapterProps) {
  const b = brandOf(brand);
  const section = findSection(brand);
  const parts = visibleParts(overrides);
  const resolvedGlass = resolveGlass(brand, glass);
  const brandExtra = children ? <div data-chapter-extra="brand" className="space-y-10">{children}</div> : null;
  const switchConfig = switcher === false ? undefined : (switcher ?? DEFAULT_SWITCH[brand]);

  if (onlyPart && overrides?.[onlyPart] !== null) {
    return (
      <PartOnlyView
        brand={brand}
        part={onlyPart}
        overrides={overrides}
        extras={extras}
        glass={resolvedGlass}
        switchConfig={switchConfig}
        brandExtra={brandExtra}
      />
    );
  }

  return (
    <SectionShell
      id={brand}
      num={section?.num}
      eyebrow={eyebrow}
      title={title ?? b.name}
      lead={lead ?? b.descriptor}
      brand={brand}
    >
      <ChapterHeader brand={brand} switcher={switchConfig} />
      <SubNav brand={brand} parts={parts} />
      {parts.map((key) => {
        const Part = overrides?.[key] ?? DEFAULT_PARTS[key];
        return (
          <Fragment key={key}>
            {key === "downloads" ? brandExtra : null}
            <Part brand={brand} glass={resolvedGlass} />
            {extras?.[key]}
          </Fragment>
        );
      })}
      {parts.includes("downloads") ? null : brandExtra}
    </SectionShell>
  );
}
