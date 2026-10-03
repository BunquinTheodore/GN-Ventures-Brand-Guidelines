import type { ReactNode } from "react";
import type { BrandId } from "@/content/types";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  readonly id: string;
  readonly num?: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: ReactNode;
  /** Re-themes the whole section to a department (sets data-brand and paints its surface). */
  readonly brand?: BrandId;
  readonly children?: ReactNode;
  readonly className?: string;
  /** Unmounted Deferred stub: heading only, so it is not exposed as an empty labelled landmark. */
  readonly placeholder?: boolean;
}

/**
 * Numbered section frame. Header is a balanced two column grid (title left, lead right).
 * Below-the-fold sections are mounted lazily by Deferred (measured placeholder heights), so no
 * content-visibility tricks are needed here.
 */
export default function SectionShell({ id, num, eyebrow, title, lead, brand, children, className, placeholder }: SectionShellProps) {
  const themed = brand !== undefined && brand !== "ventures";
  return (
    <section
      id={id}
      data-brand={brand}
      aria-labelledby={placeholder ? undefined : `${id}-title`}
      aria-busy={placeholder || undefined}
      className={cn(
        "mb-[var(--section-gap)] scroll-mt-20",
        themed && "brand-surface rounded-[1.5rem] border border-[var(--b-border)] p-5 sm:p-8 lg:p-12",
        brand === "commune" && "sk-dotted-bg",
        className,
      )}
    >
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
        <div>
          <p className="gn-eyebrow mb-4 flex items-center gap-3">
            {num ? <span className="font-mono text-[var(--b-muted)]">{num}</span> : null}
            <span aria-hidden="true" className="h-px w-8 bg-[var(--b-accent)]" />
            <span>{eyebrow}</span>
          </p>
          <h2 id={`${id}-title`} className="text-[clamp(2rem,4.6vw,3.5rem)]">
            {title}
          </h2>
        </div>
        {lead ? (
          <div className="max-w-prose text-base leading-relaxed text-[var(--b-muted)] md:text-lg">{lead}</div>
        ) : null}
      </header>
      <div className="mt-10 space-y-10 md:mt-14 md:space-y-14">{children}</div>
    </section>
  );
}
