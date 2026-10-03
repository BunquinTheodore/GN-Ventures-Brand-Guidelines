import type { ReactNode } from "react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

/** Small shared pieces for the foundation sections. Server-safe, no state. */

interface SubHeadProps {
  readonly title: string;
  readonly note?: ReactNode;
  readonly proposed?: boolean;
}

export function SubHead({ title, note, proposed = false }: SubHeadProps) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
      <h3 className="text-xl md:text-2xl">{title}</h3>
      {proposed ? <Badge tone="amber">Proposed</Badge> : null}
      {note ? <p className="w-full max-w-3xl text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">{note}</p> : null}
    </div>
  );
}

export type SourceKind = "Sourced" | "Proposed" | "As built" | "TBC";

const SOURCE_TONE = { Sourced: "accent", Proposed: "amber", "As built": "cyan", TBC: "neutral" } as const;

export function SourceBadge({ kind }: { readonly kind: SourceKind }) {
  return <Badge tone={SOURCE_TONE[kind]}>{kind}</Badge>;
}

interface SpecTableProps {
  readonly caption: string;
  readonly head: readonly string[];
  readonly rows: readonly (readonly ReactNode[])[];
  readonly minWidth?: string;
  readonly className?: string;
}

/** Compact usage table inside a horizontally scrollable, bordered frame. */
export function SpecTable({ caption, head, rows, minWidth = "36rem", className }: SpecTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-[var(--b-radius)] border border-[var(--b-border)]", className)}>
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-[var(--b-border)] font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">
            {head.map((h) => (
              <th key={h} scope="col" className="p-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--b-border)] align-top last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={cn("p-3", j === 0 ? "font-medium text-[var(--b-fg)]" : "text-[var(--b-muted)]")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Round color dot plus mono hex, for table cells. */
export function Dot({ hex, label }: { readonly hex: string; readonly label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        aria-hidden="true"
        className="h-4 w-4 rounded-full border border-[var(--b-border)]"
        style={{ background: hex }}
      />
      <span className="font-mono text-xs text-[var(--b-fg)]">{label ?? hex.toUpperCase()}</span>
    </span>
  );
}

/** Two column responsive grid used by most blocks. */
export function Split({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return <div className={cn("grid gap-5 lg:grid-cols-2", className)}>{children}</div>;
}
