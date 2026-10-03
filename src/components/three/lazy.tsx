'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { HeroLogo3DProps } from './HeroLogo3D';
import type { LogoViewer3DProps } from './LogoViewer3D';

/** Max wait before the background mounts even without any user input. */
const IDLE_TIMEOUT_MS = 2500;
const INPUT_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;

/** The viewer's chunk and WebGL context load only once its slot is this close to the viewport. */
const VIEWER_ROOT_MARGIN = '800px 0px';

const BrandBackgroundChunk = dynamic(() => import('./BrandBackground'), { ssr: false, loading: () => null });

const HeroLogo3DChunk = dynamic(() => import('./HeroLogo3D'), { ssr: false, loading: () => null });

function ViewerPlaceholder() {
  return (
    <div aria-hidden="true" className="mx-auto flex w-full max-w-md min-h-[28rem] flex-col gap-4">
      <div
        className="aspect-square w-full rounded-2xl"
        style={{ background: 'color-mix(in srgb, currentColor 5%, transparent)' }}
      />
    </div>
  );
}

const LogoViewer3DChunk = dynamic(() => import('./LogoViewer3D'), {
  ssr: false,
  loading: () => <ViewerPlaceholder />,
});

/** True once the first user input happens or the idle timeout fires, whichever is first. */
function useArmed(): boolean {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    let done = false;
    const idle = window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const arm = (): void => {
      if (done) return;
      done = true;
      setArmed(true);
    };
    for (const name of INPUT_EVENTS) window.addEventListener(name, arm, { once: true, passive: true });
    const idleId = idle.requestIdleCallback ? idle.requestIdleCallback(arm, { timeout: IDLE_TIMEOUT_MS }) : -1;
    const timerId = window.setTimeout(arm, IDLE_TIMEOUT_MS);
    return () => {
      done = true;
      for (const name of INPUT_EVENTS) window.removeEventListener(name, arm);
      if (idleId !== -1) idle.cancelIdleCallback?.(idleId);
      window.clearTimeout(timerId);
    };
  }, []);
  return armed;
}

/** Fixed orbital background, loaded only after first input or ~2.5 s. Nothing layout-affecting renders. */
export function LazyBrandBackground() {
  const armed = useArmed();
  return armed ? <BrandBackgroundChunk /> : null;
}

/**
 * Hero logo: a static image holds the space (square, no layout shift) and is
 * hidden once the 3D plate reports ready.
 */
export function LazyHeroLogo3D({ src, alt, className }: Pick<HeroLogo3DProps, 'src' | 'alt' | 'className'>) {
  const [ready, setReady] = useState(false);
  return (
    <div className={`relative ${className ?? ''}`} style={{ aspectRatio: '1 / 1' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={ready ? '' : alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
        style={{ opacity: ready ? 0 : 1 }}
      />
      <div className="absolute inset-0">
        <HeroLogo3DChunk
          src={src}
          alt={alt}
          showFallback={false}
          onStatusChange={(status) => setReady(status === 'ready')}
        />
      </div>
    </div>
  );
}

/** Mounts the 3D viewer (chunk, texture, WebGL context) only when it is near the viewport. */
export function LazyLogoViewer3D(props: LogoViewer3DProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || near) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: VIEWER_ROOT_MARGIN },
    );
    observer.observe(slot);
    return () => observer.disconnect();
  }, [near]);
  return near ? <LogoViewer3DChunk {...props} /> : <div ref={slotRef}><ViewerPlaceholder /></div>;
}
