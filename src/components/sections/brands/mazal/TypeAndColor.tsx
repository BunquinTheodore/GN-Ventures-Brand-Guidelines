import { Badge } from "@/components/ui";
import { SubHeading } from "../parts";
import { LIME, MUTED, NAVY, STOP_RED } from "./data";
import { PlateStack } from "./Plate";
import { SocialOnly, WebOnly } from "./Mark";

interface RoleRow {
  readonly role: string;
  readonly spec: string;
  readonly sample: string;
  readonly style: Readonly<Record<string, string | number>>;
}

const WEB_ROLES: readonly RoleRow[] = [
  { role: "Titles", spec: "Josefin Sans 300, caps, +0.04em", sample: "More fun in Mazal", style: { fontFamily: "var(--font-josefin), 'Josefin Sans', sans-serif", fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 40 } },
  { role: "Body", spec: "Manrope 400 to 700", sample: "A free community for crypto and gold.", style: { fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontSize: 18 } },
  { role: "UI", spec: "Poppins 400, 500, 600. Buttons 15px uppercase, 0.05em", sample: "Join the community", style: { fontFamily: "var(--font-poppins), 'Poppins', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 15 } },
];

const ARCHIVO = "var(--font-archivo), 'Archivo', sans-serif";
const SOCIAL_ROLES: readonly RoleRow[] = [
  { role: "Headlines and stats", spec: "Archivo 900 (Archivo Black)", sample: "A friend who trades.", style: { fontFamily: ARCHIVO, fontWeight: 900, fontSize: 44, lineHeight: 1.05 } },
  { role: "Pills and CTAs", spec: "Archivo 800", sample: "Comment MAZAL to learn more", style: { fontFamily: ARCHIVO, fontWeight: 800, fontSize: 20 } },
  { role: "Body", spec: "Archivo 700", sample: "A community. Not just a page.", style: { fontFamily: ARCHIVO, fontWeight: 700, fontSize: 18 } },
];

function Roles({ rows, dark }: { readonly rows: readonly RoleRow[]; readonly dark?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[var(--b-radius)] border border-[var(--b-border)]" style={{ background: dark ? NAVY : "var(--b-surface)" }}>
      <ul>
        {rows.map((r) => (
          <li key={r.role} className="grid gap-2 border-b border-[var(--b-border)] p-5 last:border-0 md:grid-cols-[13rem_minmax(0,1fr)] md:items-baseline md:gap-6">
            <div>
              <p className="font-ui text-xs font-semibold uppercase tracking-[0.12em] text-[var(--b-accent)]">{r.role}</p>
              <p className="text-sm text-[var(--b-muted)]">{r.spec}</p>
            </div>
            <p className="text-[var(--b-fg)]" style={r.style}>{r.sample}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Type extras: the roles each channel gives its fonts, live. */
export function TypeRoles() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <SubHeading>Roles by channel</SubHeading>
        <Badge tone="neutral">Archivo is social kit only</Badge>
      </div>
      <WebOnly><Roles rows={WEB_ROLES} /></WebOnly>
      <SocialOnly><Roles rows={SOCIAL_ROLES} dark /></SocialOnly>
      <p className="text-sm text-[var(--b-muted)]">
        Sizes shown are specimens, not a spec. The kit gives weights and roles but no pixel scale, so a social scale is TBC.
      </p>
    </div>
  );
}

interface Rule { readonly color: string; readonly name: string; readonly rule: string }

const SOCIAL_RULES: readonly Rule[] = [
  { color: LIME, name: "Cyber Lime #C0F030", rule: "The M, headline accent, CTAs" },
  { color: NAVY, name: "Deep Midnight Navy #04070C", rule: "The plate, gradient to #05090F" },
  { color: "#0128A9", name: "Electric Blue #0128A9", rule: "Ambient light only, never text" },
  { color: "#FFFFFF", name: "White #FFFFFF", rule: "Text" },
  { color: MUTED, name: "Muted #8F94A8", rule: "Secondary text" },
  { color: STOP_RED, name: "Stop Red #FF5959", rule: "Stop-loss values only" },
];

function RuleChips() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {SOCIAL_RULES.map((r) => (
        <li key={r.name} className="flex items-center gap-3 rounded-[var(--b-radius)] border border-[var(--b-border)] p-3">
          <span aria-hidden="true" className="h-10 w-10 shrink-0 border border-[var(--b-border)]" style={{ background: r.color }} />
          <span>
            <span className="block text-base text-[var(--b-fg)]">{r.name}</span>
            <span className="block text-sm text-[var(--b-muted)]">{r.rule}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Color extras: where each social kit color is allowed, and the plate built layer by layer. */
export function ColorExtras() {
  return (
    <div className="space-y-6">
      <div>
        <SubHeading>Social kit color roles</SubHeading>
        <RuleChips />
      </div>
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <SubHeading>The plate, layer by layer</SubHeading>
          <Badge tone="accent">Flat, zero glow</Badge>
        </div>
        <PlateStack />
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--b-muted)]">
          Each tile adds one layer to the one before it. Tile seven is the finished plate. Lime light enters from
          off-canvas top left and blue from bottom right, both soft and ambient. None of it is a glow on an object.
        </p>
      </div>
    </div>
  );
}
