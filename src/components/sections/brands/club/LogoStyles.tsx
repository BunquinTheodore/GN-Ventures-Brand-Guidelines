import { Badge, DerivedTag } from "@/components/ui";
import { assetsFor } from "@/content/assets";
import { Card, Img, SubHeading } from "../parts";

/** Both GN Club logo styles side by side. Which one is current is an open owner decision. */
export default function LogoStyles() {
  const current = assetsFor("club").find((a) => a.id === "club-primary-dark");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SubHeading>Two logo styles exist</SubHeading>
        <Badge tone="amber">Owner confirmation needed</Badge>
      </div>
      <p className="max-w-3xl text-base leading-relaxed text-[var(--b-muted)]">
        GN Club has two logo styles. The site ships the GN LOGO JPG today. The Drive folder also holds the gnclub_logo 2048 PNG and a navy version.
        Which style is current has not been confirmed. Do not mix them on one surface.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card brand="club" glass className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-ui text-sm font-semibold uppercase tracking-[0.12em] text-[var(--b-fg)]">Style A: GN LOGO JPG</p>
            <Badge tone="accent">On the site today</Badge>
          </div>
          <div className="flex h-64 items-center justify-center rounded-[var(--b-radius)] bg-[var(--b-bg)] p-4">
            {current ? <Img asset={current} alt="GN Club logo, style A, the GN LOGO JPG used on the site" sizes="256px" className="h-full w-auto object-contain" /> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--b-muted)]">
            <span>648 x 647 JPG on a black plate</span>
            {current ? <DerivedTag kind={current.source} note={current.provenance} /> : null}
          </div>
        </Card>
        <Card brand="club" glass className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-ui text-sm font-semibold uppercase tracking-[0.12em] text-[var(--b-fg)]">Style B: gnclub_logo 2048 and navy</p>
            <Badge tone="amber">Unconfirmed</Badge>
          </div>
          <div
            role="img"
            aria-label="Placeholder: the gnclub_logo 2048 and navy files are on Drive and not in this asset pack"
            className="flex h-64 items-center justify-center rounded-[var(--b-radius)] border border-dashed border-[var(--b-border)] p-6 text-center"
          >
            <p className="max-w-xs text-base text-[var(--b-muted)]">
              Drive files <span className="font-mono text-[var(--b-fg)]">gnclub_logo_2048 (1).png</span> and{" "}
              <span className="font-mono text-[var(--b-fg)]">gnclub_logo_navy_2048.png</span> are not in this pack yet. Preview TBC.
            </p>
          </div>
          <p className="text-sm text-[var(--b-muted)]">
            Drive also lists GN Club-Black.jpg and GN Club-White.jpg. Until the owner picks a style, treat Style A as the working logo.
          </p>
        </Card>
      </div>
    </div>
  );
}
