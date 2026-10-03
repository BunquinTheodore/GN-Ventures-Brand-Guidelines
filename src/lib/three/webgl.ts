/** Environment checks for the three.js layer. Browser only, all wrapped in try/catch. */

let cachedSupport: boolean | null = null;

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** True when a WebGL context can be created. The result is cached. */
export function isWebGLSupported(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    cachedSupport = gl !== null;
    // Release the probe context right away so it does not count against the limit.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}
