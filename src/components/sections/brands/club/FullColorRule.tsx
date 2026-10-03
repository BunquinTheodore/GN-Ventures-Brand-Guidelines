import { Badge } from "@/components/ui";
import { assetsFor } from "@/content/assets";
import { Img, SubHeading } from "../parts";

const SCENES = [
  { id: "do", title: "Full color on dark ink", tone: "accent", ok: true, filter: "none" },
  { id: "dont", title: "Desaturated or tinted", tone: "danger", ok: false, filter: "grayscale(1) contrast(0.9)" },
] as const;

/** The full-color imagery rule, shown with the brand's own colors as a stand-in because photography is TBC. */
export default function FullColorRule() {
  const logo = assetsFor("club").find((a) => a.id === "club-primary-transparent");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SubHeading>Full-color imagery rule</SubHeading>
        <Badge tone="amber">Stand-in artwork, photography TBC</Badge>
      </div>
      <p className="max-w-3xl text-base leading-relaxed text-[var(--b-muted)]">
        Imagery on GN Club stays in full color on dark ink. Do not turn it black and white, duotone or tint it toward one hue.
        The panels below use the lime, cyan and amber light of the brand as a stand-in until approved photography is supplied.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {SCENES.map((s) => (
          <figure key={s.id} className="space-y-3">
            <div
              className="relative flex h-56 items-center justify-center overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)]"
              style={{ background: "var(--b-bg)", filter: s.filter }}
            >
              <span aria-hidden="true" className="absolute -left-8 -top-8 h-48 w-48 rounded-full opacity-80 blur-2xl" style={{ background: "var(--b-accent)" }} />
              <span aria-hidden="true" className="absolute -bottom-10 right-4 h-48 w-48 rounded-full opacity-70 blur-2xl" style={{ background: "var(--b-accent-2)" }} />
              <span aria-hidden="true" className="absolute right-1/3 top-4 h-28 w-28 rounded-full opacity-70 blur-2xl" style={{ background: "var(--b-accent-3)" }} />
              <div className="relative h-32 w-32">
                {logo ? <Img asset={logo} alt="" sizes="128px" className="h-full w-full object-contain" /> : null}
              </div>
            </div>
            <figcaption className="flex items-center gap-2 text-base text-[var(--b-fg)]">
              <Badge tone={s.tone}>{s.ok ? "Do" : "Do not"}</Badge>
              {s.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
