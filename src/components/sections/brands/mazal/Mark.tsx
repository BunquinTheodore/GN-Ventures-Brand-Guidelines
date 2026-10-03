import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LIME, MARK_H, MARK_POINTS, MARK_W } from "./data";

export type MarkTreatment = "plain" | "outline" | "glow" | "stretched";

interface MarkProps {
  /** Rendered width in px. Height follows the true aspect ratio. */
  readonly width: number | string;
  readonly fill?: string;
  readonly treatment?: MarkTreatment;
  readonly label?: string;
  readonly className?: string;
}

/**
 * The M, drawn from the original vector (mazal_m_lime.svg polygon, unchanged).
 * Treatments other than "plain" exist only to demonstrate what is forbidden.
 */
export function MazalMark({ width, fill = LIME, treatment = "plain", label = "Mazal M mark", className }: MarkProps) {
  const style: CSSProperties = {
    width,
    height: "auto",
    aspectRatio: `${MARK_W} / ${MARK_H}`,
    filter: treatment === "glow" ? `drop-shadow(0 0 12px ${fill})` : undefined,
    transform: treatment === "stretched" ? "scaleX(1.5)" : undefined,
  };
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${MARK_W} ${MARK_H}`}
      style={style}
      className={cn("block shrink-0", className)}
    >
      <polygon
        points={MARK_POINTS}
        fill={treatment === "outline" ? "none" : fill}
        stroke={treatment === "outline" ? fill : undefined}
        strokeWidth={treatment === "outline" ? 14 : undefined}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/** Show only on the web channel. The chapter switch sets data-channel on the section. */
export function WebOnly({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return <div className={cn("[[data-channel=social]_&]:hidden", className)}>{children}</div>;
}

/** Show only on the social kit channel. */
export function SocialOnly({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return <div className={cn("hidden [[data-channel=social]_&]:block", className)}>{children}</div>;
}
