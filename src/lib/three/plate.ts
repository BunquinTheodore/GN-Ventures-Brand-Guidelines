import {
  AmbientLight,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Shape,
  ShaderMaterial,
  type Texture,
} from 'three';
import { PLATE_FRAGMENT, PLATE_VERTEX } from './shaders';
import { disposeAll } from './dispose';

/** Plate edge length in world units. The camera is fitted to this. */
export const PLATE_SIZE = 1.7;
const CORNER_RADIUS = 0.16;
const DEPTH = 0.07;
const BEVEL = 0.022;

export interface Plate {
  /** Rotate / float this group. */
  readonly group: Group;
  /** Lights live outside `group` so spinning the plate changes how they hit the bevel. */
  readonly lights: Group;
  readonly keyLight: DirectionalLight;
  readonly faceMaterial: ShaderMaterial;
  setTexture(texture: Texture | null): void;
  /** Light position / sheen uniforms from a pointer in -1..1. */
  setSheen(pointerX: number, pointerY: number, sweep: number): void;
  dispose(): void;
}

function roundedRect(size: number, radius: number): Shape {
  const h = size / 2;
  const r = radius;
  const shape = new Shape();
  shape.moveTo(-h + r, -h);
  shape.lineTo(h - r, -h);
  shape.quadraticCurveTo(h, -h, h, -h + r);
  shape.lineTo(h, h - r);
  shape.quadraticCurveTo(h, h, h - r, h);
  shape.lineTo(-h + r, h);
  shape.quadraticCurveTo(-h, h, -h, h - r);
  shape.lineTo(-h, -h + r);
  shape.quadraticCurveTo(-h, -h, -h + r, -h);
  return shape;
}

function createFaceMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: PLATE_VERTEX,
    fragmentShader: PLATE_FRAGMENT,
    uniforms: {
      uMap: { value: null },
      uHasMap: { value: 0 },
      uSize: { value: PLATE_SIZE },
      uLight: { value: [0, 0] },
      uSweep: { value: 0.7 },
    },
  });
}

function createGeometry(): ExtrudeGeometry {
  const geometry = new ExtrudeGeometry(roundedRect(PLATE_SIZE, CORNER_RADIUS), {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelOffset: -BEVEL,
    bevelSegments: 4,
    curveSegments: 10,
  });
  geometry.center();
  return geometry;
}

/** Build the plate mesh (textured face shader plus a lit metallic bevel) and its lights. */
export function createPlate(): Plate {
  const group = new Group();
  const faceMaterial = createFaceMaterial();
  const sideMaterial = new MeshStandardMaterial({ color: 0x1b2016, metalness: 0.55, roughness: 0.32 });
  const geometry = createGeometry();
  // ExtrudeGeometry groups: 0 = front and back caps, 1 = sides and bevel.
  const mesh = new Mesh(geometry, [faceMaterial, sideMaterial]);
  group.add(mesh);

  const ambient = new AmbientLight(0xffffff, 0.7);
  const keyLight = new DirectionalLight(0xe6ff9a, 2.2);
  keyLight.position.set(1.5, 2, 3);
  const rimLight = new DirectionalLight(0x3ed6d6, 1.4);
  rimLight.position.set(-3, -1, -2);
  const lights = new Group();
  lights.add(ambient, keyLight, rimLight);

  const uniforms = faceMaterial.uniforms as Record<string, { value: unknown }>;
  return {
    group,
    lights,
    keyLight,
    faceMaterial,
    setTexture(texture) {
      uniforms.uMap.value = texture;
      uniforms.uHasMap.value = texture ? 1 : 0;
    },
    setSheen(pointerX, pointerY, sweep) {
      uniforms.uLight.value = [pointerX * 1.1, pointerY * 1.1];
      uniforms.uSweep.value = sweep;
      keyLight.position.set(pointerX * 2.5 + 0.5, pointerY * 2 + 1.5, 3);
    },
    dispose() {
      // Textures are owned by the caller, so detach before disposing the graph.
      uniforms.uMap.value = null;
      disposeAll([group]);
    },
  };
}
