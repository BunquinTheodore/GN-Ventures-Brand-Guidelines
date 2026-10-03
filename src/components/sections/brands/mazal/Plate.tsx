import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PLATE_LAYERS } from "./data";

interface PlateProps {
  /** Number of layers to draw, bottom first. Defaults to all of them. */
  readonly upto?: number;
  readonly className?: string;
  readonly children?: ReactNode;
}

/** The social kit background plate, built from its seven layers. Flat, no glow. */
export function Plate({ upto = PLATE_LAYERS.length, className, children }: PlateProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      {PLATE_LAYERS.slice(0, upto).map((layer) => (
        <div
          key={layer.id}
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ ...layer.style, opacity: layer.opacity }}
        />
      ))}
      {children}
    </div>
  );
}

/** Exploded view: each tile adds one more layer, ending in the full plate. */
export function PlateStack() {
  return (
    <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {PLATE_LAYERS.map((layer, i) => (
        <li key={layer.id} className="flex flex-col gap-2">
          <Plate upto={i + 1} className="aspect-square border border-[var(--b-border)]" />
          <p className="text-sm text-[var(--b-fg)]">
            <span className="font-mono text-[var(--b-muted)]">{String(i + 1).padStart(2, "0")}</span> {layer.label}
          </p>
          <p className="text-sm text-[var(--b-muted)]">{layer.detail}</p>
        </li>
      ))}
    </ol>
  );
}
