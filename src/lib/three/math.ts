/**
 * Pure helpers shared by the three.js scenes: easing, springs, orbit math,
 * camera fitting and a seeded PRNG. Nothing here touches three.js or the DOM,
 * so every function can be reasoned about (and unit tested) in isolation.
 */

export type Vec3 = readonly [number, number, number];

export const TAU = Math.PI * 2;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Frame-rate independent exponential smoothing toward a target. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function easeOutCubic(t: number): number {
  const x = clamp(t, 0, 1);
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(t: number): number {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Nearest whole turn (multiple of 2 PI) to an angle. */
export function nearestTurn(angle: number): number {
  return Math.round(angle / TAU) * TAU;
}

/* ------------------------------------------------------------------ */
/* Spring                                                              */
/* ------------------------------------------------------------------ */

export interface SpringState {
  readonly value: number;
  readonly velocity: number;
}

const SPRING_SUBSTEP = 1 / 120;
const SPRING_MAX_DT = 0.1;

/**
 * Advance a damped spring toward `target`. Semi-implicit Euler with fixed
 * substeps so large frame gaps cannot blow the simulation up. Returns a new
 * state, the input is never mutated.
 */
export function springStep(
  state: SpringState,
  target: number,
  stiffness: number,
  damping: number,
  dt: number,
): SpringState {
  const total = clamp(dt, 0, SPRING_MAX_DT);
  const steps = Math.max(1, Math.ceil(total / SPRING_SUBSTEP));
  const h = total / steps;
  let value = state.value;
  let velocity = state.velocity;
  for (let i = 0; i < steps; i += 1) {
    velocity += (stiffness * (target - value) - damping * velocity) * h;
    value += velocity * h;
  }
  return { value, velocity };
}

/* ------------------------------------------------------------------ */
/* Orbits                                                              */
/* ------------------------------------------------------------------ */

export interface OrbitSpec {
  /** Semi-major axis (along the orbit's local X). */
  readonly semiMajor: number;
  /** Semi-minor axis (along the orbit's local Z). */
  readonly semiMinor: number;
  /** Tilt about the world X axis, radians. */
  readonly tiltX: number;
  /** Tilt about the world Z axis, radians. */
  readonly tiltZ: number;
  /** Starting angle, radians. */
  readonly phase: number;
  /** Angular speed, radians per second. */
  readonly angularSpeed: number;
}

/** Position on the tilted ellipse at orbit angle `theta`. */
export function orbitPoint(spec: OrbitSpec, theta: number): Vec3 {
  const x0 = spec.semiMajor * Math.cos(theta);
  const z0 = spec.semiMinor * Math.sin(theta);
  // rotate about X (y0 = 0)
  const cx = Math.cos(spec.tiltX);
  const sx = Math.sin(spec.tiltX);
  const y1 = -z0 * sx;
  const z1 = z0 * cx;
  // rotate about Z
  const cz = Math.cos(spec.tiltZ);
  const sz = Math.sin(spec.tiltZ);
  return [x0 * cz - y1 * sz, x0 * sz + y1 * cz, z1];
}

export function orbitAngle(spec: OrbitSpec, elapsed: number): number {
  return spec.phase + spec.angularSpeed * elapsed;
}

export function orbitPosition(spec: OrbitSpec, elapsed: number): Vec3 {
  return orbitPoint(spec, orbitAngle(spec, elapsed));
}

/** Kepler-flavoured angular speed: farther orbits are slower (T ~ a^1.5). */
export function keplerSpeed(semiMajor: number, scale: number): number {
  return scale / Math.pow(semiMajor, 1.5);
}

/** Closed ring of `segments` points around the orbit, as a flat xyz array. */
export function orbitRingPoints(spec: OrbitSpec, segments: number): Float32Array {
  const out = new Float32Array(segments * 3);
  for (let i = 0; i < segments; i += 1) {
    const [x, y, z] = orbitPoint(spec, (i / segments) * TAU);
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/**
 * Fill `out` with ribbon vertices trailing behind the body: `samples` pairs of
 * vertices, each pair offset along the in-plane radial direction so the strip
 * lies flat in the orbit plane. The buffer is the one deliberate mutation in
 * this module (it is a per-frame GPU upload buffer).
 */
export function writeTrailVertices(
  out: Float32Array,
  spec: OrbitSpec,
  theta: number,
  samples: number,
  arc: number,
  width: number,
): void {
  const direction = Math.sign(spec.angularSpeed) || 1;
  for (let i = 0; i < samples; i += 1) {
    const f = i / (samples - 1);
    const [x, y, z] = orbitPoint(spec, theta - direction * arc * f);
    const len = Math.hypot(x, y, z) || 1;
    const half = width * (1 - f * 0.85) * 0.5;
    const nx = (x / len) * half;
    const ny = (y / len) * half;
    const nz = (z / len) * half;
    const o = i * 6;
    out[o] = x + nx;
    out[o + 1] = y + ny;
    out[o + 2] = z + nz;
    out[o + 3] = x - nx;
    out[o + 4] = y - ny;
    out[o + 5] = z - nz;
  }
}

/* ------------------------------------------------------------------ */
/* Scroll and camera                                                   */
/* ------------------------------------------------------------------ */

/** 0 at the top of the page, 1 at the bottom. Safe for short pages. */
export function scrollProgress(scrollY: number, viewportHeight: number, documentHeight: number): number {
  const range = documentHeight - viewportHeight;
  if (range <= 1) return 0;
  return clamp(scrollY / range, 0, 1);
}

/** Camera distance for a scroll progress: far at the top, near at the end. */
export function dollyDistance(progress: number, near: number, far: number): number {
  return lerp(far, near, easeInOutCubic(progress));
}

/** Distance at which a square of `size` fits a perspective camera view. */
export function fitDistance(size: number, fovDeg: number, aspect: number, padding = 1.12): number {
  const halfFov = (fovDeg * Math.PI) / 360;
  const fitHeight = (size * padding) / 2 / Math.tan(halfFov);
  return aspect >= 1 ? fitHeight : fitHeight / aspect;
}

/* ------------------------------------------------------------------ */
/* Seeded PRNG                                                         */
/* ------------------------------------------------------------------ */

/** mulberry32: tiny deterministic generator so star layouts are stable. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
