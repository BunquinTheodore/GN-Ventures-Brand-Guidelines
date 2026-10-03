"use client";

import { useRef } from "react";
import { BRANDS } from "@/content/brands";
import { cn } from "@/lib/utils";
import { columnLetter, DEPARTMENTS } from "./selection";
import type { CellRef, DepartmentId } from "./selection";

export const tabId = (brand: DepartmentId) => `dept-tab-${brand}`;
export const DETAIL_ID = "departments-detail";

interface SheetTabsProps {
  readonly cell: CellRef;
  readonly onSelect: (next: CellRef) => void;
}

/** Excel-style sheet tabs, one per department. Left, Right, Home and End move between tabs. */
export default function SheetTabs({ cell, onSelect }: SheetTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function go(index: number) {
    const brand = DEPARTMENTS[(index + DEPARTMENTS.length) % DEPARTMENTS.length];
    onSelect({ brand, part: cell.part });
    listRef.current?.querySelector<HTMLElement>(`#${tabId(brand)}`)?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const here = DEPARTMENTS.indexOf(cell.brand);
    const target = ({ ArrowRight: here + 1, ArrowLeft: here - 1, Home: 0, End: DEPARTMENTS.length - 1 } as Record<string, number>)[e.key];
    if (target === undefined) return;
    e.preventDefault();
    go(target);
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Departments"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className="-mx-2 flex items-end gap-1 overflow-x-auto px-2 pb-1 pt-2"
    >
      {DEPARTMENTS.map((brand) => {
        const b = BRANDS[brand];
        const on = brand === cell.brand;
        return (
          <button
            key={brand}
            id={tabId(brand)}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={DETAIL_ID}
            tabIndex={on ? 0 : -1}
            data-sfx="nav"
            data-tab={brand}
            onClick={() => onSelect({ brand, part: cell.part })}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-t-lg border border-b-0 px-4 font-ui text-[0.8125rem] font-medium uppercase tracking-[0.1em] transition-colors",
              brand === "commune" ? "border-dashed" : "border-solid",
              on
                ? "border-t-[3px] bg-[color-mix(in_srgb,var(--raised)_92%,var(--lime))] text-[var(--fog)]"
                : "border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--raised)_55%,transparent)] text-[var(--fog-dim)] hover:text-[var(--fog)]",
            )}
            style={on ? { borderColor: b.accent } : undefined}
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-[color-mix(in_srgb,#fff_35%,transparent)]" style={{ background: b.accent }} />
            <span aria-hidden="true" className="font-mono text-xs tracking-normal text-[var(--fog-dim)]">{columnLetter(brand)}</span>
            {b.name}
          </button>
        );
      })}
    </div>
  );
}
