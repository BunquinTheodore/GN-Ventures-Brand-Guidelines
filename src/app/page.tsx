import { AppShell } from "@/components/shell";
import { LazyBrandBackground } from "@/components/three";
import Hero from "@/components/sections/Hero";
import Essence from "@/components/sections/Essence";
import Name from "@/components/sections/Name";
import DeferredSections from "./deferred-sections";

export default function Page() {
  return (
    <>
      <LazyBrandBackground />
      <AppShell>
        <Hero />
        <Essence />
        <Name />
        {/* Everything below renders as measured-height placeholders and mounts on approach. */}
        <DeferredSections />
      </AppShell>
    </>
  );
}
