import { WebGLRenderer } from 'three';

/** Device pixel ratio cap for interactive plates (spec: DPR cap 1.5). */
export const MAX_DPR = 1.5;
/** Pixel ratio for the full-screen background (it sits behind blurred glass, so detail is wasted). */
export const BACKGROUND_DPR = 1;
/** Reduced pixel ratio for narrow or low-core-count devices. */
export const BACKGROUND_DPR_LOW = 0.75;
/** Frame cap for the background; motion stays smooth because it is driven by elapsed time. */
export const BACKGROUND_FPS = 30;
/** Resume rendering this long after the last scroll event. */
export const SCROLL_IDLE_MS = 150;
/** On-demand stages stop their loop after this many consecutive quiet frames. */
const QUIET_FRAMES_TO_SLEEP = 3;
/** A frame may arrive this much early (ms) and still count, to absorb vsync jitter. */
const FRAME_JITTER_MS = 4;
/** dt handed to onFrame on static (reduced motion) renders so damped values snap to target. */
export const SNAP_DT = 10;

const MAX_FRAME_DT = 0.1;

export interface StageOptions {
  readonly container: HTMLElement;
  readonly antialias: boolean;
  readonly reducedMotion: boolean;
  /** Transparent canvas (default true). */
  readonly alpha?: boolean;
  readonly maxDpr?: number;
  /** Exact pixel ratio, overriding devicePixelRatio and maxDpr. */
  readonly pixelRatio?: number;
  readonly powerPreference?: WebGLPowerPreference;
  /** Cap the frame rate (time-based, motion uses elapsed time). Unset means every vsync. */
  readonly maxFps?: number;
  /** Render only while onFrame reports activity (return true) or after invalidate(). */
  readonly onDemand?: boolean;
  /** Stop rendering while the page scrolls, resume after SCROLL_IDLE_MS of calm. */
  readonly pauseOnScroll?: boolean;
  readonly onResize: (width: number, height: number) => void;
  /**
   * Called before every render. In reduced motion it receives SNAP_DT. In on-demand
   * mode return true while the scene is still animating, false once it has settled.
   */
  readonly onFrame: (dt: number, elapsed: number) => boolean | void;
  readonly render: (renderer: WebGLRenderer) => void;
}

export interface Stage {
  readonly renderer: WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  /** Draw one frame now (used for static mode and after external changes). */
  requestRender(): void;
  /** Wake an on-demand stage so it animates until onFrame reports it settled. */
  invalidate(): void;
  dispose(): void;
}

function createRenderer(options: StageOptions): WebGLRenderer | null {
  try {
    const renderer = new WebGLRenderer({
      antialias: options.antialias,
      alpha: options.alpha ?? true,
      powerPreference: options.powerPreference ?? 'high-performance',
      premultipliedAlpha: true,
    });
    renderer.setPixelRatio(options.pixelRatio ?? Math.min(window.devicePixelRatio || 1, options.maxDpr ?? MAX_DPR));
    renderer.setClearColor(0x000000, 0);
    return renderer;
  } catch {
    return null;
  }
}

interface LoopFlags {
  onscreen: boolean;
  contextLost: boolean;
  disposed: boolean;
  scrolling: boolean;
  /** On-demand stages only: true while something asked for frames. */
  awake: boolean;
}

interface Loop {
  readonly flags: LoopFlags;
  sync(): void;
  requestRender(): void;
  invalidate(): void;
  stop(): void;
}

/** rAF loop that runs only while visible, optionally capped, on demand, and scroll-suspended. */
function createLoop(options: StageOptions, renderer: WebGLRenderer): Loop {
  const flags: LoopFlags = { onscreen: true, contextLost: false, disposed: false, scrolling: false, awake: !options.onDemand };
  const minInterval = options.maxFps && options.maxFps > 0 ? 1000 / options.maxFps - FRAME_JITTER_MS : 0;
  let rafId = 0;
  let staticRaf = 0;
  let last = 0;
  let elapsed = 0;
  let quiet = 0;

  const shouldRun = (): boolean =>
    !options.reducedMotion &&
    flags.onscreen &&
    flags.awake &&
    !flags.scrolling &&
    !document.hidden &&
    !flags.contextLost &&
    !flags.disposed;

  const draw = (dt: number): boolean => {
    const busy = options.onFrame(dt, elapsed) !== false;
    options.render(renderer);
    return busy;
  };

  const tick = (now: number): void => {
    rafId = requestAnimationFrame(tick);
    if (now - last < minInterval) return;
    const dt = Math.min((now - last) / 1000, MAX_FRAME_DT);
    last = now;
    elapsed += dt;
    const busy = draw(dt);
    if (!options.onDemand) return;
    quiet = busy ? 0 : quiet + 1;
    if (quiet >= QUIET_FRAMES_TO_SLEEP) {
      flags.awake = false;
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const sync = (): void => {
    if (shouldRun()) {
      if (rafId === 0) {
        last = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    } else if (rafId !== 0) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const invalidate = (): void => {
    if (!options.onDemand || flags.disposed) return;
    quiet = 0;
    flags.awake = true;
    sync();
  };

  const requestRender = (): void => {
    if (flags.disposed || flags.contextLost || staticRaf !== 0) return;
    staticRaf = requestAnimationFrame(() => {
      staticRaf = 0;
      if (!flags.disposed && !flags.contextLost) draw(options.reducedMotion ? SNAP_DT : 0);
    });
  };

  const stop = (): void => {
    if (rafId !== 0) cancelAnimationFrame(rafId);
    if (staticRaf !== 0) cancelAnimationFrame(staticRaf);
    rafId = 0;
    staticRaf = 0;
  };

  return { flags, sync, requestRender, invalidate, stop };
}

/** Suspend the loop while the page scrolls. Returns teardown. */
function bindScrollPause(loop: Loop): () => void {
  let timer = 0;
  const resume = (): void => {
    timer = 0;
    loop.flags.scrolling = false;
    loop.sync();
  };
  const onScroll = (): void => {
    if (!loop.flags.scrolling) {
      loop.flags.scrolling = true;
      loop.sync();
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(resume, SCROLL_IDLE_MS);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.clearTimeout(timer);
  };
}

/** Observers (size, visibility) and WebGL context events. Returns one teardown function. */
function bindStageEvents(
  options: StageOptions,
  renderer: WebGLRenderer,
  loop: Loop,
): () => void {
  const canvas = renderer.domElement;
  const { flags } = loop;

  const resizeObserver = new ResizeObserver((entries) => {
    const rect = entries[0]?.contentRect;
    if (!rect) return;
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    options.onResize(width, height);
    if (options.reducedMotion || !flags.onscreen || document.hidden || flags.scrolling || !flags.awake) loop.requestRender();
  });
  resizeObserver.observe(options.container);

  const intersection = new IntersectionObserver((entries) => {
    flags.onscreen = entries[entries.length - 1]?.isIntersecting ?? true;
    loop.sync();
  });
  intersection.observe(options.container);

  const onVisibility = (): void => loop.sync();
  const onLost = (event: Event): void => {
    event.preventDefault();
    flags.contextLost = true;
    loop.sync();
  };
  const onRestored = (): void => {
    flags.contextLost = false;
    loop.sync();
    loop.requestRender();
  };
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  const unbindScroll = options.pauseOnScroll ? bindScrollPause(loop) : () => undefined;

  return () => {
    unbindScroll();
    resizeObserver.disconnect();
    intersection.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
  };
}

/**
 * Create a renderer inside `container` with a managed loop: ResizeObserver
 * sizing, pause while the tab is hidden or the container is offscreen, and
 * context loss handling. Returns null when WebGL cannot start.
 */
export function createStage(options: StageOptions): Stage | null {
  const renderer = createRenderer(options);
  if (!renderer) return null;
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  options.container.appendChild(canvas);

  const loop = createLoop(options, renderer);
  const unbind = bindStageEvents(options, renderer, loop);
  loop.sync();
  loop.requestRender();
  loop.invalidate();

  const dispose = (): void => {
    if (loop.flags.disposed) return;
    loop.flags.disposed = true;
    loop.stop();
    unbind();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  return { renderer, canvas, requestRender: loop.requestRender, invalidate: loop.invalidate, dispose };
}
