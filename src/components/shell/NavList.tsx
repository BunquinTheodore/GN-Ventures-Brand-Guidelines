"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BRANDS } from "@/content/brands";
import { NAV_PARTS } from "@/content/nav";
import type { NavSection } from "@/content/types";
import { activeSection } from "@/lib/active-section";
import { cn } from "@/lib/utils";
import { useActiveSection } from "./useScrollSpy";

interface NavListProps {
  /** Icon rail mode: numbers only, no part headings. */
  readonly collapsed?: boolean;
  readonly onNavigate?: () => void;
}

function NavLink({ section, active, collapsed, onNavigate }: {
  readonly section: NavSection;
  readonly active: boolean;
  readonly collapsed: boolean;
  readonly onNavigate?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const accent = BRANDS[section.brand].accent;

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <a
      ref={ref}
      href={`#${section.id}`}
      data-sfx="nav"
      title={collapsed ? `${section.num} ${section.title}` : undefined}
      aria-label={collapsed ? `${section.num} ${section.title}` : undefined}
      aria-current={active ? "location" : undefined}
      onClick={() => {
        activeSection.set(section.id);
        onNavigate?.();
      }}
      className={cn(
        "gn-nav-link group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 transition-colors",
        collapsed && "justify-center px-1",
        active
          ? "bg-[color-mix(in_srgb,var(--lime)_10%,transparent)] text-[var(--fog)]"
          : "text-[var(--fog-dim)] hover:bg-[color-mix(in_srgb,#fff_6%,transparent)] hover:text-[var(--fog)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-opacity", active ? "opacity-100" : "opacity-0")}
        style={{ background: accent }}
      />
      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent, opacity: active ? 1 : 0.55 }} />
      <span className="font-mono text-[0.6875rem] tracking-normal text-[var(--fog-dim)]">{section.num}</span>
      {collapsed ? null : <span className="truncate">{section.title}</span>}
    </a>
  );
}

/** The grouped "On this page" list, shared by the desktop sidebar and the mobile drawer. */
export default function NavList({ collapsed = false, onNavigate }: NavListProps) {
  const current = useActiveSection();
  const instance = useId();
  const [closed, setClosed] = useState<ReadonlySet<string>>(new Set());

  function toggle(id: string) {
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <nav aria-label="On this page" className="flex flex-col gap-4">
      {NAV_PARTS.map((part) => {
        const open = collapsed || !closed.has(part.id);
        const listId = `navgroup-${instance}-${part.id}`;
        return (
          <div key={part.id}>
            {collapsed ? (
              <div aria-hidden="true" className="mx-2 my-2 h-px bg-[var(--glass-border)]" />
            ) : (
              <button
                type="button"
                data-sfx="toggle"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => toggle(part.id)}
                className="gn-nav-link flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-[var(--lime)] hover:bg-[color-mix(in_srgb,#fff_6%,transparent)]"
              >
                <span>
                  {part.label} <span className="text-[var(--fog-dim)]">{part.title}</span>
                </span>
                <span aria-hidden="true" className={cn("transition-transform", open ? "rotate-90" : "rotate-0")}>
                  &#9656;
                </span>
              </button>
            )}
            <ul id={listId} hidden={!open} className="m-0 list-none p-0">
              {part.sections.map((section) => (
                <li key={section.id}>
                  <NavLink section={section} active={current === section.id} collapsed={collapsed} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
