"use client";

import { useEffect } from "react";

/**
 * One shared observer for every shine surface. Marks `.gn-shine` elements with
 * data-visible="1" while they are in (or near) the viewport so CSS only runs the
 * sweep animation for what is on screen, and mirrors document.hidden onto <html>
 * (data-doc-hidden) so every sweep pauses in background tabs.
 *
 * Singleton: any number of callers share one IntersectionObserver and one
 * MutationObserver. Without JS or IntersectionObserver the CSS keeps the static
 * highlight (sweep stays paused), which is the safe fallback.
 */

const SELECTOR = ".gn-shine:not(.gn-btn)";
const ROOT_MARGIN = "120px 0px";
const STAGGER_STEP_S = 1.37;
const STAGGER_CYCLE_S = 7;

let started = false;

function start(): void {
  if (started || typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
  started = true;

  const root = document.documentElement;
  const seen = new WeakSet<Element>();
  let index = 0;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) el.setAttribute("data-visible", "1");
        else el.removeAttribute("data-visible");
      }
    },
    { rootMargin: ROOT_MARGIN },
  );

  const adopt = (el: HTMLElement): void => {
    if (seen.has(el)) return;
    seen.add(el);
    // Negative delay starts each card mid-cycle, so they never sweep in lockstep.
    if (!el.style.getPropertyValue("--gn-shine-delay")) {
      el.style.setProperty("--gn-shine-delay", `-${((index * STAGGER_STEP_S) % STAGGER_CYCLE_S).toFixed(2)}s`);
    }
    index += 1;
    io.observe(el);
  };

  const scan = (): void => {
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach(adopt);
  };

  let scheduled = false;
  const mo = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      scan();
    });
  });

  const syncHidden = (): void => {
    if (document.hidden) root.setAttribute("data-doc-hidden", "1");
    else root.removeAttribute("data-doc-hidden");
  };

  scan();
  syncHidden();
  mo.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("visibilitychange", syncHidden);
}

/** Starts the shared shine observer once for the whole page. */
export function useShineVisibility(): void {
  useEffect(() => {
    start();
  }, []);
}
