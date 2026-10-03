// Lazy (next/dynamic, ssr:false) entry points. Import these from pages and sections,
// never the heavy components directly, so three.js stays out of the initial bundle.
export { LazyBrandBackground, LazyHeroLogo3D, LazyLogoViewer3D } from './lazy';
export type { HeroLogo3DProps } from './HeroLogo3D';
export type { LogoViewer3DProps, LogoViewerItem } from './LogoViewer3D';
