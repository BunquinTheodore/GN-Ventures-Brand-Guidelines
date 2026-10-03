import { BRANDS } from "@/content/brands";
import { PART_LABELS } from "../brands/parts/shared";
import { cellName, PART_PURPOSE } from "./selection";
import type { CellRef } from "./selection";

/** Excel-style formula bar: a name box with the cell reference, then the formula and the part's purpose. */
export default function FormulaBar({ cell }: { readonly cell: CellRef }) {
  const brandName = BRANDS[cell.brand].name;
  const part = PART_LABELS[cell.part];
  return (
    <div className="gn-glass gn-shine flex flex-col overflow-hidden sm:flex-row sm:items-stretch">
      <output
        aria-label="Selected cell"
        data-testid="name-box"
        className="flex min-h-11 w-full items-center justify-center border-b border-[var(--glass-border)] px-4 font-mono text-base font-semibold text-[var(--lime)] sm:w-24 sm:border-b-0 sm:border-r"
      >
        {cellName(cell)}
      </output>
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-2.5 md:flex-row md:items-center md:gap-5">
        <p className="flex min-w-0 items-center gap-2 text-base text-[var(--fog)]">
          <span aria-hidden="true" className="font-mono text-sm italic text-[var(--fog-dim)]">fx</span>
          <span data-testid="formula" className="truncate font-mono">
            {brandName}
            <span aria-hidden="true">{" \u203A "}</span>
            <span className="sr-only">, part </span>
            {part}
          </span>
        </p>
        <p className="text-base leading-snug text-[var(--fog-dim)]">{PART_PURPOSE[cell.part]}</p>
      </div>
    </div>
  );
}
