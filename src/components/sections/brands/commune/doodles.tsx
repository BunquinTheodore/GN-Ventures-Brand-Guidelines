import { cn } from "@/lib/utils";

export type DoodleName = "cup" | "bean" | "cart" | "star" | "sparkle" | "squiggle" | "arrow";

/** Hand-drawn paths on a 64 unit grid. Deliberately uneven, never snapped to geometry. */
const PATHS: Readonly<Record<DoodleName, readonly string[]>> = {
  cup: [
    "M13 27 Q28 29.5 43 26.5 Q44 40 40 47 Q28 52.5 16.5 47 Q12 39 13 27 Z",
    "M43 31 Q54 30 52.5 38 Q51 44.5 41 43.5",
    "M7 54 Q28 58.5 51 53",
    "M19 33 Q23 37 20 42",
  ],
  bean: [
    "M32 8 Q53 13 50.5 34 Q47 56 28 56.5 Q9.5 52 12 32 Q14 11.5 32 8 Z",
    "M31 9.5 Q43 22 30 33 Q20 44 29 56",
  ],
  cart: [
    "M7 23 Q32 -3 57 23 Q50.5 18.5 44.5 23 Q38 18 32 23 Q26 18.5 19.5 23 Q13.5 18 7 23 Z",
    "M32 8 L32.5 41",
    "M12 35 Q32 32.5 52 34.5 L50 50 Q32 52.5 14.5 50 Z",
    "M52 37 Q58 36 60.5 30",
    "M17 41 Q32 43.5 47 41",
    "M19.5 49.5 a5 5.2 0 1 0 0.2 0",
    "M44.5 49.5 a5 5.2 0 1 0 0.2 0",
  ],
  star: ["M32 6 L38.5 24 L57.5 25 L42.5 36.5 L48 55 L32 44.5 L16 55.5 L21.5 36 L6.5 25.5 L25.5 24.5 Z"],
  sparkle: ["M32 8 Q33.5 28 54 32 Q34 36 32 56 Q30 36 10 32 Q30 28 32 8 Z"],
  squiggle: ["M4 34 Q10 20 16 34 T28 34 T40 34 T52 34 T62 30"],
  arrow: ["M6 44 Q22 8 52 22", "M42 12 L53 22.5 L40 29"],
};

/** The cup's steam. Drawn separately so it can drift. */
const STEAM: readonly string[] = [
  "M21 20 Q16.5 15 21.5 10 Q26 5.5 21.5 1.5",
  "M31 21 Q27 16 31.5 11.5 Q35.5 7 32 3",
  "M40 20 Q36 15.5 40.5 11 Q44 7.5 41 4",
];

export const DOODLE_CSS = `
@media (prefers-reduced-motion: no-preference) {
  .cm-steam path { animation: cm-rise 3.2s ease-in-out infinite; transform-box: fill-box; }
  .cm-steam path:nth-child(2) { animation-delay: 0.5s; }
  .cm-steam path:nth-child(3) { animation-delay: 1s; }
  .cm-twinkle { animation: cm-twinkle 2.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
}
@keyframes cm-rise { 0%, 100% { transform: translateY(1.5px); opacity: 0.35; } 50% { transform: translateY(-2px); opacity: 1; } }
@keyframes cm-twinkle { 0%, 100% { transform: scale(1) rotate(-2deg); } 50% { transform: scale(1.08) rotate(2deg); } }
`;

interface DoodleProps {
  readonly name: DoodleName;
  readonly className?: string;
  /** Accessible name. Omit for decorative doodles. */
  readonly label?: string;
  readonly strokeWidth?: number;
}

export function Doodle({ name, className, label, strokeWidth = 2 }: DoodleProps) {
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const };
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-16 w-16 text-[var(--b-fg)]", className)}
      {...a11y}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} className={name === "star" || name === "sparkle" ? "cm-twinkle" : undefined} />
      ))}
      {name === "cup" ? (
        <g className="cm-steam">
          {STEAM.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ) : null}
    </svg>
  );
}

export function DoodleStyles() {
  return <style>{DOODLE_CSS}</style>;
}

/** What not to do: the same cup built from perfect geometry. */
export function GeometricCup({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      className={cn("h-16 w-16 text-[var(--b-fg)]", className)}
    >
      <rect x="12" y="26" width="32" height="22" rx="2" />
      <path d="M44 31h6a5 5 0 0 1 0 10h-6" />
      <line x1="8" y1="54" x2="52" y2="54" />
    </svg>
  );
}
