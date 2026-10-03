import type { ReactNode } from "react";
import { Badge } from "@/components/ui";
import { SubHeading } from "../parts/shared";

interface BlockProps {
  readonly title: string;
  readonly lead?: ReactNode;
  readonly badge?: string;
  readonly children: ReactNode;
}

/** Titled group inside the Academy chapter. Heading, optional Proposed-style badge, explanatory lead. */
export default function Block({ title, lead, badge, children }: BlockProps) {
  return (
    <section aria-label={title} className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="flex flex-wrap items-center gap-3">
          <SubHeading>{title}</SubHeading>
          {badge ? <Badge tone="amber">{badge}</Badge> : null}
        </div>
        {lead ? <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-[var(--b-muted)]">{lead}</p> : null}
      </div>
      {children}
    </section>
  );
}
