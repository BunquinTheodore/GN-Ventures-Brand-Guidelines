"use client";

import Deferred from "@/components/ui/Deferred";
import { findSection, NAV_PARTS } from "@/content/nav";

/**
 * Below-the-fold sections, in page order. Heights are MEASURED from the production build
 * (every section mounted, Downloads showing its first page of 24 cards, lazy images loaded, headless Chrome) at viewport widths
 * 375, 640, 768, 1024, 1280 and 1536 px. Re-measure after any content change with `node scripts/measure-heights.mjs --check`; a stale
 * value only costs a small layout shift when the real section mounts, never a wrong anchor.
 */
const SECTIONS = [
  { id: "logo", heights: [2713, 2222, 2114, 2664, 2206, 1838], load: () => import("@/components/sections/logo/Logo") },
  { id: "clear-space", heights: [2389, 2403, 2472, 1734, 1453, 1365], load: () => import("@/components/sections/logo/ClearSpace") },
  { id: "lockups", heights: [3288, 1944, 2105, 1997, 1521, 1553], load: () => import("@/components/sections/logo/Lockups") },
  { id: "mark", heights: [3843, 2797, 2528, 1638, 1537, 1585], load: () => import("@/components/sections/logo/Mark") },
  { id: "placement", heights: [4008, 2821, 2806, 2549, 2041, 2159], load: () => import("@/components/sections/logo/Placement") },
  { id: "misuse", heights: [3102, 1784, 1790, 1773, 1262, 1294], load: () => import("@/components/sections/logo/Misuse") },
  { id: "color-core", heights: [5739, 4392, 4039, 3232, 2758, 2548], load: () => import("@/components/sections/foundations/ColorCore") },
  { id: "color-ink", heights: [4931, 3999, 3893, 3305, 2917, 2801], load: () => import("@/components/sections/foundations/ColorInk") },
  { id: "typography", heights: [3853, 3372, 2416, 2919, 2236, 1915], load: () => import("@/components/sections/foundations/Typography") },
  { id: "type-scale", heights: [3307, 2750, 2862, 2587, 2260, 2044], load: () => import("@/components/sections/foundations/TypeScale") },
  { id: "numbers", heights: [3155, 1992, 2084, 1817, 1351, 1216], load: () => import("@/components/sections/foundations/Numbers") },
  { id: "spacing", heights: [2817, 2523, 2477, 2164, 1960, 1896], load: () => import("@/components/sections/foundations/Spacing") },
  { id: "motion", heights: [2935, 2544, 2505, 2039, 1766, 1640], load: () => import("@/components/sections/foundations/Motion") },
  { id: "voice", heights: [4824, 3918, 3090, 3028, 2486, 2313], load: () => import("@/components/sections/system/Voice") },
  { id: "imagery", heights: [3757, 3637, 4016, 1761, 1620, 1685], load: () => import("@/components/sections/system/Imagery") },
  { id: "components", heights: [2960, 2248, 2224, 1948, 1569, 1385], load: () => import("@/components/sections/system/Components") },
  { id: "presentations", heights: [2664, 2570, 1920, 1799, 1416, 1269], load: () => import("@/components/sections/system/Presentations") },
  { id: "applications", heights: [5435, 6413, 3611, 2723, 2247, 2309], load: () => import("@/components/sections/system/Applications") },
  { id: "compliance", heights: [2997, 2448, 2301, 1805, 1663, 1623], load: () => import("@/components/sections/system/Compliance") },
  { id: "family", heights: [5133, 3547, 3299, 3378, 2623, 2455], load: () => import("@/components/sections/Family") },
  { id: "departments", heights: [2945, 2333, 2364, 2305, 2194, 2195], load: () => import("@/components/sections/departments/DepartmentSheet") },
  { id: "fonts", heights: [10690, 9008, 8883, 9079, 5372, 5031], load: () => import("@/components/sections/Fonts") },
  { id: "downloads", heights: [13776, 8404, 7475, 6808, 5896, 4786], load: () => import("@/components/sections/Downloads") },
] as const;

const PART_TITLE_BY_SECTION: ReadonlyMap<string, string> = new Map(
  NAV_PARTS.flatMap((part) => part.sections.map((section) => [section.id, part.title] as const)),
);

/** Every section after the first two. Server renders only headings at the right height for these. */
export default function DeferredSections() {
  return (
    <>
      {SECTIONS.map((s, order) => {
        const nav = findSection(s.id);
        return (
          <Deferred
            key={s.id}
            id={s.id}
            num={nav?.num}
            eyebrow={PART_TITLE_BY_SECTION.get(s.id) ?? "Brand guidelines"}
            title={nav?.title ?? s.id}
            order={order}
            heights={s.heights}
            load={s.load}
          />
        );
      })}
    </>
  );
}
