import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Group, Points, ShaderMaterial } from 'three';
import { disposeAll } from './dispose';
import { mulberry32, TAU } from './math';
import { STAR_FRAGMENT, STAR_VERTEX } from './shaders';

/** Colour grading targets for a sparse minority of stars: lime, cyan, amber. */
const GRADES: readonly { readonly color: string; readonly chance: number }[] = [
  { color: '#C6F24E', chance: 0.1 },
  { color: '#33c7e0', chance: 0.07 },
  { color: '#f2b84e', chance: 0.05 },
];
const BASE_STAR = '#b9c4cc';

interface LayerSpec {
  readonly count: number;
  readonly innerRadius: number;
  readonly outerRadius: number;
  readonly size: number;
  /** Rotation speed about Y, radians per second. */
  readonly drift: number;
  /** How strongly the pointer / scroll moves this layer (parallax depth). */
  readonly parallax: number;
}

/** Near layers move more, far layers less, which reads as depth. */
const LAYERS: readonly LayerSpec[] = [
  { count: 130, innerRadius: 26, outerRadius: 42, size: 1.5, drift: 0.006, parallax: 1 },
  { count: 150, innerRadius: 44, outerRadius: 72, size: 2.1, drift: 0.003, parallax: 0.6 },
  { count: 130, innerRadius: 76, outerRadius: 130, size: 3.0, drift: 0.0015, parallax: 0.3 },
];

export interface Starfield {
  readonly group: Group;
  readonly layers: readonly { readonly points: Points; readonly spec: LayerSpec }[];
  readonly materials: readonly ShaderMaterial[];
  dispose(): void;
}

function pickColor(random: () => number, scratch: Color): Color {
  const roll = random();
  let acc = 0;
  for (const grade of GRADES) {
    acc += grade.chance;
    if (roll < acc) return scratch.set(grade.color);
  }
  const shade = 0.4 + random() * 0.6;
  return scratch.set(BASE_STAR).multiplyScalar(shade);
}

function buildLayer(spec: LayerSpec, seed: number): { geometry: BufferGeometry } {
  const random = mulberry32(seed);
  const positions = new Float32Array(spec.count * 3);
  const colors = new Float32Array(spec.count * 3);
  const sizes = new Float32Array(spec.count);
  const phases = new Float32Array(spec.count);
  const scratch = new Color();
  for (let i = 0; i < spec.count; i += 1) {
    const radius = spec.innerRadius + random() * (spec.outerRadius - spec.innerRadius);
    const theta = random() * TAU;
    const z = random() * 2 - 1;
    const ring = Math.sqrt(1 - z * z);
    positions.set([radius * ring * Math.cos(theta), radius * z, radius * ring * Math.sin(theta)], i * 3);
    const color = pickColor(random, scratch);
    colors.set([color.r, color.g, color.b], i * 3);
    sizes[i] = spec.size * (0.55 + random() * 0.9);
    phases[i] = random();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new BufferAttribute(colors, 3));
  geometry.setAttribute('aSize', new BufferAttribute(sizes, 1));
  geometry.setAttribute('aPhase', new BufferAttribute(phases, 1));
  return { geometry };
}

export function createStarfield(dim: number, pixelRatio: number): Starfield {
  const group = new Group();
  const materials: ShaderMaterial[] = [];
  const layers = LAYERS.map((spec, index) => {
    const { geometry } = buildLayer(spec, 0x9e3779b1 + index * 7919);
    const material = new ShaderMaterial({
      vertexShader: STAR_VERTEX,
      fragmentShader: STAR_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPx: { value: pixelRatio },
        uScale: { value: 38 },
        uDim: { value: dim },
      },
    });
    materials.push(material);
    const points = new Points(geometry, material);
    points.frustumCulled = false;
    group.add(points);
    return { points, spec };
  });
  return { group, layers, materials, dispose: () => disposeAll([group]) };
}
