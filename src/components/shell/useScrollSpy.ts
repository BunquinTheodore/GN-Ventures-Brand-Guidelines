"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SECTION_IDS } from "@/content/nav";
import { activeSection } from "@/lib/active-section";

const BOTTOM_SLACK_PX = 6;
const TOP_RESET_PX = 8;
/** A thin band near the top of the viewport decides which section is "current". */
const SPY_MARGIN = "-14% 0px -72% 0px";

/** Subscribe to the active section id (SSR-safe, starts at the first section). */
export function useActiveSection(): string {
  return useSyncExternalStore(
    activeSection.subscribe,
    activeSection.get,
    () => SECTION_IDS[0],
  );
}

/** Observe every section and publish the current one through activeSection. Mount once. */
export function useScrollSpy(ids: readonly string[] = SECTION_IDS): void {
  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        const first = ids.find((id) => inBand.has(id));
        if (first) activeSection.set(first);
      },
      { rootMargin: SPY_MARGIN, threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - BOTTOM_SLACK_PX;
      if (atBottom) activeSection.set(elements[elements.length - 1].id);
      else if (window.scrollY < TOP_RESET_PX) activeSection.set(elements[0].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);
}
