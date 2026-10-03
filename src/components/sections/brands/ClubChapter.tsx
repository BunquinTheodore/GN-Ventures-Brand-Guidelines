import BrandChapter from "./BrandChapter";
import ActivationShowcase from "./club/ActivationShowcase";
import AgencyVoice from "./club/AgencyVoice";
import FullColorRule from "./club/FullColorRule";
import GlassLab from "./club/GlassLab";
import LogoStyles from "./club/LogoStyles";
import TaglineRail from "./club/TaglineRail";

/**
 * GN Club department chapter: agency voice, ink, lime, cyan and amber, 0.75rem radius,
 * glass at blur 20 and saturate 140, staggered shine, full-color imagery.
 * Composes the shared template and adds Club-only live demos.
 */
export default function ClubChapter() {
  return (
    <BrandChapter
      brand="club"
      extras={{
        essence: <TaglineRail />,
        logo: <LogoStyles />,
        color: <GlassLab />,
        voice: <AgencyVoice />,
        imagery: <FullColorRule />,
      }}
    >
      <ActivationShowcase />
    </BrandChapter>
  );
}
