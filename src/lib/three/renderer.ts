import { WebGLRenderer } from 'three';

/** Device pixel ratio cap (spec: DPR cap 1.5). */
export const MAX_DPR = 1.5;
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
  readonly onResize: (width: number, height: number) => void;
  /** Called before every render. In reduced motion it receives SNAP_DT. */
  readonly onFrame: (dt: number, elapsed: number) => void;
  readonly render: (renderer: WebGLRenderer) => void;
}

export interface Stage {
  readonly renderer: WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  /** Draw one frame now (used for static mode and after external changes). */
  requestRender(): void;
  dispose(): void;
}

function createRenderer(options: StageOptions): WebGLRenderer | null {
  try {
    const renderer = new WebGLRenderer({
      antialias: options.antialias,
      alpha: options.alpha ?? true,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxDpr ?? MAX_DPR));
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
}

interface Loop {
  readonly flags: LoopFlags;
  sync(): void;
  requestRender(): void;
  stop(): void;
}

/** rAF loop that runs only while visible, plus a coalesced single-frame render for static mode. */
function createLoop(options: StageOptions, renderer: WebGLRenderer): Loop {
  const flags: LoopFlags = { onscreen: true, contextLost: false, disposed: false };
  let rafId = 0;
  let staticRaf = 0;
  let last = 0;
  let elapsed = 0;

  const shouldRun = (): boolean =>
    !options.reducedMotion && flags.onscreen && !document.hidden && !flags.contextLost && !flags.disposed;

  const draw = (dt: number): void => {
    options.onFrame(dt, elapsed);
    options.render(renderer);
  };

  const tick = (now: number): void => {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, MAX_FRAME_DT);
    last = now;
    elapsed += dt;
    draw(dt);
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
  };

  return { flags, sync, requestRender, stop };
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
    if (options.reducedMotion || !flags.onscreen || document.hidden) loop.requestRender();
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

  return () => {
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

  const dispose = (): void => {
    if (loop.flags.disposed) return;
    loop.flags.disposed = true;
    loop.stop();
    unbind();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  return { renderer, canvas, requestRender: loop.requestRender, dispose };
}
