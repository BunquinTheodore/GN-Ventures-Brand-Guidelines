'use client';

import { useEffect, useRef, useState } from 'react';
import { activeSection, brandForSection } from '@/lib/active-section';
import { departmentIndex } from '@/lib/three/departments';
import { createBackgroundScene, type BackgroundInput } from '@/lib/three/backgroundScene';
import { scrollProgress } from '@/lib/three/math';
import { MAX_DPR, createStage } from '@/lib/three/renderer';
import { isWebGLSupported, prefersReducedMotion } from '@/lib/three/webgl';

/** Static underlay: shown before the canvas fades in and when WebGL is missing. */
const FALLBACK_BACKGROUND =
  'radial-gradient(ellipse at 50% 38%, color-mix(in srgb, var(--brand-accent, #C6F24E) 9%, transparent), transparent 62%)';
/** Soft vignette over the canvas so copy in the middle of the page stays readable. */
const VIGNETTE = 'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0, 0, 0, 0.42) 100%)';

function sectionToIndex(id: string): number {
  return departmentIndex(brandForSection(id));
}

/**
 * Fixed full-viewport WebGL background: an orbital "venture system". A lime GN
 * core is circled by six department bodies on tilted elliptical orbits with
 * fading trails, over a sparse depth-layered starfield. Scroll drives a camera
 * dolly and roll, the pointer adds parallax, and the active section eases the
 * camera toward its department. Renders one static frame under reduced motion.
 */
export default function BrandBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !isWebGLSupported()) return;
    const reduced = prefersReducedMotion();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const background = createBackgroundScene(pixelRatio);
    let input: BackgroundInput = { scroll: 0, pointerX: 0, pointerY: 0 };

    const readScroll = (): number =>
      scrollProgress(window.scrollY, window.innerHeight, document.documentElement.scrollHeight);

    const stage = createStage({
      container: host,
      antialias: false,
      reducedMotion: reduced,
      onResize: (width, height) => background.resize(width, height, pixelRatio),
      onFrame: (dt, elapsed) => background.update(dt, elapsed, { ...input, scroll: readScroll() }),
      render: (renderer) => renderer.render(background.scene, background.camera),
    });
    if (!stage) {
      background.dispose();
      return;
    }

    const applySection = (id: string): void => {
      background.setActive(sectionToIndex(id));
      if (reduced) stage.requestRender();
    };
    applySection(activeSection.get());
    const unsubscribe = activeSection.subscribe(applySection);

    const onPointer = (event: PointerEvent): void => {
      input = {
        ...input,
        pointerX: (event.clientX / window.innerWidth) * 2 - 1,
        pointerY: -((event.clientY / window.innerHeight) * 2 - 1),
      };
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });
    const frame = requestAnimationFrame(() => setReady(true));

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      unsubscribe();
      stage.dispose();
      background.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1, background: FALLBACK_BACKGROUND }}
    >
      <div
        ref={hostRef}
        className="absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none"
        style={{ opacity: ready ? 0.9 : 0 }}
      />
      <div className="absolute inset-0" style={{ background: VIGNETTE }} />
    </div>
  );
}
