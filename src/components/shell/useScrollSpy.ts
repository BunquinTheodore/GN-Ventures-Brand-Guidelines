"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SECTION_IDS } from "@/content/nav";
import { activeSection } from "@/lib/active-section";

const DEPARTMENT_IDS = ["media", "academy", "club", "labs", "mazal", "commune"] as const;
const BOTTOM_SLACK_PX = 6;
const TOP_RESET_PX = 8;
/** A thin band near the top of the viewport decides which section is "current". */
const SPY_MARGIN = "-14% 0px -72% 0px";

const spyId = (el: Element): string => (el as HTMLElement).dataset.spy ?? el.id;

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
    // Department chapter ids are lazy and only exist for the selected department, so they are
    // never observed; the stable #departments section stands in for all of them.
    // Deferred sections swap a placeholder for the real section, so they expose a stable wrapper
    // (data-spy) that outlives the swap; the first sections are plain elements with an id.
    const elements = ids
      .filter((id) => !(DEPARTMENT_IDS as readonly string[]).includes(id))
      .map((id) => document.querySelector<HTMLElement>(`[data-spy="${id}"]`) ?? document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = spyId(entry.target);
          if (entry.isIntersecting) inBand.add(id);
          else inBand.delete(id);
        }
        const first = ids.find((id) => inBand.has(id));
        if (first) activeSection.set(first);
      },
      { rootMargin: SPY_MARGIN, threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - BOTTOM_SLACK_PX;
      if (atBottom) activeSection.set(spyId(elements[elements.length - 1]));
      else if (window.scrollY < TOP_RESET_PX) activeSection.set(spyId(elements[0]));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);
}
