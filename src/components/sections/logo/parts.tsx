import Image from "next/image";
import type { ReactNode } from "react";
import { getAsset } from "@/content/assets";
import { cn } from "@/lib/utils";

interface LogoImgProps {
  readonly id: string;
  readonly alt: string;
  readonly className?: string;
  readonly sizes?: string;
  readonly priority?: boolean;
}

/** Real logo file from the asset registry. Renders a labelled placeholder if the id is unknown. */
export function LogoImg({ id, alt, className, sizes = "(min-width: 1024px) 28vw, 80vw", priority }: LogoImgProps) {
  const asset = getAsset(id);
  if (!asset) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("grid place-items-center border border-dashed border-[var(--b-border)] p-4 text-center text-sm text-[var(--b-muted)]", className)}
      >
        Asset missing: {id}
      </div>
    );
  }
  return (
    <Image
      src={asset.file}
      alt={alt}
      width={asset.width ?? 1024}
      height={asset.height ?? 1024}
      sizes={sizes}
      priority={priority}
      unoptimized={asset.format === "svg" || asset.format === "ico"}
      className={cn("select-none", className ?? "h-auto w-full")}
      draggable={false}
    />
  );
}

interface TableProps {
  readonly caption: string;
  readonly head: readonly string[];
  readonly rows: readonly (readonly ReactNode[])[];
}

/** Compact usage table with horizontal scroll on narrow screens. */
export function SpecTable({ caption, head, rows }: TableProps) {
  return (
    <div className="gn-glass overflow-x-auto" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm md:text-base">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-[var(--b-border)]">
            {head.map((h) => (
              <th key={h} scope="col" className="gn-eyebrow px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--b-border)] align-top last:border-0">
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

/** Small heading inside a section body. */
export function SubHead({ children, aside }: { readonly children: ReactNode; readonly aside?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <h3 className="font-ui text-lg font-semibold tracking-[0.04em] text-[var(--b-fg)] md:text-xl">{children}</h3>
      {aside}
    </div>
  );
}

/** Frame class for demo stages. */
export const STAGE_BASE =
  "relative grid place-items-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)]";
