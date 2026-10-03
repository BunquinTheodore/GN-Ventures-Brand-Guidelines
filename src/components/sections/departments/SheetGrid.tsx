"use client";

import { memo, useRef } from "react";
import type { CSSProperties } from "react";
import { BRANDS } from "@/content/brands";
import { cn } from "@/lib/utils";
import { PART_LABELS, PART_ORDER } from "../brands/parts/shared";
import type { ChapterPartKey } from "../brands/parts/shared";
import CellPreview, { cellSummary } from "./cellPreview";
import { DETAIL_ID } from "./SheetTabs";
import {
  cellKey, cellName, columnLetter, DEPARTMENTS, moveCell, rowEdge, rowNumber, sameCell, sheetCorner,
} from "./selection";
import type { CellRef, DepartmentId } from "./selection";

interface SheetGridProps {
  readonly cell: CellRef;
  readonly onSelect: (next: CellRef) => void;
  readonly onEnter: () => void;
}

type Select = (next: CellRef) => void;

const HEAD_CLS =
  "dsheet-head flex min-h-11 items-center gap-2 px-3 font-ui text-[0.8125rem] font-medium uppercase tracking-[0.1em] transition-colors";

const accentVar = (brand: DepartmentId) => ({ "--dsheet-accent": BRANDS[brand].accent }) as CSSProperties;

function nextCell(e: React.KeyboardEvent, cell: CellRef): CellRef | null {
  const ctrl = e.ctrlKey || e.metaKey;
  switch (e.key) {
    case "ArrowRight": return moveCell(cell, 1, 0);
    case "ArrowLeft": return moveCell(cell, -1, 0);
    case "ArrowDown": return moveCell(cell, 0, 1);
    case "ArrowUp": return moveCell(cell, 0, -1);
    case "Home": return ctrl ? sheetCorner(false) : rowEdge(cell, false);
    case "End": return ctrl ? sheetCorner(true) : rowEdge(cell, true);
    default: return null;
  }
}

function ColumnHeader({ brand, cell, onSelect }: { readonly brand: DepartmentId; readonly cell: CellRef; readonly onSelect: Select }) {
  const on = brand === cell.brand;
  return (
    <div role="columnheader" aria-colindex={DEPARTMENTS.indexOf(brand) + 2} aria-selected={on} className="dsheet-colhead-wrap">
      <button
        type="button"
        tabIndex={-1}
        data-sfx="nav"
        data-col={brand}
        data-selected={on}
        onClick={() => onSelect({ brand, part: cell.part })}
        className={cn(HEAD_CLS, "dsheet-colhead h-full w-full", brand === "commune" && "dsheet-ink")}
        style={accentVar(brand)}
      >
        <span className="font-mono tracking-normal text-[var(--fog-dim)]">{columnLetter(brand)}</span>
        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full border border-[color-mix(in_srgb,#fff_35%,transparent)]" style={{ background: BRANDS[brand].accent }} />
        <span className="truncate">{BRANDS[brand].name}</span>
      </button>
    </div>
  );
}

/** Memoized: a selection change re-renders only the two cells whose `on` flag flips, not all 54. */
const GridCell = memo(function GridCell({ brand, part, on, onSelect }: { readonly brand: DepartmentId; readonly part: ChapterPartKey; readonly on: boolean; readonly onSelect: Select }) {
  const here: CellRef = { brand, part };
  return (
    <button
      type="button"
      role="gridcell"
      aria-colindex={DEPARTMENTS.indexOf(brand) + 2}
      aria-selected={on}
      aria-label={`${cellName(here)}, ${BRANDS[brand].name}, ${PART_LABELS[part]}: ${cellSummary(brand, part)}`}
      tabIndex={on ? 0 : -1}
      data-sfx="nav"
      data-cell={cellKey(here)}
      data-selected={on}
      onClick={() => onSelect(here)}
      className={cn("dsheet-cell", brand === "commune" && "dsheet-ink")}
      style={accentVar(brand)}
    >
      <CellPreview brand={brand} part={part} />
      {on ? <span aria-hidden="true" className="dsheet-handle" /> : null}
    </button>
  );
});

function Row({ part, cell, onSelect }: { readonly part: ChapterPartKey; readonly cell: CellRef; readonly onSelect: Select }) {
  const n = rowNumber(part);
  const rowOn = part === cell.part;
  return (
    <div role="row" aria-rowindex={n + 1} className="dsheet-row">
      <div role="rowheader" aria-colindex={1} aria-selected={rowOn} className="dsheet-rowhead-wrap">
        <button
          type="button"
          tabIndex={-1}
          data-sfx="nav"
          data-row={part}
          data-selected={rowOn}
          onClick={() => onSelect({ brand: cell.brand, part })}
          className={cn(HEAD_CLS, "dsheet-rowhead h-full w-full")}
        >
          <span className="font-mono tracking-normal text-[var(--fog-dim)]">{n}</span>
          <span className="truncate">{PART_LABELS[part]}</span>
        </button>
      </div>
      {DEPARTMENTS.map((brand) => (
        <GridCell key={brand} brand={brand} part={part} on={sameCell({ brand, part }, cell)} onSelect={onSelect} />
      ))}
    </div>
  );
}

/**
 * The spreadsheet: departments on the X axis (columns A to F), the nine parts on the Y axis (rows 1 to 9).
 * The first column is sticky so row headers stay visible while the grid scrolls sideways.
 */
export default function SheetGrid({ cell, onSelect, onEnter }: SheetGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEnter();
      return;
    }
    const next = nextCell(e, cell);
    if (!next) return;
    e.preventDefault();
    onSelect(next);
    gridRef.current?.querySelector<HTMLElement>(`[data-cell="${cellKey(next)}"]`)?.focus();
  }

  return (
    <div className="gn-glass gn-shine overflow-hidden">
      <div className="dsheet-scroll overflow-x-auto">
        <div
          ref={gridRef}
          role="grid"
          aria-label="Departments by parts"
          aria-rowcount={PART_ORDER.length + 1}
          aria-colcount={DEPARTMENTS.length + 1}
          onKeyDown={onKeyDown}
          className="dsheet-grid"
        >
          <div role="row" aria-rowindex={1} className="dsheet-row dsheet-row-head">
            <div role="columnheader" aria-colindex={1} className="dsheet-corner dsheet-rowhead-wrap">
              <span className="sr-only">Parts</span>
              <span aria-hidden="true" className="font-mono text-xs text-[var(--fog-dim)]">Parts</span>
            </div>
            {DEPARTMENTS.map((brand) => (
              <ColumnHeader key={brand} brand={brand} cell={cell} onSelect={onSelect} />
            ))}
          </div>
          {PART_ORDER.map((part) => (
            <Row key={part} part={part} cell={cell} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
