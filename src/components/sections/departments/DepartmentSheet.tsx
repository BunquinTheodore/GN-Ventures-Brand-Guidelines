"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { SectionShell } from "@/components/ui";
import { findSection } from "@/content/nav";
import type { ChapterPartKey } from "../brands/parts/shared";
import FormulaBar from "./FormulaBar";
import SheetGrid from "./SheetGrid";
import SheetTabs, { DETAIL_ID, tabId } from "./SheetTabs";
import { prefersReducedMotion, useSheetSelection } from "./useSheetSelection";
import { cellKey } from "./selection";
import type { DepartmentId } from "./selection";

type ChapterComponent = ComponentType<{ readonly onlyPart?: ChapterPartKey }>;

function DetailLoading() {
  return (
    <div role="status" aria-busy="true" className="gn-glass min-h-[24rem]">
      <span className="sr-only">Loading</span>
    </div>
  );
}

const loading = () => <DetailLoading />;

/** Only the selected department's chapter is mounted, and its code loads on demand. */
const CHAPTERS: Readonly<Record<DepartmentId, ChapterComponent>> = {
  media: dynamic(() => import("../brands/MediaChapter"), { loading }),
  academy: dynamic(() => import("../brands/AcademyChapter"), { loading }),
  club: dynamic(() => import("../brands/ClubChapter"), { loading }),
  labs: dynamic(() => import("../brands/LabsChapter"), { loading }),
  mazal: dynamic(() => import("../brands/MazalChapter"), { loading }),
  commune: dynamic(() => import("../brands/CommuneChapter"), { loading }),
};

const LEAD =
  "Departments run left to right, the nine parts run top to bottom. Pick a tab or a cell and the full part opens below, in that department's own tokens.";

/**
 * One spreadsheet for the six departments: X axis is the department, Y axis is the part.
 * Select with the tabs, the headers or a cell. Deep links look like #academy-color.
 */
export default function DepartmentSheet() {
  const { cell, select, detailRef } = useSheetSelection();
  const Chapter = CHAPTERS[cell.brand];

  function focusDetail() {
    const el = detailRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  /** Escape in the detail pane returns focus to the active sheet cell. */
  function onDetailKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Escape" || e.target !== e.currentTarget) return;
    document.querySelector<HTMLElement>(`[data-cell="${cellKey(cell)}"]`)?.focus();
  }

  return (
    <SectionShell
      id="departments"
      num={findSection("departments")?.num}
      eyebrow="Departments sheet"
      title="Every department, every part"
      lead={LEAD}
    >
      <div className="space-y-4">
        <SheetTabs cell={cell} onSelect={select} />
        <FormulaBar cell={cell} />
        <SheetGrid cell={cell} onSelect={select} onEnter={focusDetail} />
      </div>
      <div
        ref={detailRef}
        id={DETAIL_ID}
        role="tabpanel"
        aria-labelledby={tabId(cell.brand)}
        tabIndex={-1}
        onKeyDown={onDetailKeyDown}
        className="scroll-mt-24 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--lime)]"
      >
        <Chapter onlyPart={cell.part} />
      </div>
    </SectionShell>
  );
}
