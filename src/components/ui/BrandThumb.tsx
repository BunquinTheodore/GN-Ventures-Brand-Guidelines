"use client";

import { useState } from "react";
import { BRANDS } from "@/content/brands";
import { thumbFor } from "@/content/thumbs";
import type { BrandId } from "@/content/types";
import { cn } from "@/lib/utils";

const INITIALS: Readonly<Record<BrandId, string>> = {
  ventures: "GV",
  media: "GM",
  academy: "GA",
  club: "GC",
  labs: "GL",
  mazal: "MZ",
  commune: "CM",
};

interface BrandThumbProps {
  readonly brand: BrandId;
  readonly size?: number;
  /** Override the default thumbnail path. */
  readonly src?: string;
  readonly className?: string;
}

/**
 * Small brand logo. A plain eager img (no lazy loading, which can leave chips
 * blank). If the file fails, a solid accent tile with initials replaces it so
 * a broken-image icon is never shown. Commune stays black and white.
 */
export default function BrandThumb({ brand, size = 24, src, className }: BrandThumbProps) {
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src ?? thumbFor(brand)}
        alt=""
        width={size}
        height={size}
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className={cn("rounded-md object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  const commune = brand === "commune";
  return (
    <span
      aria-hidden="true"
      className={cn("inline-grid shrink-0 place-items-center rounded-md font-ui font-bold leading-none", className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(8, Math.round(size * 0.38)),
        background: commune ? "#000000" : BRANDS[brand].accent,
        color: commune ? "#FFFFFF" : "#08090A",
        border: commune ? "1px solid #FFFFFF" : undefined,
      }}
    >
      {INITIALS[brand]}
    </span>
  );
}
