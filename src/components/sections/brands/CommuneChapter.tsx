import { BRANDS } from "@/content/brands";
import BrandChapter from "./BrandChapter";
import type { ChapterPartKey } from "./parts/shared";
import ApplicationsExtra from "./commune/ApplicationsExtra";
import ColorExtra from "./commune/ColorExtra";
import { DoodleStyles } from "./commune/doodles";
import EssenceExtra from "./commune/EssenceExtra";
import ImageryExtra from "./commune/ImageryExtra";
import LogoExtra from "./commune/LogoExtra";
import SketchLab from "./commune/SketchLab";
import TypeExtra from "./commune/TypeExtra";
import { PlaceholderStamp } from "./commune/ui";
import VoiceExtra from "./commune/VoiceExtra";

/**
 * GN Commune chapter (section id "commune"). Black and white hand-drawn sketchbook, dark default
 * with a light toggle. No glass and no color. Composes the shared template parts, then extends
 * them with brand-specific live demos.
 */
export default function CommuneChapter({ onlyPart }: { readonly onlyPart?: ChapterPartKey }) {
  return (
    <>
      {onlyPart ? <DoodleStyles /> : null}
      <BrandChapter
        brand="commune"
        onlyPart={onlyPart}
        glass={false}
        lead={
          <span className="flex flex-col items-start gap-4">
            <span>{BRANDS.commune.descriptor}</span>
            <PlaceholderStamp />
          </span>
        }
        extras={{
          essence: <EssenceExtra />,
          logo: <LogoExtra />,
          color: <ColorExtra />,
          type: <TypeExtra />,
          voice: <VoiceExtra />,
          imagery: <ImageryExtra />,
          applications: <ApplicationsExtra />,
        }}
      >
        {onlyPart ? null : <DoodleStyles />}
        <SketchLab />
      </BrandChapter>
    </>
  );
}
