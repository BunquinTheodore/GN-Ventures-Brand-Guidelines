import type { NavPart, NavSection } from "./types";

const s = (num: number, id: string, title: string, brand: NavSection["brand"] = "ventures"): NavSection => ({
  id,
  num: String(num).padStart(2, "0"),
  title,
  brand,
});

export const NAV_PARTS: readonly NavPart[] = [
  {
    id: "part-1",
    label: "Part I",
    title: "GN Ventures master",
    sections: [
      s(1, "essence", "Essence"),
      s(2, "name", "Name"),
      s(3, "logo", "Logo"),
      s(4, "clear-space", "Clear space"),
      s(5, "lockups", "Lockups"),
      s(6, "mark", "Mark and app icons"),
      s(7, "placement", "Placement"),
      s(8, "misuse", "Misuse"),
      s(9, "color-core", "Core colors"),
      s(10, "color-ink", "Ink and contrast"),
      s(11, "typography", "Typography"),
      s(12, "type-scale", "Type scale"),
      s(13, "numbers", "Numbers"),
      s(14, "spacing", "Spacing"),
      s(15, "motion", "Motion"),
      s(16, "voice", "Voice"),
      s(17, "imagery", "Imagery"),
      s(18, "components", "Components"),
      s(19, "presentations", "Presentations"),
      s(20, "applications", "Applications"),
      s(21, "compliance", "Compliance"),
    ],
  },
  {
    id: "part-2",
    label: "Part II",
    title: "The family",
    sections: [
      s(22, "family", "The family"),
      s(23, "media", "GN Media", "media"),
      s(24, "academy", "GN Academy", "academy"),
      s(25, "club", "GN Club", "club"),
      s(26, "labs", "GN Labs", "labs"),
      s(27, "mazal", "Mazal", "mazal"),
      s(28, "commune", "GN Commune", "commune"),
    ],
  },
  {
    id: "part-3",
    label: "Part III",
    title: "Resources",
    sections: [
      s(29, "fonts", "Fonts"),
      s(30, "downloads", "Downloads"),
    ],
  },
];

export const NAV_SECTIONS: readonly NavSection[] = NAV_PARTS.flatMap((p) => p.sections);

export const SECTION_IDS: readonly string[] = NAV_SECTIONS.map((x) => x.id);

export function findSection(id: string): NavSection | undefined {
  return NAV_SECTIONS.find((x) => x.id === id);
}
