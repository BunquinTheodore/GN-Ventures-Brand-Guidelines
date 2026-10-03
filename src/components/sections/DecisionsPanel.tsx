import { Badge, GlowCard } from "@/components/ui";

const DECISIONS: readonly { readonly title: string; readonly body: string }[] = [
  {
    title: "Canonical GN lime",
    body: "Proposal: #C6F24E (GN Club's). Sampled limes range from #B0E62F to #CAF14A across the sites.",
  },
  { title: "Current GN Club logo style", body: "Two logo styles exist. Which one is current needs owner confirmation." },
  {
    title: "Mazal styling",
    body: "Web (glass, Josefin Sans) versus the social kit (flat, Archivo). Documented as two channels until decided.",
  },
  {
    title: "Original vector files",
    body: "Only Mazal's M has original SVGs. All other logos on this site are traced and labeled derived.",
  },
  { title: "Umbrella tagline and description", body: "No official text exists. TBC." },
  { title: "GN Ventures Service Catalog PDF", body: "Referenced in GN Club notes but not found." },
];

/** The six open decisions, shown as a numbered panel with Proposed badges. */
export default function DecisionsPanel() {
  return (
    <GlowCard className="md:p-8">
      <div role="group" aria-labelledby="decisions-title" className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 id="decisions-title" className="font-ui text-xl font-semibold">
            Decisions needed
          </h3>
          <Badge tone="amber">6 open</Badge>
        </div>
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DECISIONS.map((d, i) => (
            <li
              key={d.title}
              className="rounded-xl border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-fg)_4%,transparent)] p-4"
            >
              <p className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-[var(--b-accent)]">{String(i + 1).padStart(2, "0")}</span>
                <Badge tone="cyan">Proposed</Badge>
              </p>
              <h4 className="mt-2 font-ui text-base font-semibold">{d.title}</h4>
              <p className="mt-1 text-[var(--b-muted)]">{d.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </GlowCard>
  );
}
