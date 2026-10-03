import type { BrandId } from "./types";

/** Tiny 96x96 WebP thumbnails on black, used for small logo chips and pickers. */
export const THUMBS: Readonly<Record<BrandId, string>> = {
  ventures: "/brand/_thumbs/ventures.webp",
  media: "/brand/_thumbs/media.webp",
  academy: "/brand/_thumbs/academy.webp",
  club: "/brand/_thumbs/club.webp",
  labs: "/brand/_thumbs/labs.webp",
  mazal: "/brand/_thumbs/mazal.webp",
  commune: "/brand/_thumbs/commune.webp",
};

export function thumbFor(id: BrandId): string {
  return THUMBS[id];
}
