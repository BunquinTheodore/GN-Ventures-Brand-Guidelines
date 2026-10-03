import { Badge, DerivedTag } from "@/components/ui";
import { getAsset } from "@/content/assets";
import { Card, Img, SubHeading } from "../parts";

const NOTES: readonly { readonly n: string; readonly title: string; readonly body: string }[] = [
  { n: "1", title: "Size", body: "1200 x 630. The file is app/opengraph-image.png on the live site." },
  { n: "2", title: "Base", body: "Background token #0a0a0f, the same ink as the page." },
  { n: "3", title: "Logo", body: "The GN Media lockup. Never stretched, never recolored." },
  { n: "4", title: "Safe area", body: "Keep text and logo clear of the outer edge, links crop on some feeds." },
];

export function OgAnatomy() {
  const og = getAsset("media-site-og");
  const template = getAsset("media-og");
  return (
    <div className="space-y-4">
      <SubHeading>Open Graph image</SubHeading>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card brand="media" glass className="space-y-3">
          {og ? (
            <>
              <Img asset={og} alt="GN Media Open Graph image, the share card for gnmedia.co" sizes="(min-width: 1024px) 50vw, 90vw" className="h-auto w-full rounded-lg border border-[var(--b-border)]" />
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--b-muted)]">
                <span>{og.label}</span>
                <DerivedTag kind={og.source} note={og.provenance} />
              </div>
            </>
          ) : (
            <p className="text-base text-[var(--b-muted)]">Open Graph image file TBC.</p>
          )}
        </Card>
        <div className="space-y-4">
          <ol className="space-y-3">
            {NOTES.map((n) => (
              <li key={n.n} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--b-accent)] font-mono text-sm font-semibold text-[var(--b-accent-fg)]">
                  {n.n}
                </span>
                <p className="text-base text-[var(--b-muted)]">
                  <span className="font-semibold text-[var(--b-fg)]">{n.title}.</span> {n.body}
                </p>
              </li>
            ))}
          </ol>
          {template ? (
            <p className="text-sm text-[var(--b-muted)]">
              Blank template: <span className="font-mono">{template.file.split("/").pop()}</span>{" "}
              <DerivedTag kind={template.source} note={template.provenance} />. No headline text, add yours as a short fragment.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function MascotNote() {
  const otter = getAsset("media-mascot-otter");
  return (
    <div className="space-y-4">
      <SubHeading>Unconfirmed asset</SubHeading>
      <div
        role="note"
        aria-label="Unconfirmed asset: otter mascot"
        className="flex flex-col gap-5 rounded-[var(--b-radius)] border-2 border-dashed border-[color-mix(in_srgb,var(--b-accent-3)_55%,transparent)] p-5 sm:flex-row sm:items-center"
      >
        {otter ? (
          <div className="h-24 w-24 shrink-0 opacity-70 grayscale">
            <Img asset={otter} alt="Otter mascot with a captain cap, unconfirmed asset" sizes="96px" className="h-full w-full rounded-full object-cover" />
          </div>
        ) : null}
        <div className="space-y-2">
          <Badge tone="amber">Unconfirmed</Badge>
          <p className="text-base text-[var(--b-fg)]">
            An otter in a captain cap, known as &ldquo;Cash Captain&rdquo;, sits in the GN Media assets folder.
          </p>
          <p className="text-base text-[var(--b-muted)]">
            Its link to GN Media is unconfirmed. It is not part of the identity: do not use it as a logo, avatar or
            site mark until the owner confirms it.
          </p>
        </div>
      </div>
    </div>
  );
}
