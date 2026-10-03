"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cellHash, DEFAULT_CELL, parseHash } from "./selection";
import type { CellRef } from "./selection";

export interface SheetSelection {
  readonly cell: CellRef;
  /** Select a cell from user input: updates the URL fragment without a scroll jump. */
  readonly select: (next: CellRef) => void;
  /** Detail pane element, scrolled into view after a deep link. */
  readonly detailRef: React.RefObject<HTMLDivElement | null>;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Selected cell state. The server render uses media/essence. On mount and on hashchange a fragment
 * of the form "#brand" or "#brand-part" selects that cell and scrolls the detail pane into view.
 */
export function useSheetSelection(): SheetSelection {
  const [cell, setCell] = useState<CellRef>(DEFAULT_CELL);
  const [scrollNonce, setScrollNonce] = useState(0);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = () => {
      const target = parseHash(window.location.hash);
      if (!target) return;
      setCell(target);
      setScrollNonce((n) => n + 1);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    if (scrollNonce === 0) return;
    const id = window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [scrollNonce]);

  const select = useCallback((next: CellRef) => {
    setCell(next);
    try {
      window.history.replaceState(null, "", cellHash(next));
    } catch {
      // History can be unavailable in sandboxed frames; the selection still works without the URL.
    }
  }, []);

  return { cell, select, detailRef };
}
