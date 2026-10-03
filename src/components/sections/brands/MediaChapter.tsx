import BrandChapter from "./BrandChapter";
import type { ChapterPartKey } from "./parts/shared";
import BusinessLines from "./media/BusinessLines";
import GlassRecipeLab from "./media/GlassRecipeLab";
import GradientDemo from "./media/GradientDemo";
import { MascotNote, OgAnatomy } from "./media/OgAndMascot";
import WireVoiceDemo from "./media/WireVoiceDemo";
import { SubHeading } from "./parts";

const LEAD =
  "News. Insights. Future. GN Media is the department for crypto, blockchain, tech and finance news, with services and a studio as its business lines.";

function GlassSignature() {
  return (
    <div className="space-y-4">
      <SubHeading>Signature glass panel</SubHeading>
      <GlassRecipeLab />
    </div>
  );
}

/** The GN Media department chapter: the shared template plus news-wire, glass, gradient, business-line and OG demos. */
export default function MediaChapter({ onlyPart }: { readonly onlyPart?: ChapterPartKey }) {
  return (
    <BrandChapter brand="media" onlyPart={onlyPart} lead={LEAD}>
      <WireVoiceDemo />
      <GlassSignature />
      <GradientDemo />
      <BusinessLines />
      <OgAnatomy />
      <MascotNote />
    </BrandChapter>
  );
}
