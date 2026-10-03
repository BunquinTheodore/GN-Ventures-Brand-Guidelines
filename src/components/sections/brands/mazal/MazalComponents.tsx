import { Badge, Button, GlowCard } from "@/components/ui";
import { BRANDS } from "@/content/brands";
import { Card, DISPLAY_CLS, PartFrame, SubHeading, type ChapterPartProps } from "../parts";
import { LIME, MUTED, NAVY, STOP_RED } from "./data";
import { MazalMark, SocialOnly, WebOnly } from "./Mark";

/** Web pill: radius 999px, 15px uppercase Poppins, 0.05em tracking, padding 17px 34px. */
const PILL_STYLE = {
  padding: "17px 34px",
  borderRadius: 999,
  fontSize: 15,
  letterSpacing: "0.05em",
  textTransform: "uppercase" as const,
};

const NAV_ITEMS: readonly string[] = ["Community", "Workshops", "Join"];

function WebDemos() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <Card brand="mazal" glass className="space-y-5">
        <SubHeading>Pill buttons</SubHeading>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" style={PILL_STYLE} data-sfx="click">Primary</Button>
          <Button variant="secondary" style={PILL_STYLE} data-sfx="click">Secondary</Button>
          <Button variant="outline" style={PILL_STYLE} data-sfx="click">Outline</Button>
        </div>
        <p className="text-sm text-[var(--b-muted)]">Radius 999px, 15px uppercase Poppins, 0.05em, padding 17px by 34px.</p>
      </Card>
      <GlowCard zoom className="flex flex-col gap-3" style={{ borderColor: "rgba(192,240,48,0.3)" }}>
        <SubHeading>Glass card, green stroke</SubHeading>
        <Badge tone="accent" className="self-start">Community</Badge>
        <p className={`text-2xl text-[var(--b-fg)] ${DISPLAY_CLS}`}>Workshops and live sessions</p>
        <p className="text-base leading-relaxed text-[var(--b-muted)]">
          Card fill rgba(14,18,32,0.72), blur 26px, saturate 170%, hairline rgba(255,255,255,0.09). The green stroke is
          rgba(192,240,48,0.3).
        </p>
      </GlowCard>
      <Card brand="mazal" glass className="space-y-4">
        <SubHeading>Navigation</SubHeading>
        <nav aria-label="Mazal sample navigation" className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-full border border-[var(--b-border)] px-5 py-1">
          <MazalMark width={28} label="Mazal M mark" />
          {NAV_ITEMS.map((n, i) => (
            <a key={n} href="#mazal-components" aria-current={i === 0 ? "page" : undefined} className={`inline-flex min-h-11 items-center font-ui text-[0.8125rem] font-medium uppercase tracking-[0.1em] hover:text-[var(--b-accent)] ${i === 0 ? "text-[var(--b-accent)]" : "text-[var(--b-fg)]"}`}>
              {n}
            </a>
          ))}
        </nav>
        <p className="text-sm text-[var(--b-muted)]">Uppercase Poppins with 0.1em tracking. Labels are samples.</p>
      </Card>
    </div>
  );
}

/** Flat social controls: no shadow, no glow, no blur. */
function FlatPill({ children, tone }: { readonly children: string; readonly tone: "lime" | "line" | "muted" }) {
  const styles = {
    lime: { background: LIME, color: NAVY, border: `2px solid ${LIME}` },
    line: { background: "transparent", color: "#fff", border: "2px solid #fff" },
    muted: { background: "transparent", color: MUTED, border: `2px solid ${MUTED}` },
  } as const;
  return (
    <span className="inline-flex min-h-11 items-center rounded-full px-6 text-sm font-extrabold uppercase tracking-[0.04em]" style={styles[tone]}>
      {children}
    </span>
  );
}

function SocialDemos() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-5 border border-[var(--b-border)] p-5" style={{ background: "var(--b-surface)" }}>
        <SubHeading>Pills and CTAs, Archivo 800</SubHeading>
        <div className="flex flex-wrap gap-3">
          <FlatPill tone="lime">Comment MAZAL to learn more</FlatPill>
          <FlatPill tone="line">Outline</FlatPill>
          <FlatPill tone="muted">Muted</FlatPill>
        </div>
        <p className="text-sm text-[var(--b-muted)]">Flat fills. Zero glow. The lime pill carries navy text, never white.</p>
      </div>
      <div className="space-y-4 border border-[var(--b-border)] p-5" style={{ background: "var(--b-surface)" }}>
        <SubHeading>Stat block, Archivo 900</SubHeading>
        <p className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-none" style={{ color: LIME }}>R:R 3.0</p>
        <p className="text-base font-bold text-white">Headlines and stats in Archivo Black.</p>
        <p className="text-base font-bold" style={{ color: MUTED }}>Body in Archivo 700, secondary in Muted.</p>
        <Badge tone="neutral">Sample value, not a trade</Badge>
      </div>
      <div className="space-y-4 border border-[var(--b-border)] p-5" style={{ background: "var(--b-surface)" }}>
        <SubHeading>Stop-loss value</SubHeading>
        <dl className="grid grid-cols-2 gap-3 text-base font-bold">
          <dt style={{ color: MUTED }}>Stop</dt>
          <dd className="text-right" style={{ color: STOP_RED }}>95.00</dd>
          <dt style={{ color: MUTED }}>Target</dt>
          <dd className="text-right text-white">115.00</dd>
        </dl>
        <p className="text-sm text-[var(--b-muted)]">Stop Red appears on stop-loss values and nowhere else. Sample numbers.</p>
      </div>
    </div>
  );
}

/** Components for both channels. The chapter switch decides which set shows. */
export default function MazalComponents({ brand: id, className }: ChapterPartProps) {
  return (
    <PartFrame
      brand={id}
      part="components"
      title="Components"
      lead="Rendered live in Mazal's own tokens. Use the channel switch: web shows glass and pills, the social kit shows flat shapes in Archivo."
      className={className}
    >
      <WebOnly><WebDemos /></WebOnly>
      <SocialOnly><SocialDemos /></SocialOnly>
      <div>
        <SubHeading>Recipe</SubHeading>
        <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {BRANDS[id].ui.map((r) => (
            <div key={r.label} className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-4">
              <dt className="mb-1 font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">{r.label}</dt>
              <dd className="text-base leading-relaxed text-[var(--b-fg)]">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PartFrame>
  );
}
