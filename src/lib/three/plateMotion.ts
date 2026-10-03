import { clamp, damp, nearestTurn, springStep, type SpringState } from './math';

/**
 * Pure motion model for the interactive logo plate: pointer tilt springs,
 * drag spin with inertia, optional auto-rotate and settle-to-front. Each step
 * returns a new state, nothing is mutated.
 */

export interface PlateMotionConfig {
  /** Radians per second of idle rotation until the user interacts (0 = none). */
  readonly autoRotate: number;
  /** Ease back to the nearest front-facing turn after a drag finishes. */
  readonly settle: boolean;
  readonly maxTiltX: number;
  readonly maxTiltY: number;
}

export interface PlateMotionState {
  readonly tiltX: SpringState;
  readonly tiltY: SpringState;
  readonly yaw: SpringState;
  readonly yawTarget: number;
  readonly yawVelocity: number;
  readonly pitchOffset: number;
  readonly interacted: boolean;
  readonly idleSeconds: number;
}

export interface PlateFrameInput {
  /** Pointer relative to the plate, each axis in -1..1. */
  readonly pointerX: number;
  readonly pointerY: number;
  readonly dragging: boolean;
  /** Radians of yaw / pitch accumulated by dragging since the last frame. */
  readonly dragYaw: number;
  readonly dragPitch: number;
  readonly reset: boolean;
  /** Extra yaw velocity to inject (keyboard nudge, swap flourish). */
  readonly nudge: number;
}

export const IDLE_INPUT: PlateFrameInput = {
  pointerX: 0,
  pointerY: 0,
  dragging: false,
  dragYaw: 0,
  dragPitch: 0,
  reset: false,
  nudge: 0,
};

const REST: SpringState = { value: 0, velocity: 0 };
const TILT_STIFFNESS = 60;
const TILT_DAMPING = 10;
const YAW_STIFFNESS = 120;
const YAW_DAMPING = 18;
const INERTIA_DECAY = 2.4;
const PITCH_LIMIT = 0.6;
const SETTLE_DELAY = 1.2;
const SETTLE_SPEED_EPSILON = 0.05;
const VELOCITY_BLEND = 0.5;

export function createPlateMotion(): PlateMotionState {
  return {
    tiltX: REST,
    tiltY: REST,
    yaw: REST,
    yawTarget: 0,
    yawVelocity: 0,
    pitchOffset: 0,
    interacted: false,
    idleSeconds: 0,
  };
}

function applyYawInput(
  s: PlateMotionState,
  cfg: PlateMotionConfig,
  inp: PlateFrameInput,
  dt: number,
): Pick<PlateMotionState, 'yawTarget' | 'yawVelocity' | 'pitchOffset' | 'interacted' | 'idleSeconds'> {
  if (inp.reset) {
    return { yawTarget: nearestTurn(s.yaw.value), yawVelocity: 0, pitchOffset: 0, interacted: true, idleSeconds: 0 };
  }
  if (inp.dragging) {
    const measured = dt > 0 ? inp.dragYaw / dt : 0;
    return {
      yawTarget: s.yawTarget + inp.dragYaw,
      yawVelocity: s.yawVelocity * (1 - VELOCITY_BLEND) + measured * VELOCITY_BLEND,
      pitchOffset: clamp(s.pitchOffset + inp.dragPitch, -PITCH_LIMIT, PITCH_LIMIT),
      interacted: true,
      idleSeconds: 0,
    };
  }
  const velocity = (s.yawVelocity + inp.nudge) * Math.exp(-INERTIA_DECAY * dt);
  const interacted = s.interacted || inp.nudge !== 0;
  let yawTarget = s.yawTarget + velocity * dt;
  if (!interacted) yawTarget += cfg.autoRotate * dt;
  const resting = Math.abs(velocity) < SETTLE_SPEED_EPSILON;
  const idleSeconds = resting ? s.idleSeconds + dt : 0;
  if (cfg.settle && interacted && idleSeconds > SETTLE_DELAY) {
    yawTarget = damp(yawTarget, nearestTurn(yawTarget), 2, dt);
  }
  return { yawTarget, yawVelocity: velocity, pitchOffset: damp(s.pitchOffset, 0, 3, dt), interacted, idleSeconds };
}

export function stepPlateMotion(
  state: PlateMotionState,
  cfg: PlateMotionConfig,
  input: PlateFrameInput,
  dt: number,
): PlateMotionState {
  const yawPart = applyYawInput(state, cfg, input, dt);
  return {
    tiltX: springStep(state.tiltX, -clamp(input.pointerY, -1, 1) * cfg.maxTiltX, TILT_STIFFNESS, TILT_DAMPING, dt),
    tiltY: springStep(state.tiltY, clamp(input.pointerX, -1, 1) * cfg.maxTiltY, TILT_STIFFNESS, TILT_DAMPING, dt),
    yaw: springStep(state.yaw, yawPart.yawTarget, YAW_STIFFNESS, YAW_DAMPING, dt),
    ...yawPart,
  };
}

/** Euler X (pitch) and Y (yaw) rotation for the plate group. */
export function plateRotation(state: PlateMotionState): { readonly x: number; readonly y: number } {
  return { x: state.tiltX.value + state.pitchOffset, y: state.yaw.value + state.tiltY.value };
}
