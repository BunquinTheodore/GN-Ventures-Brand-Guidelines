import type { BufferGeometry, Material, Object3D, Texture } from 'three';

export interface Disposable {
  dispose(): void;
}

type DisposeInput = Disposable | Object3D | null | undefined;

function isTexture(value: unknown): value is Texture {
  return typeof value === 'object' && value !== null && (value as Texture).isTexture === true;
}

function isObject3D(value: unknown): value is Object3D {
  return typeof value === 'object' && value !== null && (value as Object3D).isObject3D === true;
}

function disposeMaterial(material: Material): void {
  const record = material as unknown as Record<string, unknown>;
  for (const value of Object.values(record)) {
    if (isTexture(value)) value.dispose();
  }
  const uniforms = record.uniforms as Record<string, { value: unknown }> | undefined;
  if (uniforms) {
    for (const uniform of Object.values(uniforms)) {
      if (isTexture(uniform.value)) uniform.value.dispose();
    }
  }
  material.dispose();
}

/** Dispose geometry, materials and material textures of every mesh under `root`. */
export function disposeObject3D(root: Object3D): void {
  root.traverse((node) => {
    const mesh = node as Object3D & { geometry?: BufferGeometry; material?: Material | Material[] };
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach(disposeMaterial);
    else if (mesh.material) disposeMaterial(mesh.material);
  });
}

/** Dispose any mix of disposables and scene graphs. Errors never escape. */
export function disposeAll(items: readonly DisposeInput[]): void {
  for (const item of items) {
    if (!item) continue;
    try {
      if (isObject3D(item)) disposeObject3D(item);
      else item.dispose();
    } catch {
      // A failed dispose must not stop the rest of the teardown.
    }
  }
}
