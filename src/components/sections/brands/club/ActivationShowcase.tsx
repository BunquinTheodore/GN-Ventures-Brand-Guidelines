import { Badge, Button, GlowCard } from "@/components/ui";
import { assetsFor } from "@/content/assets";
import { Img, SubHeading } from "../parts";

const CAPABILITIES = ["Activations", "Events", "Full Production", "Global Experience"] as const;

/** A brand-partner event card in GN Club glass. Names, dates and venues are TBC on purpose: none are confirmed. */
function EventCard({ index, capability }: { readonly index: number; readonly capability: string }) {
  return (
    <GlowCard zoom shineDelay={index * 1.1} className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Badge tone={index % 3 === 0 ? "accent" : index % 3 === 1 ? "cyan" : "amber"}>{capability}</Badge>
        <Badge tone="neutral">Date TBC</Badge>
      </div>
      <div
        aria-hidden="true"
        className="h-28 rounded-[var(--b-radius)]"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--b-accent) 70%, var(--b-bg)), color-mix(in srgb, var(--b-accent-2) 70%, var(--b-bg)) 55%, color-mix(in srgb, var(--b-accent-3) 70%, var(--b-bg)))",
        }}
      />
      <div className="space-y-1">
        <p className="text-lg font-semibold text-[var(--b-fg)]">Event name TBC</p>
        <p className="text-base text-[var(--b-muted)]">Partner and venue TBC</p>
      </div>
      <Button variant="outline" className="mt-auto self-start" data-sfx="click">Plan yours</Button>
    </GlowCard>
  );
}

/** Mascot cursor files, shown at their real sizes. */
function MascotCursor() {
  const cursors = assetsFor("club").filter((a) => a.kind === "cursor");
  return (
    <GlowCard className="space-y-4">
      <SubHeading>Mascot cursor</SubHeading>
      <p className="text-base leading-relaxed text-[var(--b-muted)]">
        The site swaps the pointer for the GN mascot. It ships as a PNG at 44px and 88px for sharp rendering on high density screens.
      </p>
      <ul className="flex flex-wrap items-end gap-6">
        {cursors.map((a) => (
          <li key={a.id} className="flex flex-col items-center gap-2">
            <span className="flex items-center justify-center rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--b-bg)] p-4">
              <Img asset={a} alt={`GN Club mascot cursor at ${a.width} pixels`} sizes={`${a.width}px`} className="h-auto w-auto" />
            </span>
            <span className="font-mono text-xs text-[var(--b-muted)]">{a.width}px</span>
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}

/** Brand-specific live demos for GN Club: activation cards and the mascot cursor. */
export default function ActivationShowcase() {
  return (
    <section aria-labelledby="club-showcase-title" className="space-y-6">
      <header className="border-b border-[var(--b-border)] pb-4">
        <p className="gn-eyebrow mb-2">Brand specific</p>
        <h3 id="club-showcase-title" className="text-[1.75rem] md:text-[2.25rem] [font-family:var(--b-font-display)] [font-weight:var(--b-title-weight)] [text-transform:var(--b-title-transform)] [letter-spacing:var(--b-title-tracking)] leading-[1.08]">
          Activation showcase
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--b-muted)]">
          How the identity reads when it carries a partner event. Every name, date and venue is TBC. No hero stats are used because the
          figures on the live site are unverified placeholders.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CAPABILITIES.map((c, i) => (
          <li key={c} className="contents">
            <EventCard index={i} capability={c} />
          </li>
        ))}
      </ul>
      <MascotCursor />
    </section>
  );
}
