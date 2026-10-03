/** GLSL sources for the background scene and the logo plate. */

const COLORSPACE = '#include <colorspace_fragment>';

/* Soft additive glow on a billboard quad. */
export const GLOW_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const GLOW_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float core = exp(-d * d * 9.0);
  float halo = pow(max(1.0 - d, 0.0), 2.6);
  float a = min((core * 0.85 + halo * 0.32) * uIntensity, 0.6);
  gl_FragColor = vec4(uColor, a);
  ${COLORSPACE}
}
`;

/* Orbit trail ribbon: alpha fades along the ribbon. */
export const TRAIL_VERTEX = /* glsl */ `
attribute float aFade;
varying float vFade;
void main() {
  vFade = aFade;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const TRAIL_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vFade;
void main() {
  float a = vFade * vFade * uOpacity;
  gl_FragColor = vec4(uColor, a);
  ${COLORSPACE}
}
`;

/* Depth-layered stars with gentle twinkle. */
export const STAR_VERTEX = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPx;
uniform float uScale;
varying vec3 vColor;
varying float vTwinkle;
void main() {
  vColor = aColor;
  vTwinkle = 0.72 + 0.28 * sin(uTime * (0.5 + aPhase * 0.9) + aPhase * 6.2831);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = min(aSize * uPx * uScale / max(-mv.z, 0.1), 5.0 * uPx);
  gl_Position = projectionMatrix * mv;
}
`;

export const STAR_FRAGMENT = /* glsl */ `
uniform float uDim;
varying vec3 vColor;
varying float vTwinkle;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vTwinkle * uDim;
  gl_FragColor = vec4(vColor, a);
  ${COLORSPACE}
}
`;

/* Logo plate face: texture, domed-glass specular that follows the pointer, diagonal sheen sweep. */
export const PLATE_VERTEX = /* glsl */ `
varying vec2 vPos;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vSide;
void main() {
  vPos = position.xy;
  vSide = normal.z;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewDir = -mv.xyz;
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`;

export const PLATE_FRAGMENT = /* glsl */ `
uniform sampler2D uMap;
uniform float uHasMap;
uniform float uSize;
uniform vec2 uLight;
uniform float uSweep;
varying vec2 vPos;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vSide;
void main() {
  vec2 uv = vPos / uSize + 0.5;
  if (vSide < 0.0) uv.x = 1.0 - uv.x;
  vec3 base = mix(vec3(0.02), texture2D(uMap, uv).rgb, uHasMap);

  vec3 n = normalize(vNormalV + vec3(vPos * 0.35, 0.0));
  vec3 v = normalize(vViewDir);
  vec3 l = normalize(vec3(uLight, 0.9));
  float spec = pow(max(dot(n, normalize(l + v)), 0.0), 70.0);
  float fresnel = pow(1.0 - max(dot(normalize(vNormalV), v), 0.0), 3.0);
  float diag = uv.x * 0.8 + uv.y * 0.6;
  float band = smoothstep(0.14, 0.0, abs(diag - uSweep));
  float topGlow = smoothstep(0.35, 1.0, uv.y) * 0.05;

  vec3 sheen = vec3(1.0, 1.0, 0.92) * (spec * 0.55 + band * 0.2) + vec3(0.78, 0.95, 0.31) * fresnel * 0.18 + topGlow;
  gl_FragColor = vec4(base + sheen, 1.0);
  ${COLORSPACE}
}
`;
