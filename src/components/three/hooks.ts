'use client';

import { useSyncExternalStore } from 'react';
import { isWebGLSupported } from '@/lib/three/webgl';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void): () => void {
  try {
    const query = window.matchMedia(REDUCED_QUERY);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  } catch {
    return () => undefined;
  }
}

function readReducedMotion(): boolean {
  try {
    return window.matchMedia(REDUCED_QUERY).matches;
  } catch {
    return false;
  }
}

/** Live prefers-reduced-motion. Server snapshot is false. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => false);
}

const subscribeNever = (): (() => void) => () => undefined;

/** WebGL availability. Optimistic on the server, probed once on the client. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribeNever, isWebGLSupported, () => true);
}
