import type { ReactNode } from "react";
import { Badge, CopyChip } from "@/components/ui";
import type { Brand } from "@/content/types";
import { Card, DISPLAY_CLS, PartFrame, SubHeading, brandOf, resolveGlass, type ChapterPartProps } from "./shared";

const STATUS_LABEL: Readonly<Record<Brand["status"], string>> = {
  live: "Live",
  dev: "In development",
  placeholder: "Placeholder",
  unbranded: "Unbranded",
};

function Fact({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-4">
      <dt className="mb-1 font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]">{label}</dt>
      <dd className="text-base text-[var(--b-fg)]">{children}</dd>
    </div>
  );
}

/** What the brand is: tagline, descriptor, key facts and the open decisions about it. */
export default function ChapterEssence({ brand: id, glass: g, className }: ChapterPartProps) {
  const brand = brandOf(id);
  const glass = resolveGlass(id, g);
  const radius = brand.ui.find((r) => r.label === "Radius")?.value;
  return (
    <PartFrame
      brand={id}
      part="essence"
      title="Essence"
      lead="What this brand is, in the words the owner and its own site already use."
      className={className}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Card brand={id} glass={glass} className="flex flex-col justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{STATUS_LABEL[brand.status]}</Badge>
            <Badge tone="neutral">{brand.domain ?? "Domain TBC"}</Badge>
          </div>
          <p className={`text-[clamp(1.75rem,3.4vw,2.75rem)] text-[var(--b-fg)] ${DISPLAY_CLS}`}>
            {brand.tagline ?? "No official tagline yet"}
          </p>
          {brand.tagline ? null : <Badge tone="amber" className="self-start">TBC</Badge>}
          <p className="max-w-prose text-base leading-relaxed text-[var(--b-muted)]">{brand.descriptor}</p>
        </Card>
        <dl className="grid content-start gap-3 sm:grid-cols-2">
          <Fact label="Domain">{brand.domain ?? "TBC"}</Fact>
          <Fact label="Status">{STATUS_LABEL[brand.status]}</Fact>
          <Fact label="Accent">
            <CopyChip value={brand.accent.toUpperCase()} label={`Copy ${brand.name} accent`} />
          </Fact>
          <Fact label="Corner radius">{radius ?? "See components"}</Fact>
          <div className="sm:col-span-2">
            <Fact label="Typefaces">{brand.fonts.map((f) => f.family).join(", ")}</Fact>
          </div>
        </dl>
      </div>
      {brand.flags.length > 0 ? (
        <div>
          <SubHeading>To confirm</SubHeading>
          <ul className="grid gap-3 md:grid-cols-2">
            {brand.flags.map((flag) => (
              <li
                key={flag}
                className="flex items-start gap-3 rounded-[var(--b-radius)] border border-[var(--b-border)] p-4 text-[0.9375rem] leading-relaxed text-[var(--b-fg)]"
              >
                <Badge tone="amber" className="mt-0.5 shrink-0">Flag</Badge>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </PartFrame>
  );
}
