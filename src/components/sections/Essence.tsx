import { Badge, GlowCard, SectionShell } from "@/components/ui";
import { BRANDS, DEPARTMENT_ORDER } from "@/content/brands";
import type { BrandId } from "@/content/types";

const DESCRIPTORS: Readonly<Record<BrandId, string>> = {
  ventures: "The umbrella",
  media: "News and media services",
  academy: "Certification and e-learning",
  club: "Events and activations",
  labs: "AI integration",
  mazal: "Free trading community",
  commune: "Mobile cafe cart bookings",
};

const DNA: readonly { readonly label: string; readonly value: string; readonly swatch: string }[] = [
  { label: "Near-black base", value: "Ink #08090A, raised #111316, deep #030404", swatch: "#08090A" },
  { label: "Neon lime", value: "#C6F24E, the proposed canonical lime", swatch: "#C6F24E" },
  {
    label: "Cyan to amber frame",
    value: "#33C7E0 through lime to #F2B84E, on the logo frame stroke",
    swatch: "linear-gradient(90deg,#33C7E0,#C6F24E,#F2B84E)",
  },
  { label: "Glass", value: "6% white over ink, blur, soft top highlight, a slow shine", swatch: "rgba(255,255,255,0.14)" },
];

const PILLARS: readonly { readonly title: string; readonly body: string }[] = [
  {
    title: "One family look",
    body: "Every department shares the dark ink base, the lime accent and the gradient-frame logo plate, so the family reads as one at a glance.",
  },
  {
    title: "Each department keeps its own voice",
    body: "Media writes like a news wire, Academy like a practical guide, Labs like a consultant. The umbrella stays quiet.",
  },
  {
    title: "Proof over hype",
    body: "Say what a thing does and show it. No invented numbers, no guaranteed outcomes, no unconfirmed partner names.",
  },
];

export default function Essence() {
  return (
    <SectionShell
      id="essence"
      num="01"
      eyebrow="Essence"
      title="What GN Ventures is"
      lead={
        <p>
          GN Ventures is the family of six departments: Media, Academy, Club, Labs, Mazal and Commune. Each
          one is a department of equal standing. This chapter covers the umbrella. The family chapters cover
          each department.
        </p>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="The six departments">
        {DEPARTMENT_ORDER.map((id, i) => {
          const b = BRANDS[id];
          return (
            <GlowCard as="li" key={id} shineDelay={i * 0.6} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-1.5 size-3 shrink-0 rounded-full"
                style={{ backgroundColor: b.accent }}
              />
              <div>
                <h3 className="font-ui text-base font-semibold tracking-[0.04em]">{b.name}</h3>
                <p className="mt-1 text-[var(--b-muted)]">{DESCRIPTORS[id]}</p>
              </div>
            </GlowCard>
          );
        })}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlowCard className="md:p-8">
          <h3 className="font-ui text-lg font-semibold">Shared visual DNA</h3>
          <ul className="mt-5 space-y-4">
            {DNA.map((d) => (
              <li key={d.label} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="size-10 shrink-0 rounded-lg border border-[var(--b-border)]"
                  style={{ background: d.swatch }}
                />
                <span>
                  <span className="block font-ui text-sm font-medium uppercase tracking-[0.1em]">{d.label}</span>
                  <span className="block text-[var(--b-muted)]">{d.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </GlowCard>
        <GlowCard className="flex flex-col justify-between gap-6 md:p-8">
          <div>
            <h3 className="font-ui text-lg font-semibold">Umbrella tagline</h3>
            <p className="mt-3 text-[var(--b-muted)]">
              No official umbrella tagline or description exists. None is invented here.
            </p>
          </div>
          <p className="flex flex-wrap items-center gap-3">
            <span className="font-display text-2xl uppercase tracking-[0.04em]">TBC</span>
            <Badge tone="amber">Owner to confirm</Badge>
          </p>
        </GlowCard>
      </div>

      <div>
        <h3 className="mb-5 flex flex-wrap items-center gap-3 font-ui text-lg font-semibold">
          Three pillars <Badge tone="cyan">Proposed</Badge>
        </h3>
        <ol className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <GlowCard as="li" key={p.title} zoom shineDelay={i * 0.8}>
              <span className="font-mono text-sm text-[var(--b-accent)]">{String(i + 1).padStart(2, "0")}</span>
              <h4 className="mt-3 font-ui text-base font-semibold">{p.title}</h4>
              <p className="mt-2 text-[var(--b-muted)]">{p.body}</p>
            </GlowCard>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
