import Image from "next/image";
import type { ReactNode } from "react";
import { getAsset } from "@/content/assets";
import { cn } from "@/lib/utils";

export type DeptId = "media" | "academy" | "club" | "labs" | "mazal" | "commune";

export interface Department {
  readonly id: DeptId;
  readonly name: string;
  readonly tagline: string;
  /** Asset id of a logo that reads on the department's own surface. */
  readonly logoId: string;
  /** Asset id of the 1024 app icon. */
  readonly iconId: string;
  readonly cta: string;
}

/** The six departments. Taglines come straight from docs/BRAND-SPEC.md section 2. */
export const DEPARTMENTS: readonly Department[] = [
  { id: "media", name: "GN Media", tagline: "News. Insights. Future.", logoId: "media-horizontal", iconId: "media-app-icon-1024", cta: "Inquire for rates" },
  { id: "academy", name: "GN Academy", tagline: "Learn. Prove. Get hired.", logoId: "academy-on-light", iconId: "academy-app-icon-1024", cta: "Take the free AI Readiness Test" },
  { id: "club", name: "GN Club", tagline: "Activations · Events · Full Production · Global Experience", logoId: "club-horizontal", iconId: "club-app-icon-1024", cta: "Plan an activation" },
  { id: "labs", name: "GN Labs", tagline: "AI integration for business", logoId: "labs-horizontal", iconId: "labs-app-icon-1024", cta: "Book a consultation" },
  { id: "mazal", name: "Mazal", tagline: "it's more fun in mazal!", logoId: "mazal-mark", iconId: "mazal-app-icon-1024", cta: "Join Mazal" },
  { id: "commune", name: "GN Commune", tagline: "A little cafe on wheels, for your big day.", logoId: "commune-mono-white", iconId: "commune-app-icon-1024", cta: "Book the cart" },
];

interface LogoImgProps {
  readonly id: string;
  readonly alt: string;
  readonly className?: string;
  readonly sizes?: string;
}

/** Sized logo from the asset registry. Renders nothing if the asset id is unknown. */
export function LogoImg({ id, alt, className, sizes = "200px" }: LogoImgProps) {
  const asset = getAsset(id);
  if (!asset) return null;
  return (
    <Image
      src={asset.file}
      alt={alt}
      width={asset.width ?? 512}
      height={asset.height ?? 512}
      sizes={sizes}
      className={cn("h-auto select-none", className)}
      draggable={false}
    />
  );
}

interface CardTitleProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly badge?: ReactNode;
}

/** Small heading used inside demo cards. */
export function CardTitle({ eyebrow, title, badge }: CardTitleProps) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div>
        {eyebrow ? <p className="gn-eyebrow mb-1 text-[0.75rem]">{eyebrow}</p> : null}
        <h3 className="text-lg text-[var(--b-fg)]">{title}</h3>
      </div>
      {badge}
    </div>
  );
}

interface TableProps {
  readonly caption: string;
  readonly head: readonly string[];
  readonly rows: readonly (readonly ReactNode[])[];
  readonly className?: string;
}

/** Compact, accessible usage table with a horizontally scrollable wrapper on phones. */
export function UsageTable({ caption, head, rows, className }: TableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-[var(--b-radius)] border border-[var(--b-border)]", className)}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-[color-mix(in_srgb,var(--b-fg)_6%,transparent)]">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-ui text-[0.75rem] font-medium uppercase tracking-[0.1em] text-[var(--b-muted)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-[var(--b-border)] align-top">
              {row.map((cell, j) => (
                <td key={j} className={cn("px-4 py-3", j === 0 ? "font-medium text-[var(--b-fg)]" : "text-[var(--b-muted)]")}>
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
