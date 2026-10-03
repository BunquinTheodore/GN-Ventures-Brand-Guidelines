import { SubHeading } from "./parts";
import BrandChapter from "./BrandChapter";
import type { ChapterPartKey } from "./parts/shared";
import { ChannelDecision, ChannelTable, Endorsement } from "./mazal/Channels";
import MarkLab from "./mazal/MarkLab";
import MazalComponents from "./mazal/MazalComponents";
import SocialFormats from "./mazal/SocialFormats";
import { ColorExtras, TypeRoles } from "./mazal/TypeAndColor";
import VoiceExtras from "./mazal/VoiceExtras";

const LEAD =
  "The trading and finance community of GN Ventures in the Philippines. Free, for crypto and gold. Documented as two channels: the web site (glass, Josefin) and the social kit (flat, Archivo). Use the Channel switch to flip every demo.";

const EXTRAS = {
  essence: (
    <div className="space-y-6">
      <div>
        <SubHeading>Two channels</SubHeading>
        <ChannelTable />
      </div>
      <Endorsement />
    </div>
  ),
  logo: <MarkLab />,
  color: <ColorExtras />,
  type: <TypeRoles />,
  voice: <VoiceExtras />,
  applications: <SocialFormats />,
} as const;

/** Mazal, a GN Ventures department. Web channel and social kit channel, with the conflict left as an open decision. */
export default function MazalChapter({ onlyPart }: { readonly onlyPart?: ChapterPartKey }) {
  return (
    <BrandChapter brand="mazal" onlyPart={onlyPart} lead={LEAD} overrides={{ components: MazalComponents }} extras={EXTRAS}>
      <ChannelDecision />
    </BrandChapter>
  );
}
