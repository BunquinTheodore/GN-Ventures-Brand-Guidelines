import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WireframeGeometry,
} from 'three';
import { DEPARTMENT_BODIES, type DepartmentBody } from './departments';
import { disposeAll } from './dispose';
import {
  clamp,
  damp,
  dollyDistance,
  orbitAngle,
  orbitPoint,
  orbitRingPoints,
  writeTrailVertices,
} from './math';
import { GLOW_FRAGMENT, GLOW_VERTEX, TRAIL_FRAGMENT, TRAIL_VERTEX } from './shaders';
import { createStarfield } from './starfield';

/** Overall luminance cap: everything is multiplied by this so text stays readable. */
const DIM = 0.6;
const CORE_COLOR = '#C6F24E';
const TRAIL_SAMPLES = 48;
const TRAIL_ARC = 0.95;
const TRAIL_WIDTH = 0.09;
const RING_SEGMENTS = 160;
const BODY_RADIUS = 0.12;
const NEAR_DISTANCE = 9.5;
const FAR_DISTANCE = 15;

export interface BackgroundInput {
  /** Page scroll progress, 0 to 1. */
  readonly scroll: number;
  /** Pointer in -1..1 on both axes (y up). */
  readonly pointerX: number;
  readonly pointerY: number;
}

export interface BackgroundScene {
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  resize(width: number, height: number, pixelRatio: number): void;
  /** Index into DEPARTMENT_BODIES, or -1 for none (umbrella / core focus). */
  setActive(index: number): void;
  update(dt: number, elapsed: number, input: BackgroundInput): void;
  dispose(): void;
}

interface BodyRig {
  readonly body: DepartmentBody;
  readonly color: Color;
  readonly mesh: Mesh;
  readonly glow: Mesh;
  readonly glowMaterial: ShaderMaterial;
  readonly trailBuffer: Float32Array;
  readonly trailAttribute: BufferAttribute;
  readonly trailMaterial: ShaderMaterial;
  readonly ringMaterial: LineBasicMaterial;
  focus: number;
}

function glowMaterial(color: Color): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: GLOW_VERTEX,
    fragmentShader: GLOW_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uColor: { value: color.clone() }, uIntensity: { value: 0.5 } },
  });
}

function createTrailGeometry(buffer: Float32Array): { geometry: BufferGeometry; attribute: BufferAttribute } {
  const geometry = new BufferGeometry();
  const attribute = new BufferAttribute(buffer, 3);
  attribute.setUsage(DynamicDrawUsage);
  const fade = new Float32Array(TRAIL_SAMPLES * 2);
  const indices: number[] = [];
  for (let i = 0; i < TRAIL_SAMPLES; i += 1) {
    const f = 1 - i / (TRAIL_SAMPLES - 1);
    fade[i * 2] = f;
    fade[i * 2 + 1] = f;
    if (i < TRAIL_SAMPLES - 1) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  geometry.setAttribute('position', attribute);
  geometry.setAttribute('aFade', new BufferAttribute(fade, 1));
  geometry.setIndex(indices);
  return { geometry, attribute };
}

function createBodyRig(body: DepartmentBody, scene: Scene, planeGeometry: PlaneGeometry, sphere: SphereGeometry): BodyRig {
  const color = new Color(body.accent);

  const mesh = new Mesh(sphere, new MeshBasicMaterial({ color: color.clone().multiplyScalar(0.9) }));
  const glow = new Mesh(planeGeometry, glowMaterial(color));
  const glowMat = glow.material as ShaderMaterial;
  glow.renderOrder = 2;

  const trailBuffer = new Float32Array(TRAIL_SAMPLES * 2 * 3);
  const { geometry: trailGeometry, attribute } = createTrailGeometry(trailBuffer);
  const trailMaterial = new ShaderMaterial({
    vertexShader: TRAIL_VERTEX,
    fragmentShader: TRAIL_FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
    uniforms: { uColor: { value: color.clone() }, uOpacity: { value: 0.4 } },
  });
  const trail = new Mesh(trailGeometry, trailMaterial);
  trail.frustumCulled = false;

  const ringGeometry = new BufferGeometry();
  ringGeometry.setAttribute('position', new BufferAttribute(orbitRingPoints(body.orbit, RING_SEGMENTS), 3));
  const ringMaterial = new LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const ring = new LineLoop(ringGeometry, ringMaterial);

  scene.add(ring, trail, mesh, glow);
  return { body, color, mesh, glow, glowMaterial: glowMat, trailBuffer, trailAttribute: attribute, trailMaterial, ringMaterial, focus: 0 };
}

function createCore(scene: Scene, plane: PlaneGeometry): { glowMaterial: ShaderMaterial; glow: Mesh; spin: LineSegments; spinOuter: LineSegments } {
  const lime = new Color(CORE_COLOR);
  const wire = (radius: number, detail: number, opacity: number): LineSegments => {
    const source = new IcosahedronGeometry(radius, detail);
    const edges = new WireframeGeometry(source);
    source.dispose();
    return new LineSegments(
      edges,
      new LineBasicMaterial({ color: lime, transparent: true, opacity, depthWrite: false, blending: AdditiveBlending }),
    );
  };
  const spin = wire(0.85, 1, 0.5 * DIM + 0.2);
  const spinOuter = wire(1.25, 0, 0.2);
  const inner = new Mesh(
    new IcosahedronGeometry(0.45, 1),
    new MeshBasicMaterial({ color: lime.clone().multiplyScalar(0.5), transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false }),
  );
  spin.add(inner);
  const glowMat = glowMaterial(lime);
  const glow = new Mesh(plane, glowMat);
  glow.scale.setScalar(7);
  glow.renderOrder = 1;
  scene.add(spin, spinOuter, glow);
  return { glowMaterial: glowMat, glow, spin, spinOuter };
}

/** Build the orbital venture system: core, six department bodies, trails, rings and stars. */
export function createBackgroundScene(pixelRatio: number): BackgroundScene {
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 400);
  const plane = new PlaneGeometry(1, 1);
  const sphere = new SphereGeometry(BODY_RADIUS, 16, 12);
  const stars = createStarfield(DIM, pixelRatio);
  scene.add(stars.group);
  const core = createCore(scene, plane);
  const rigs = DEPARTMENT_BODIES.map((body) => createBodyRig(body, scene, plane, sphere));

  const limeTint = new Color(CORE_COLOR);
  const tint = limeTint.clone();
  const target = new Color();
  const look = new Vector3();
  const focusPoint = new Vector3();
  const position = new Vector3();
  const state = { active: -1, pulse: 0, focusMix: 0, scroll: 0, px: 0, py: 0, distanceScale: 1 };

  const updateBodies = (dt: number, elapsed: number): void => {
    rigs.forEach((rig, index) => {
      rig.focus = damp(rig.focus, index === state.active ? 1 : 0, 3, dt);
      const theta = orbitAngle(rig.body.orbit, elapsed);
      const [x, y, z] = orbitPoint(rig.body.orbit, theta);
      rig.mesh.position.set(x, y, z);
      rig.mesh.scale.setScalar(1 + rig.focus * 0.9);
      rig.glow.position.set(x, y, z);
      rig.glow.quaternion.copy(camera.quaternion);
      rig.glow.scale.setScalar(0.9 + rig.focus * 0.9);
      rig.glowMaterial.uniforms.uIntensity.value = (0.55 + rig.focus * 0.7) * DIM;
      writeTrailVertices(rig.trailBuffer, rig.body.orbit, theta, TRAIL_SAMPLES, TRAIL_ARC, TRAIL_WIDTH * (1 + rig.focus * 0.6));
      rig.trailAttribute.needsUpdate = true;
      rig.trailMaterial.uniforms.uOpacity.value = (0.45 + rig.focus * 0.5) * DIM;
      rig.ringMaterial.opacity = (0.1 + rig.focus * 0.28) * DIM;
    });
  };

  const updateCore = (dt: number, elapsed: number): void => {
    state.pulse = damp(state.pulse, 0, 2.2, dt);
    const accent = state.active >= 0 ? rigs[state.active].color : limeTint;
    tint.lerp(target.copy(accent), 1 - Math.exp(-2 * dt));
    core.spin.rotation.set(elapsed * 0.07, elapsed * 0.12, 0);
    core.spinOuter.rotation.set(-elapsed * 0.05, -elapsed * 0.08, elapsed * 0.03);
    const scale = 1 + state.pulse * 0.18;
    core.spin.scale.setScalar(scale);
    core.spinOuter.scale.setScalar(scale);
    core.glow.quaternion.copy(camera.quaternion);
    core.glow.scale.setScalar(7 * (1 + state.pulse * 0.1));
    core.glowMaterial.uniforms.uColor.value.copy(tint);
    core.glowMaterial.uniforms.uIntensity.value = (0.8 + state.pulse * 0.7) * DIM;
  };

  const updateStars = (elapsed: number): void => {
    stars.materials.forEach((material) => {
      material.uniforms.uTime.value = elapsed;
    });
    stars.layers.forEach(({ points, spec }) => {
      points.rotation.y = elapsed * spec.drift + state.scroll * 0.6 * spec.parallax + state.px * 0.04 * spec.parallax;
      points.rotation.x = state.scroll * 0.25 * spec.parallax - state.py * 0.03 * spec.parallax;
    });
  };

  const updateCamera = (dt: number, elapsed: number): void => {
    const hasFocus = state.active >= 0;
    state.focusMix = damp(state.focusMix, hasFocus ? 1 : 0, 2.5, dt);
    const rig = hasFocus ? rigs[state.active] : null;
    if (rig) focusPoint.copy(rig.mesh.position).multiplyScalar(0.5);
    else focusPoint.set(0, 0, 0);
    look.set(damp(look.x, focusPoint.x, 2.5, dt), damp(look.y, focusPoint.y, 2.5, dt), damp(look.z, focusPoint.z, 2.5, dt));

    const distance = (dollyDistance(state.scroll, NEAR_DISTANCE, FAR_DISTANCE) - state.focusMix * 1.4) * state.distanceScale;
    const azimuth = state.scroll * 0.9 + elapsed * 0.02;
    const elevation = 0.3 - state.scroll * 0.12 + state.py * 0.06;
    const flat = Math.cos(elevation) * distance;
    position.set(Math.sin(azimuth) * flat + state.px * 0.55, Math.sin(elevation) * distance + state.py * 0.35, Math.cos(azimuth) * flat);
    camera.position.copy(position).add(look.clone().multiplyScalar(0.35));
    const roll = state.scroll * 0.6;
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.lookAt(look);
  };

  return {
    scene,
    camera,
    resize(width, height, ratio) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      state.distanceScale = camera.aspect < 1 ? 1 + (1 - camera.aspect) * 0.75 : 1;
      stars.materials.forEach((material) => {
        material.uniforms.uPx.value = ratio;
      });
    },
    setActive(index) {
      if (index === state.active) return;
      state.active = index;
      state.pulse = 1;
    },
    update(dt, elapsed, input) {
      state.scroll = damp(state.scroll, clamp(input.scroll, 0, 1), 3, dt);
      state.px = damp(state.px, input.pointerX, 3, dt);
      state.py = damp(state.py, input.pointerY, 3, dt);
      updateCamera(dt, elapsed);
      updateBodies(dt, elapsed);
      updateCore(dt, elapsed);
      updateStars(elapsed);
    },
    dispose() {
      stars.dispose();
      disposeAll([scene, plane, sphere]);
    },
  };
}
