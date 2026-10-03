"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import SoundToggle from "@/components/fx/SoundToggle";
import { findSection } from "@/content/nav";
import NavList from "./NavList";
import Wordmark from "./Wordmark";
import { useActiveSection } from "./useScrollSpy";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Locks scroll, traps focus in the drawer, closes on Escape and returns focus to the opener. */
function useDrawerBehavior(
  open: boolean,
  onClose: () => void,
  drawer: RefObject<HTMLDivElement | null>,
  opener: RefObject<HTMLButtonElement | null>,
): void {
  useEffect(() => {
    if (!open) return;
    const root = drawer.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const opening = opener.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      opening?.focus();
    };
  }, [open, onClose, drawer, opener]);
}

function MenuIcon() {
  return (
    <span aria-hidden="true" className="flex flex-col gap-1.5">
      <span className="block h-0.5 w-5 bg-current" />
      <span className="block h-0.5 w-5 bg-current" />
      <span className="block h-0.5 w-5 bg-current" />
    </span>
  );
}

interface DrawerProps {
  readonly drawer: RefObject<HTMLDivElement | null>;
  readonly onClose: () => void;
}

/** Overlay and dialog. Rendered OUTSIDE the header: backdrop-filter would make the header its containing block. */
function Drawer({ drawer, onClose }: DrawerProps) {
  return (
    <div className="fixed inset-0 top-[var(--topbar-h)] z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--deep)_70%,transparent)]"
      />
      <div
        id="mobile-nav"
        ref={drawer}
        role="dialog"
        aria-modal="true"
        aria-label="On this page"
        className="gn-glass gn-nav-surface absolute inset-y-0 right-0 w-[min(22rem,88vw)] overflow-y-auto rounded-none border-y-0 border-r-0 p-3"
        style={{ "--nav-mix": "94%" } as CSSProperties}
      >
        <p className="gn-eyebrow px-3 pb-2 pt-2 text-[var(--fog-dim)]">On this page</p>
        <NavList onNavigate={onClose} />
      </div>
    </div>
  );
}

/** Mobile top bar with the current section and a drawer holding the same nav. Hidden at lg+. */
export default function TopBar() {
  const [open, setOpen] = useState(false);
  const current = useActiveSection();
  const drawer = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const label = findSection(current);
  const close = useCallback(() => setOpen(false), []);
  useDrawerBehavior(open, close, drawer, opener);

  return (
    <>
      <header className="gn-glass gn-nav-surface fixed inset-x-0 top-0 z-50 flex h-[var(--topbar-h)] items-center justify-between gap-1 rounded-none border-x-0 border-t-0 px-3 lg:hidden">
        <Wordmark />
        <p className="gn-nav-link min-w-0 flex-1 truncate pr-2 text-right text-[var(--fog-dim)]" aria-live="off">
          {label ? `${label.num} ${label.title}` : ""}
        </p>
        <SoundToggle floating={false} />
        <button
          ref={opener}
          type="button"
          data-sfx="open"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--fog)] hover:bg-[color-mix(in_srgb,#fff_8%,transparent)]"
        >
          <MenuIcon />
        </button>
      </header>
      {open ? <Drawer drawer={drawer} onClose={close} /> : null}
    </>
  );
}
