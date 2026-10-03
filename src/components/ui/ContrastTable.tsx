import type { Swatch } from "@/content/types";
import { contrastRows, type WcagGrade } from "@/lib/contrast";
import Badge, { type BadgeTone } from "./Badge";

interface ContrastTableProps {
  readonly foregrounds: readonly Swatch[];
  readonly backgrounds: readonly Swatch[];
  readonly caption?: string;
  readonly className?: string;
}

const GRADE_TONE: Readonly<Record<WcagGrade, BadgeTone>> = {
  AAA: "accent",
  AA: "accent",
  "AA Large": "amber",
  Fail: "danger",
};

/**
 * WCAG contrast of every foreground over every background, computed from real hex
 * (oklch tokens are converted and are approximate). Swatches without an opaque
 * color (gradients, alpha) are skipped.
 */
export default function ContrastTable({ foregrounds, backgrounds, caption, className }: ContrastTableProps) {
  const rows = contrastRows(foregrounds, backgrounds);
  return (
    <div className={className}>
      <div className="overflow-x-auto rounded-[var(--b-radius)] border border-[var(--b-border)]">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          {caption ? <caption className="p-3 text-left text-[var(--b-muted)]">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-[var(--b-border)] font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">
              <th scope="col" className="p-3 font-medium">Sample</th>
              <th scope="col" className="p-3 font-medium">Foreground</th>
              <th scope="col" className="p-3 font-medium">Background</th>
              <th scope="col" className="p-3 text-right font-medium">Ratio</th>
              <th scope="col" className="p-3 font-medium">WCAG</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.bg.name}|${r.fg.name}|${r.bgHex}|${r.fgHex}`} className="border-b border-[var(--b-border)] last:border-0">
                <td className="p-3">
                  <span
                    className="inline-flex h-10 w-14 items-center justify-center rounded-md border border-[var(--b-border)] font-ui text-base font-semibold"
                    style={{ color: r.fgHex, background: r.bgHex }}
                  >
                    Aa
                  </span>
                </td>
                <td className="p-3">
                  <span className="block text-[var(--b-fg)]">{r.fg.name}</span>
                  <span className="font-mono text-xs text-[var(--b-muted)]">{r.fgHex.toUpperCase()}</span>
                </td>
                <td className="p-3">
                  <span className="block text-[var(--b-fg)]">{r.bg.name}</span>
                  <span className="font-mono text-xs text-[var(--b-muted)]">{r.bgHex.toUpperCase()}</span>
                </td>
                <td className="p-3 text-right font-mono tabular-nums text-[var(--b-fg)]">{r.ratio.toFixed(2)}:1</td>
                <td className="p-3">
                  <Badge tone={GRADE_TONE[r.grade]}>{r.grade}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
