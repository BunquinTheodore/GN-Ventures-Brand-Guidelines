import BrandChapter from "./BrandChapter";
import type { ChapterPartKey } from "./parts/shared";
import GlassRecipe from "./labs/GlassRecipe";
import GradientDemo from "./labs/GradientDemo";
import HeadlineRule from "./labs/HeadlineRule";
import ProductDemos from "./labs/ProductDemos";
import ToneDemo from "./labs/ToneDemo";

/**
 * GN Labs chapter. Dark only, ink #050605, lime #caf14a, cyan to amber gradient,
 * radius 0.9rem, Manrope semibold h1. Brand-specific demos render before Downloads.
 */
export default function LabsChapter({ onlyPart }: { readonly onlyPart?: ChapterPartKey }) {
  return (
    <BrandChapter brand="labs" onlyPart={onlyPart} switcher={false}>
      <HeadlineRule />
      <GradientDemo />
      <GlassRecipe />
      <ToneDemo />
      <ProductDemos />
    </BrandChapter>
  );
}
