"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ComponentType, CSSProperties } from "react";
import { parseHash } from "@/components/sections/departments/selection";
import { DETAIL_ID } from "@/components/sections/departments/SheetTabs";
import SectionShell from "./SectionShell";

type SectionLoader = () => Promise<{ readonly default: ComponentType }>;

export interface DeferredProps {
  readonly id: string;
  readonly num?: string;
  readonly eyebrow: string;
  readonly title: string;
  /** Position in the page (document order). */
  readonly order: number;
  /** Measured section heights in px at 375, 640, 768, 1024, 1280 and 1536 wide (Tailwind base, sm, md, lg, xl, 2xl). */
  readonly heights: readonly number[];
  readonly load: SectionLoader;
}

/** Real content mounts this far before it enters the viewport; its code is fetched a couple of screens earlier. */
const MOUNT_MARGIN = "1200px 0px";
const PREFETCH_MARGIN = "2600px 0px";
const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 3;
const CORRECTION_WINDOW_MS = 6000;
const SETTLE_DELAY_MS = 450;
const SCROLL_IDLE_MS = 160;
const SCROLL_TOLERANCE_PX = 2;
const USER_INPUT_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/** Placeholder height classes, one per breakpoint (literal strings so Tailwind generates them). */
const HEIGHT_CLASSES =
  "h-[var(--dh0)] sm:h-[var(--dh1)] md:h-[var(--dh2)] lg:h-[var(--dh3)] xl:h-[var(--dh4)] 2xl:h-[var(--dh5)] overflow-hidden";

interface Entry {
  readonly order: number;
  readonly mount: () => void;
  readonly isLoaded: () => boolean;
}

interface PendingJump {
  readonly sectionId: string;
  readonly order: number;
  readonly detail: boolean;
  readonly expires: number;
}

/* ------------------------------------------------------------------------------------------
   Deep link controller (module level, one per page).
   A hash that targets a deferred section mounts only that section (placeholders above it carry
   measured heights, so the target is already in about the right place), waits for its code, then
   re-scrolls so layout shifts cannot leave it off screen. A hash whose target is already live
   gets one correction once the smooth scroll has gone idle, so upward jumps land like downward ones.
   ------------------------------------------------------------------------------------------ */

const entries = new Map<string, Entry>();
let pending: PendingJump | null = null;
let controllerUsers = 0;
let settleTimer: number | undefined;
let idleListener: (() => void) | null = null;

function sectionIdForHash(hash: string): { id: string; detail: boolean } | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  if (parseHash(hash)) return { id: "departments", detail: true };
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    // Malformed escape: use the raw fragment.
  }
  return entries.has(id) ? { id, detail: false } : null;
}

function scrollOffset(el: HTMLElement): number {
  const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop);
  return Number.isFinite(margin) ? margin : 0;
}

function cancelPending(): void {
  pending = null;
  window.clearTimeout(settleTimer);
  if (idleListener) window.removeEventListener("scroll", idleListener);
  idleListener = null;
}

function snapToTarget(): void {
  if (!pending) return;
  const el = document.getElementById(pending.detail ? DETAIL_ID : pending.sectionId);
  if (!el) return;
  const delta = el.getBoundingClientRect().top - scrollOffset(el);
  if (Math.abs(delta) > SCROLL_TOLERANCE_PX) window.scrollBy({ top: delta, behavior: "instant" });
}

/** Run when a section finishes loading: once every forced section is in, snap, then snap again after images settle. */
function onSectionLoaded(): void {
  if (!pending) return;
  if (performance.now() > pending.expires) {
    cancelPending();
    return;
  }
  const target = entries.get(pending.sectionId);
  if (!target?.isLoaded()) return;
  window.requestAnimationFrame(() => {
    snapToTarget();
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      snapToTarget();
      cancelPending();
    }, SETTLE_DELAY_MS);
  });
}

/** Target already live: let the browser's smooth scroll finish, then correct any residual offset once. */
function snapWhenScrollIdle(sectionId: string, order: number): void {
  cancelPending();
  pending = { sectionId, order, detail: false, expires: performance.now() + CORRECTION_WINDOW_MS };
  const arm = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      snapToTarget();
      cancelPending();
    }, SCROLL_IDLE_MS);
  };
  idleListener = arm;
  window.addEventListener("scroll", arm, { passive: true });
  arm();
}

function handleHash(): void {
  const target = sectionIdForHash(window.location.hash);
  const entry = target ? entries.get(target.id) : undefined;
  if (!target || !entry) return;
  if (entry.isLoaded()) {
    // The sheet scrolls on its own; a plain section only needs the post-scroll correction.
    if (!target.detail) snapWhenScrollIdle(target.id, entry.order);
    return;
  }
  cancelPending();
  pending = { sectionId: target.id, order: entry.order, detail: target.detail, expires: performance.now() + CORRECTION_WINDOW_MS };
  entry.mount();
}

function onUserInput(): void {
  cancelPending();
}

function useDeepLinkController(): void {
  useEffect(() => {
    controllerUsers += 1;
    if (controllerUsers === 1) {
      window.addEventListener("hashchange", handleHash);
      USER_INPUT_EVENTS.forEach((ev) => window.addEventListener(ev, onUserInput, { passive: true }));
    }
    return () => {
      controllerUsers -= 1;
      if (controllerUsers === 0) {
        window.removeEventListener("hashchange", handleHash);
        USER_INPUT_EVENTS.forEach((ev) => window.removeEventListener(ev, onUserInput));
      }
    };
  }, []);
}

/* ------------------------------------------------------------------------------------------ */

const loadedComponents = new Map<string, ComponentType>();

/** Browsers without scroll anchoring (Safari) need a manual shift when a section above the viewport swaps its placeholder. */
function lacksScrollAnchoring(): boolean {
  return typeof CSS !== "undefined" && typeof CSS.supports === "function" && !CSS.supports("overflow-anchor", "auto");
}

function heightVars(heights: readonly number[]): CSSProperties {
  const vars: Record<string, string> = {};
  heights.forEach((h, i) => {
    vars[`--dh${i}`] = `${h}px`;
  });
  return vars as CSSProperties;
}

/**
 * Below-the-fold section wrapper. The server renders (and the client first renders) a cheap
 * placeholder: the real section header at the measured height, so the page keeps its true length,
 * anchors land correctly. Only the section-level heading is in the server HTML; body copy, h3s and
 * tables appear once the section mounts, and the placeholder is not a landmark. The real section mounts
 * when it is within ~1200px of the viewport, or at once when a deep link targets it, and then stays mounted.
 * The wrapper element is stable, so scroll-spy observes it through data-spy.
 */
export default function Deferred({ id, num, eyebrow, title, order, heights, load }: DeferredProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(false);
  const [Section, setSection] = useState<ComponentType | null>(() => loadedComponents.get(id) ?? null);
  const [attempt, setAttempt] = useState(0);
  const loadedRef = useRef(Section !== null);
  const loaderRef = useRef(load);
  const rectBeforeSwap = useRef<DOMRect | null>(null);
  useDeepLinkController();

  useEffect(() => {
    const entry: Entry = { order, mount: () => setWanted(true), isLoaded: () => loadedRef.current };
    entries.set(id, entry);
    // A hash present at load time may target this section or one below it.
    const frame = window.requestAnimationFrame(() => {
      if (window.location.hash) handleHash();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (entries.get(id) === entry) entries.delete(id);
    };
  }, [id, order]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (wanted || !el) return;
    if (typeof IntersectionObserver === "undefined") {
      setWanted(true);
      return;
    }
    const mountObserver = new IntersectionObserver(
      (hits) => {
        if (hits.some((h) => h.isIntersecting)) setWanted(true);
      },
      { rootMargin: MOUNT_MARGIN },
    );
    const prefetchObserver = new IntersectionObserver(
      (hits) => {
        if (!hits.some((h) => h.isIntersecting)) return;
        loaderRef.current().catch(() => undefined);
        prefetchObserver.disconnect();
      },
      { rootMargin: PREFETCH_MARGIN },
    );
    mountObserver.observe(el);
    prefetchObserver.observe(el);
    return () => {
      mountObserver.disconnect();
      prefetchObserver.disconnect();
    };
  }, [wanted]);

  useEffect(() => {
    if (!wanted || Section) return;
    let live = true;
    let retry: number | undefined;
    loaderRef.current().then(
      (mod) => {
        if (!live) return;
        loadedComponents.set(id, mod.default);
        loadedRef.current = true;
        rectBeforeSwap.current = wrapperRef.current?.getBoundingClientRect() ?? null;
        setSection(() => mod.default);
      },
      () => {
        if (live && attempt < MAX_RETRIES) retry = window.setTimeout(() => setAttempt((n) => n + 1), RETRY_DELAY_MS);
      },
    );
    return () => {
      live = false;
      window.clearTimeout(retry);
    };
  }, [wanted, Section, id, attempt]);

  // A section that swaps in entirely above the viewport would push everything down by (real - placeholder) height.
  useLayoutEffect(() => {
    const before = rectBeforeSwap.current;
    rectBeforeSwap.current = null;
    const el = wrapperRef.current;
    if (!Section || !before || !el || before.bottom > 0 || !lacksScrollAnchoring()) return;
    const delta = el.getBoundingClientRect().height - before.height;
    if (Math.abs(delta) > SCROLL_TOLERANCE_PX) window.scrollBy({ top: delta, behavior: "instant" });
  }, [Section]);

  useEffect(() => {
    if (Section) onSectionLoaded();
  }, [Section]);

  return (
    <div ref={wrapperRef} data-spy={id} data-deferred={Section ? "mounted" : "pending"} style={Section ? undefined : heightVars(heights)}>
      {Section ? <Section /> : <SectionShell id={id} num={num} eyebrow={eyebrow} title={title} className={HEIGHT_CLASSES} placeholder />}
    </div>
  );
}
