import type { ReactNode } from "react";
import { Badge } from "@/components/ui";
import { Card, SubHeading } from "../parts";
import { LIME, LOCKED_CTA, MAZI_POSES, MUTED, NAVY } from "./data";
import { MazalMark } from "./Mark";
import { Plate } from "./Plate";
import TradePost from "./TradePost";

const ARCHIVO = "var(--font-archivo), 'Archivo', sans-serif";

interface PostProps {
  readonly headline: string;
  readonly kicker: string;
  readonly vertical?: boolean;
}

function Post({ headline, kicker, vertical }: PostProps) {
  return (
    <Plate className={`w-full border border-[var(--b-border)] ${vertical ? "aspect-[9/16]" : "aspect-square"}`}>
      <div className="flex h-full flex-col justify-between p-[8cqw]" style={{ fontFamily: ARCHIVO, color: "#fff" }}>
        <MazalMark width="12cqw" label="Mazal M mark" />
        <div className="space-y-[3cqw]">
          <p className="font-black leading-[1.02]" style={{ fontSize: vertical ? "13cqw" : "10cqw" }}>
            {headline}
          </p>
          <p className="font-bold" style={{ color: MUTED, fontSize: "4.4cqw" }}>{kicker}</p>
        </div>
        <p className="font-extrabold" style={{ background: LIME, color: NAVY, fontSize: "4cqw", padding: "2.6cqw 4.4cqw", alignSelf: "flex-start", borderRadius: 999 }}>
          {LOCKED_CTA}
        </p>
      </div>
    </Plate>
  );
}

function Format({ title, size, children, className }: { readonly title: string; readonly size: string; readonly children: ReactNode; readonly className: string }) {
  return (
    <figure className={`flex flex-col gap-3 ${className}`}>
      <div className="[container-type:inline-size]">{children}</div>
      <figcaption className="flex flex-wrap items-center gap-2 text-sm text-[var(--b-muted)]">
        <Badge tone="accent">{title}</Badge>
        <span className="font-mono">{size}</span>
      </figcaption>
    </figure>
  );
}

function MaziPoses() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <SubHeading>Mascot MAZI: four poses</SubHeading>
        <Badge tone="amber">Artwork pending</Badge>
      </div>
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {MAZI_POSES.map((p) => (
          <li key={p.name} className="flex flex-col gap-2">
            <div className="flex aspect-square items-center justify-center border border-dashed border-[var(--b-border)] p-4 text-center" style={{ background: NAVY }}>
              <span className="text-sm text-[var(--b-muted)]">MAZI file not in this pack. See the Mazal brand kit.</span>
            </div>
            <p className="font-ui text-base font-semibold text-[var(--b-fg)]">{p.name}</p>
            <p className="text-sm text-[var(--b-muted)]"><Badge tone="amber" className="mr-2">Proposed</Badge>{p.pairing}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 max-w-3xl text-sm text-[var(--b-muted)]">
        The kit names the four poses. Mazi.png and Mazi Stickers.jpg live in Drive and were not transferable into this pack.
      </p>
    </div>
  );
}

/** Social kit applications: feed and story formats on the plate, the trade post, MAZI poses. */
export default function SocialFormats() {
  return (
    <div className="space-y-8" data-mazal="social-formats">
      <div>
        <SubHeading>Formats</SubHeading>
        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Format title="Feed" size="2048 x 2048, JPEG" className="">
            <Post headline="A friend who trades." kicker="A community. Not just a page." />
          </Format>
          <Format title="Story" size="1080 x 1920" className="mx-auto w-full max-w-[16rem] md:max-w-none">
            <Post headline="it's more fun in mazal!" kicker="A friend who trades. Not a bank." vertical />
          </Format>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-[var(--b-muted)]">
          Scaled previews. The M sits top left with half its width of clear space, the headline is Archivo 900, and the
          locked CTA closes every post.
        </p>
      </div>
      <div>
        <SubHeading>Trade post</SubHeading>
        <Card brand="mazal" glass><TradePost /></Card>
      </div>
      <MaziPoses />
    </div>
  );
}
