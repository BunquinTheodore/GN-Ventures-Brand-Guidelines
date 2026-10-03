import { cn } from "@/lib/utils";

/** Page title wordmark as live text: "GN Ventures". */
export default function Wordmark({ className }: { readonly className?: string }) {
  return (
    <a
      href="#main"
      data-sfx="nav"
      aria-label="GN Ventures Brand Guidelines, back to top"
      className={cn("gn-nav-link inline-flex min-h-11 items-center gap-2 text-[var(--fog)]", className)}
    >
      <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand-gradient)" }} />
      <span className="text-sm font-semibold tracking-[0.12em]">GN Ventures</span>
    </a>
  );
}
