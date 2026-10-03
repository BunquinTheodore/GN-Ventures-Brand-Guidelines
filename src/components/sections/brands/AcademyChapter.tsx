import BrandChapter from "./BrandChapter";
import ColorRules from "./academy/ColorRules";
import CredentialShowcase from "./academy/CredentialShowcase";
import JourneyFlow from "./academy/JourneyFlow";
import ThemePair from "./academy/ThemePair";
import TokenLedger from "./academy/TokenLedger";
import TypeExtras from "./academy/TypeExtras";

/**
 * GN Academy chapter. The only light-first department: the chapter switch toggles light and dark,
 * and the extras prove the identity (oklch token ledger, gold reserved for verified credentials,
 * raised type scale, credential motifs). Section id "academy".
 */
export default function AcademyChapter() {
  return (
    <BrandChapter
      brand="academy"
      eyebrow="Department, light first"
      extras={{
        essence: <ThemePair />,
        color: (
          <>
            <TokenLedger />
            <ColorRules />
          </>
        ),
        type: <TypeExtras />,
        components: <CredentialShowcase />,
      }}
    >
      <JourneyFlow />
    </BrandChapter>
  );
}
