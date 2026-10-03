import { clamp } from './math';
import type { PlateFrameInput } from './plateMotion';

/** Radians of rotation per dragged pixel. */
const YAW_PER_PIXEL = 0.012;
const PITCH_PER_PIXEL = 0.006;
/** How far beyond the plate (in plate sizes) the pointer still tilts it. */
const REACH = 1.2;

export interface PlateInputTracker {
  /** Read one frame of input and consume pending drag deltas and reset. */
  sample(): Omit<PlateFrameInput, 'nudge'>;
  requestReset(): void;
  dispose(): void;
}

/**
 * Pointer tracking for a plate: hover position (window wide, so the plate
 * tilts toward the pointer wherever it is), drag to spin, double click reset.
 * Listeners are removed by `dispose`.
 */
export function createPlateInput(container: HTMLElement, onActivity: () => void = () => undefined): PlateInputTracker {
  let pointerX = 0;
  let pointerY = 0;
  let dragging = false;
  let activeId = -1;
  let lastX = 0;
  let lastY = 0;
  let pendingYaw = 0;
  let pendingPitch = 0;
  let pendingReset = false;

  container.style.touchAction = 'pan-y';
  container.style.userSelect = 'none';

  const onWindowMove = (event: PointerEvent): void => {
    const rect = container.getBoundingClientRect();
    const reach = Math.max(rect.width, rect.height, 1) * REACH;
    pointerX = clamp((event.clientX - (rect.left + rect.width / 2)) / reach, -1, 1);
    pointerY = clamp(-(event.clientY - (rect.top + rect.height / 2)) / reach, -1, 1);
    if (dragging && event.pointerId === activeId) {
      pendingYaw += (event.clientX - lastX) * YAW_PER_PIXEL;
      pendingPitch += (event.clientY - lastY) * PITCH_PER_PIXEL;
      lastX = event.clientX;
      lastY = event.clientY;
    }
    onActivity();
  };

  const onDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    dragging = true;
    activeId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    onActivity();
    try {
      container.setPointerCapture(event.pointerId);
    } catch {
      // Capture is a nicety, dragging still works through window listeners.
    }
  };

  const onUp = (event: PointerEvent): void => {
    if (event.pointerId !== activeId) return;
    dragging = false;
    activeId = -1;
    if (event.pointerType === 'touch') {
      pointerX = 0;
      pointerY = 0;
    }
    onActivity();
  };

  const onLeave = (): void => {
    pointerX = 0;
    pointerY = 0;
    onActivity();
  };
  const onDouble = (): void => {
    pendingReset = true;
    onActivity();
  };

  window.addEventListener('pointermove', onWindowMove, { passive: true });
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  document.documentElement.addEventListener('pointerleave', onLeave);
  container.addEventListener('pointerdown', onDown);
  container.addEventListener('dblclick', onDouble);

  return {
    sample() {
      const frame = { pointerX, pointerY, dragging, dragYaw: pendingYaw, dragPitch: pendingPitch, reset: pendingReset };
      pendingYaw = 0;
      pendingPitch = 0;
      pendingReset = false;
      return frame;
    },
    requestReset() {
      pendingReset = true;
      onActivity();
    },
    dispose() {
      window.removeEventListener('pointermove', onWindowMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('dblclick', onDouble);
    },
  };
}
