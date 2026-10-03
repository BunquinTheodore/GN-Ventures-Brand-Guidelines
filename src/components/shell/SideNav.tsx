"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import NavList from "./NavList";
import Wordmark from "./Wordmark";

interface SideNavProps {
  readonly collapsed: boolean;
  readonly onToggle: () => void;
}

/** Desktop left rail ("On this page"). Collapses to a numbers-only rail. */
export default function SideNav({ collapsed, onToggle }: SideNavProps) {
  return (
    <aside
      className={cn(
        "gn-glass gn-nav-surface sticky top-0 hidden h-dvh shrink-0 flex-col overflow-hidden rounded-none border-y-0 border-l-0 lg:flex",
        collapsed ? "w-16" : "w-[var(--nav-w)]",
      )}
      style={{ "--nav-mix": "82%" } as CSSProperties}
    >
      <div className={cn("flex items-center px-3 pt-3", collapsed ? "justify-center" : "justify-between")}>
        {collapsed ? null : <Wordmark />}
        <button
          type="button"
          data-sfx="toggle"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--fog-dim)] hover:bg-[color-mix(in_srgb,#fff_8%,transparent)] hover:text-[var(--fog)]"
        >
          <span aria-hidden="true">{collapsed ? "»" : "«"}</span>
        </button>
      </div>
      {collapsed ? null : (
        <p className="gn-eyebrow px-6 pb-2 pt-4 text-[var(--fog-dim)]">On this page</p>
      )}
      <div className={cn("min-h-0 flex-1 overflow-y-auto pb-6", collapsed ? "px-2 pt-3" : "px-3")}>
        <NavList collapsed={collapsed} />
      </div>
    </aside>
  );
}
