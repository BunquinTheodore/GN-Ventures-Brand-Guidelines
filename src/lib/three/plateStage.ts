import { PerspectiveCamera, Scene, type CanvasTexture } from 'three';
import { fitDistance, nearestTurn } from './math';
import { createPlate, PLATE_SIZE } from './plate';
import { createPlateInput } from './plateInput';
import {
  createPlateMotion,
  plateRotation,
  stepPlateMotion,
  type PlateMotionConfig,
  type PlateMotionState,
} from './plateMotion';
import { createStage } from './renderer';
import { loadLogoTexture } from './textures';

export type PlateStatus = 'loading' | 'ready' | 'fallback';
export type PlateMode = 'hero' | 'viewer';

export interface PlateStageOptions {
  readonly container: HTMLElement;
  readonly src: string;
  readonly mode: PlateMode;
  readonly onStatus: (status: PlateStatus) => void;
}

export interface PlateStageHandle {
  setSrc(src: string): void;
  /** Add yaw velocity (radians per second), used for keyboard rotation. */
  nudge(velocity: number): void;
  reset(): void;
  dispose(): void;
}

const CONFIGS: Record<PlateMode, PlateMotionConfig> = {
  hero: { autoRotate: 0, settle: true, maxTiltX: 0.38, maxTiltY: 0.5 },
  viewer: { autoRotate: 0.35, settle: false, maxTiltX: 0.2, maxTiltY: 0.25 },
};
const FOV = 35;
const FIT_SIZE = PLATE_SIZE * 1.25;
const SWAP_FLOURISH = 7.5;
const FLOAT_AMPLITUDE = 0.03;

const MAX_PLATE_DPR = 1.5;
/** Below these the springs count as at rest (radians, radians per second). */
const REST_POSITION_EPSILON = 0.0008;
const REST_VELOCITY_EPSILON = 0.004;
const SETTLE_VELOCITY = 0.04;

function isStill(velocity: number): boolean {
  return Math.abs(velocity) < REST_VELOCITY_EPSILON;
}

/** True while the plate still has motion to show; false lets the on-demand loop sleep. */
function isPlateAnimating(state: PlateMotionState, config: PlateMotionConfig, dragging: boolean): boolean {
  if (dragging) return true;
  if (!state.interacted && config.autoRotate > 0) return true;
  if (Math.abs(state.yawVelocity) >= SETTLE_VELOCITY || Math.abs(state.pitchOffset) > REST_POSITION_EPSILON) return true;
  if (config.settle && state.interacted && Math.abs(state.yawTarget - nearestTurn(state.yawTarget)) > REST_POSITION_EPSILON) return true;
  if (Math.abs(state.yaw.value - state.yawTarget) > REST_POSITION_EPSILON) return true;
  return !(isStill(state.yaw.velocity) && isStill(state.tiltX.velocity) && isStill(state.tiltY.velocity));
}

const NOOP_HANDLE: PlateStageHandle = { setSrc() {}, nudge() {}, reset() {}, dispose() {} };

/**
 * Mount the interactive logo plate into `container`. Returns a handle to swap
 * the logo, nudge or reset it, and tear everything down. Falls back (status
 * 'fallback') when WebGL or the texture is unavailable.
 */
export function createPlateStage(options: PlateStageOptions): PlateStageHandle {
  const { container, mode, onStatus } = options;
  const config = CONFIGS[mode];
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.z = fitDistance(FIT_SIZE, FOV, 1);
  const plate = createPlate();
  scene.add(plate.group, plate.lights);

  // The stage does not exist yet when input first fires, so wake through a late-bound ref.
  let wake: () => void = () => undefined;
  const input = createPlateInput(container, () => wake());
  const textures = new Map<string, CanvasTexture>();
  let motion = createPlateMotion();
  let pendingNudge = 0;
  let currentSrc = '';
  let hasTexture = false;
  let disposed = false;

  const stage = createStage({
    container,
    antialias: true,
    maxDpr: MAX_PLATE_DPR,
    onDemand: true,
    reducedMotion: false,
    onResize(width, height) {
      camera.aspect = width / height;
      camera.position.z = fitDistance(FIT_SIZE, FOV, camera.aspect);
      camera.updateProjectionMatrix();
    },
    onFrame(dt, elapsed) {
      const sampled = input.sample();
      motion = stepPlateMotion(motion, config, { ...sampled, nudge: pendingNudge }, dt);
      pendingNudge = 0;
      const rotation = plateRotation(motion);
      plate.group.rotation.set(rotation.x, rotation.y, Math.sin(elapsed * 0.6) * 0.015);
      plate.group.position.y = Math.sin(elapsed * 0.9) * FLOAT_AMPLITUDE;
      plate.setSheen(sampled.pointerX, sampled.pointerY, 0.7 + sampled.pointerX * 0.6 - sampled.pointerY * 0.3 + Math.sin(elapsed * 0.6) * 0.15);
      return isPlateAnimating(motion, config, sampled.dragging);
    },
    render(renderer) {
      renderer.render(scene, camera);
    },
  });

  if (stage) wake = stage.invalidate;

  if (!stage) {
    input.dispose();
    plate.dispose();
    onStatus('fallback');
    return NOOP_HANDLE;
  }

  const apply = (texture: CanvasTexture): void => {
    plate.setTexture(texture);
    if (hasTexture && mode === 'viewer') pendingNudge = SWAP_FLOURISH;
    hasTexture = true;
    wake();
    onStatus('ready');
  };

  const setSrc = (src: string): void => {
    if (src === currentSrc) return;
    currentSrc = src;
    const cached = textures.get(src);
    if (cached) {
      apply(cached);
      return;
    }
    loadLogoTexture(src)
      .then((texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        textures.set(src, texture);
        if (currentSrc === src) apply(texture);
      })
      .catch(() => {
        if (!disposed && !hasTexture) onStatus('fallback');
      });
  };

  setSrc(options.src);

  return {
    setSrc,
    nudge(velocity) {
      pendingNudge += velocity;
      wake();
    },
    reset() {
      input.requestReset();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      input.dispose();
      stage.dispose();
      plate.dispose();
      textures.forEach((texture) => texture.dispose());
      textures.clear();
    },
  };
}
