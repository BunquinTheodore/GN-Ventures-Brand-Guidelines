import { CanvasTexture, LinearMipmapLinearFilter, SRGBColorSpace } from 'three';

/** Hard cap on texture edge length (spec: textures small, <= 512 px). */
export const MAX_TEXTURE_SIZE = 512;

const MAX_ANISOTROPY = 4;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load texture image: ${src}`));
    image.src = src;
  });
}

/**
 * Load an image and downscale it onto a canvas no larger than `maxSize`
 * (never upscaled). The caller owns the returned texture and must dispose it.
 */
export async function loadLogoTexture(src: string, maxSize = MAX_TEXTURE_SIZE): Promise<CanvasTexture> {
  const image = await loadImage(src);
  const longest = Math.max(image.naturalWidth, image.naturalHeight, 1);
  const scale = Math.min(1, Math.min(maxSize, MAX_TEXTURE_SIZE) / longest);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas is unavailable for texture preparation.');
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.anisotropy = MAX_ANISOTROPY;
  texture.needsUpdate = true;
  return texture;
}
