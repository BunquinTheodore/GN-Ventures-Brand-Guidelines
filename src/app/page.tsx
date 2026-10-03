import { AppShell } from "@/components/shell";
import { LazyBrandBackground } from "@/components/three";
import Hero from "@/components/sections/Hero";
import Essence from "@/components/sections/Essence";
import Name from "@/components/sections/Name";
import Logo from "@/components/sections/logo/Logo";
import ClearSpace from "@/components/sections/logo/ClearSpace";
import Lockups from "@/components/sections/logo/Lockups";
import Mark from "@/components/sections/logo/Mark";
import Placement from "@/components/sections/logo/Placement";
import Misuse from "@/components/sections/logo/Misuse";
import ColorCore from "@/components/sections/foundations/ColorCore";
import ColorInk from "@/components/sections/foundations/ColorInk";
import Typography from "@/components/sections/foundations/Typography";
import TypeScale from "@/components/sections/foundations/TypeScale";
import Numbers from "@/components/sections/foundations/Numbers";
import Spacing from "@/components/sections/foundations/Spacing";
import Motion from "@/components/sections/foundations/Motion";
import Voice from "@/components/sections/system/Voice";
import Imagery from "@/components/sections/system/Imagery";
import Components from "@/components/sections/system/Components";
import Presentations from "@/components/sections/system/Presentations";
import Applications from "@/components/sections/system/Applications";
import Compliance from "@/components/sections/system/Compliance";
import Family from "@/components/sections/Family";
import MediaChapter from "@/components/sections/brands/MediaChapter";
import AcademyChapter from "@/components/sections/brands/AcademyChapter";
import ClubChapter from "@/components/sections/brands/ClubChapter";
import LabsChapter from "@/components/sections/brands/LabsChapter";
import MazalChapter from "@/components/sections/brands/MazalChapter";
import CommuneChapter from "@/components/sections/brands/CommuneChapter";
import Fonts from "@/components/sections/Fonts";
import Downloads from "@/components/sections/Downloads";

export default function Page() {
  return (
    <>
      <LazyBrandBackground />
      <AppShell>
        <Hero />
        <Essence />
        <Name />
        <Logo />
        <ClearSpace />
        <Lockups />
        <Mark />
        <Placement />
        <Misuse />
        <ColorCore />
        <ColorInk />
        <Typography />
        <TypeScale />
        <Numbers />
        <Spacing />
        <Motion />
        <Voice />
        <Imagery />
        <Components />
        <Presentations />
        <Applications />
        <Compliance />
        <Family />
        <MediaChapter />
        <AcademyChapter />
        <ClubChapter />
        <LabsChapter />
        <MazalChapter />
        <CommuneChapter />
        <Fonts />
        <Downloads />
      </AppShell>
    </>
  );
}
