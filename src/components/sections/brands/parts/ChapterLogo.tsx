import { LogoBackgrounds, LogoMisuse, LogoSpacing } from "./LogoRules";
import { LogoHero, LogoProvenance, LogoVariantGrid } from "./LogoVariants";
import { PartFrame, brandOf, type ChapterPartProps } from "./shared";

/**
 * Logo: primary lockup, every variant on its right background, original versus
 * derived, clear space, minimum size (Proposed) and misuse, all for this brand's logo.
 */
export default function ChapterLogo({ brand: id, className }: ChapterPartProps) {
  const name = brandOf(id).name;
  return (
    <PartFrame
      brand={id}
      part="logo"
      title="Logo"
      lead={`The ${name} logo: where each file comes from, how much room it needs and what never to do to it.`}
      className={className}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <LogoHero brand={id} />
        <LogoVariantGrid brand={id} />
      </div>
      <LogoBackgrounds brand={id} />
      <LogoProvenance brand={id} />
      <LogoSpacing brand={id} />
      <LogoMisuse brand={id} />
    </PartFrame>
  );
}
