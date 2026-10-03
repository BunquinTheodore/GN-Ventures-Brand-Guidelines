import Image from "next/image";
import { Badge, GlowCard, SectionShell } from "@/components/ui";
import type { BadgeTone } from "@/components/ui";
import { assetsFor } from "@/content/assets";
import { BRANDS, DEPARTMENT_ORDER } from "@/content/brands";
import type { Brand, BrandId } from "@/content/types";
import DecisionsPanel from "./DecisionsPanel";

const ONE_LINERS: Readonly<Partial<Record<BrandId, string>>> = {
  media: "News and media services",
  academy: "Certification and e-learning",
  club: "Events and activations",
  labs: "AI integration",
  mazal: "Free trading community",
  commune: "Mobile cafe cart bookings",
};

const STATUS: Readonly<Record<Brand["status"], { readonly label: string; readonly tone: BadgeTone }>> = {
  live: { label: "Live", tone: "accent" },
  dev: { label: "In development", tone: "cyan" },
  placeholder: { label: "Placeholder", tone: "amber" },
  unbranded: { label: "Unbranded", tone: "neutral" },
};

interface DiffRow {
  readonly dept: string;
  readonly palette: string;
  readonly display: string;
  readonly glass: string;
  readonly theme: string;
}

const DIFFERENCES: readonly DiffRow[] = [
  { dept: "GN Media", palette: "Lime #B0E62F, gradient cyan to amber", display: "Josefin Sans 300 caps", glass: "Glass", theme: "Dark" },
  { dept: "GN Academy", palette: "Neon lime (oklch), cyan, gold for verified only", display: "Josefin Sans Light caps", glass: "Light-first surfaces", theme: "Light default, dark alternate" },
  { dept: "GN Club", palette: "Lime #C6F24E, cyan, amber", display: "Josefin Sans 300 caps", glass: "Glass", theme: "Dark" },
  { dept: "GN Labs", palette: "Lime #CAF14A, gradient cyan to amber", display: "Manrope semibold for h1", glass: "Glass", theme: "Dark only" },
  { dept: "Mazal", palette: "Lime #C0F030, blue, navy", display: "Josefin Sans on web, Archivo in the social kit", glass: "Glass on web, flat in social kit", theme: "Dark" },
  { dept: "GN Commune", palette: "Black and white only", display: "Manrope 300, Jost 300 wordmark", glass: "No glass, sketchbook style", theme: "Dark default, light variant" },
];

const TABLE_HEADS: readonly string[] = ["Department", "Palette", "Display font", "Glass", "Theme"];
const LINK_CLASS =
  "mt-auto inline-flex min-h-11 items-center font-ui text-sm font-medium uppercase tracking-[0.1em] text-[var(--b-accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]";

function DepartmentCard({ id, index }: { readonly id: BrandId; readonly index: number }) {
  const brand = BRANDS[id];
  const logo = assetsFor(id).find((a) => a.kind === "primary");
  const status = STATUS[brand.status];
  return (
    <GlowCard as="li" zoom shineDelay={index * 0.5} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-ui text-lg font-semibold">{brand.name}</h3>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      {logo ? (
        <Image
          src={logo.file}
          alt={`${brand.name} logo`}
          width={logo.width ?? 512}
          height={logo.height ?? 512}
          sizes="(min-width: 1024px) 18rem, 70vw"
          className="mx-auto h-40 w-auto rounded-xl object-contain"
        />
      ) : null}
      <p className="text-[var(--b-muted)]">{ONE_LINERS[id]}</p>
      <p className="font-mono text-sm">{brand.domain ?? "Domain TBC"}</p>
      <a href={`#${id}`} data-sfx="nav" className={LINK_CLASS}>
        Open chapter
      </a>
    </GlowCard>
  );
}

function DifferencesTable() {
  return (
    <GlowCard className="md:p-8">
      <h3 className="mb-4 font-ui text-lg font-semibold">Shared system versus per-department differences</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="sr-only">Palette, display font, glass and theme by department</caption>
          <thead>
            <tr className="border-b border-[var(--b-border)] font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">
              {TABLE_HEADS.map((h) => (
                <th key={h} scope="col" className="px-3 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIFFERENCES.map((r) => (
              <tr key={r.dept} className="border-b border-[var(--b-border)] align-top last:border-0">
                <th scope="row" className="px-3 py-3 font-ui font-semibold">
                  {r.dept}
                </th>
                <td className="px-3 py-3 text-[var(--b-muted)]">{r.palette}</td>
                <td className="px-3 py-3 text-[var(--b-muted)]">{r.display}</td>
                <td className="px-3 py-3 text-[var(--b-muted)]">{r.glass}</td>
                <td className="px-3 py-3 text-[var(--b-muted)]">{r.theme}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[var(--b-muted)]">
        Shared across all: the gradient-frame logo plate, Poppins for UI, Manrope for body, and the dark ink
        base (Academy offers it as an alternate).
      </p>
    </GlowCard>
  );
}

export default function Family() {
  return (
    <SectionShell
      id="family"
      num="22"
      eyebrow="The family"
      title="Six departments, one system"
      lead={
        <p>
          Media, Academy, Club, Labs, Mazal and Commune are departments of GN Ventures, equal in standing.
          They share one family look and differ where their audience demands it.
        </p>
      }
    >
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Departments">
        {DEPARTMENT_ORDER.map((id, i) => (
          <DepartmentCard key={id} id={id} index={i} />
        ))}
      </ul>

      <GlowCard className="grid items-center gap-6 md:grid-cols-[auto_1fr] md:p-8">
        <span className="inline-flex w-fit items-center rounded-full border border-[var(--b-border)] px-4 py-2 font-ui text-xs font-medium uppercase tracking-[0.12em]">
          Powered by GN Ventures
        </span>
        <div>
          <h3 className="font-ui text-lg font-semibold">Endorsement rule</h3>
          <p className="mt-1 text-[var(--b-muted)]">
            Departments may carry a quiet &quot;Powered by GN Ventures&quot; chip beneath their own lockup.
            Mazal uses it today. The chip never replaces or resizes the department logo.
          </p>
        </div>
      </GlowCard>

      <DifferencesTable />
      <DecisionsPanel />
    </SectionShell>
  );
}
