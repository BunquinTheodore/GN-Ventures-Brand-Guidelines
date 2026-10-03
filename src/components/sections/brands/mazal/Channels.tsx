import { Badge } from "@/components/ui";
import { Card, SubHeading, ThemedLogo } from "../parts";
import { CHANNEL_ROWS } from "./data";
import { MazalMark } from "./Mark";

/** Two channels at a glance. Used in Essence and as the open decision at the end of the chapter. */
export function ChannelTable() {
  return (
    <div className="overflow-x-auto rounded-[var(--b-radius)] border border-[var(--b-border)]">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">Mazal web channel compared with the social kit channel</caption>
        <thead>
          <tr className="border-b border-[var(--b-border)] font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">
            <th scope="col" className="p-3 font-medium">Aspect</th>
            <th scope="col" className="p-3 font-medium">Web</th>
            <th scope="col" className="p-3 font-medium">Social kit</th>
          </tr>
        </thead>
        <tbody>
          {CHANNEL_ROWS.map((r) => (
            <tr key={r.aspect} className="border-b border-[var(--b-border)] align-top last:border-0">
              <th scope="row" className="p-3 font-medium text-[var(--b-accent)]">{r.aspect}</th>
              <td className="p-3 text-[var(--b-fg)]">{r.web}</td>
              <td className="p-3 text-[var(--b-fg)]">{r.social}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const OPTIONS: readonly { readonly title: string; readonly body: string }[] = [
  { title: "Keep two channels", body: "Web stays glass and Josefin. Social stays flat and Archivo. They already share the M and the lime #C0F030. This is the current state." },
  { title: "Pull web toward the kit", body: "Web adopts flat shapes and Archivo, so one look runs everywhere. Glass becomes the retired style, as Commune did." },
  { title: "Pull the kit toward web", body: "Social adopts glass and Josefin to match the other departments. This breaks the kit rule of zero glow." },
];

/** The open decision: web styling versus social kit styling. */
export function ChannelDecision() {
  return (
    <div id="mazal-decision" className="scroll-mt-28 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-[1.75rem] md:text-[2.25rem] [font-family:var(--b-font-display)]">Open decision: two worlds</h3>
        <Badge tone="amber">Decision needed</Badge>
      </div>
      <p className="max-w-3xl text-base leading-relaxed text-[var(--b-muted)]">
        Mazal has two styling worlds that conflict. The website is glass with Josefin Sans. The social kit (brand kit
        PDF, 2026-09-30) is flat with Archivo and bans glow outright. This guide documents both as channels. Which one
        leads is an owner call.
      </p>
      <ChannelTable />
      <ul className="grid gap-4 md:grid-cols-3">
        {OPTIONS.map((o) => (
          <li key={o.title}>
            <Card brand="mazal" glass className="flex h-full flex-col gap-3">
              <Badge tone="amber" className="self-start">Proposed</Badge>
              <p className="font-ui text-base font-semibold text-[var(--b-fg)]">{o.title}</p>
              <p className="text-base leading-relaxed text-[var(--b-muted)]">{o.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Endorsement details: Powered by GN Club and Powered by GN Ventures. Placement rules are Proposed. */
export function Endorsement() {
  const lines = ["Powered by GN Club", "Powered by GN Ventures"] as const;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SubHeading>Endorsement</SubHeading>
        <Badge tone="amber">Placement Proposed</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <ul className="grid gap-4 sm:grid-cols-2">
          {lines.map((line) => (
            <li key={line}>
              <Card brand="mazal" glass className="flex h-full flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                  <MazalMark width={40} label="Mazal M mark" />
                  <span aria-hidden="true" className="h-8 w-px bg-[var(--b-border)]" />
                  <span className="font-ui text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-muted)]">{line}</span>
                </div>
                <p className="text-sm text-[var(--b-muted)]">Small, set in muted, beside the M. Never larger than the M.</p>
              </Card>
            </li>
          ))}
        </ul>
        <Card brand="mazal" glass className="flex items-center gap-4">
          <span className="h-20 w-20 shrink-0"><ThemedLogo brand="ventures" fixed="dark" sizes="80px" /></span>
          <p className="text-base leading-relaxed text-[var(--b-fg)]">
            Mazal is a department of GN Ventures, equal to the other five departments. Mazal was incubated by GN
            Club, which the Powered by GN Club line records.
          </p>
        </Card>
      </div>
    </div>
  );
}
