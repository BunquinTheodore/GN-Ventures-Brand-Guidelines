import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Hover zoom (scale 1.03). Use on real cards only. */
  readonly zoom?: boolean;
  readonly as?: "div" | "article" | "li" | "section";
  readonly style?: CSSProperties;
  /** Stagger the shine sweep, in seconds. */
  readonly shineDelay?: number;
}

/** Glass card with continuous shine. overflow-hidden is mandatory with gn-shine (oversized sweep). */
export default function GlowCard({ children, className, zoom = false, as: Tag = "div", style, shineDelay }: GlowCardProps) {
  const merged: CSSProperties = {
    ...style,
    ...(shineDelay !== undefined ? ({ "--gn-shine-delay": `${shineDelay}s` } as CSSProperties) : null),
  };
  return (
    <Tag className={cn("gn-glass gn-shine overflow-hidden p-5 md:p-6", zoom && "gn-zoom", className)} style={merged}>
      {children}
    </Tag>
  );
}
