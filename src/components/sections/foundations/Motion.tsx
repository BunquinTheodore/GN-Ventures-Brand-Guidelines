"use client";

import { useEffect, useRef, useState } from "react";
import { Badge, Button, GlowCard, SectionShell } from "@/components/ui";
import { sfx, type SfxKind } from "@/lib/sfx";
import { useSfxMuted } from "@/lib/useSfxMuted";
import { cn } from "@/lib/utils";
import { SpecTable, SubHead } from "./Parts";

const PERIODS = [
  { id: "labs", label: "GN Labs", seconds: 6.5 },
  { id: "site", label: "This site", seconds: 7 },
  { id: "club", label: "GN Club", seconds: 8 },
] as const;

const SOUNDS: readonly SfxKind[] = ["click", "nav", "copy", "download", "hover", "open", "toggle", "error"];
const BUTTON_STATES = ["Default", "Hover", "Pressed", "Focus", "Disabled"] as const;
const VARIANTS = ["primary", "secondary", "outline"] as const;

/** Scoped overrides so the toggles can preview the reduced fallbacks without changing the OS setting. */
const STAGE_CSS = `
.mo-stage[data-rm="reduce"] .gn-shine::after,
.mo-stage[data-rm="reduce"] .gn-btn::after{animation:none!important;transform:translateX(-10%)!important}
.mo-stage[data-rm="reduce"] .gn-zoom:hover{transform:none!important}
.mo-stage[data-rm="reduce"] .mo-splash-word{animation:none!important;opacity:1!important}
@media (prefers-reduced-motion:no-preference){
.mo-stage[data-rm="full"] .gn-shine::after{animation-duration:var(--mo-period,7s)!important}
}
.mo-stage[data-rt="reduce"] .gn-glass{background:var(--b-surface)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.mo-stage[data-rt="reduce"] .gn-shine::after,
.mo-stage[data-rt="reduce"] .gn-btn::after{display:none!important}
.mo-stage[data-rt="reduce"] .gn-btn-secondary{backdrop-filter:none!important;background:var(--b-surface)!important}
.mo-stage .mo-forced-zoom{transform:scale(1.03)}
.mo-stage .mo-hover.gn-btn-primary{filter:brightness(1.08) saturate(1.1)}
.mo-stage .mo-hover.gn-btn-secondary{border-color:var(--_a);filter:brightness(1.12)}
.mo-stage .mo-hover.gn-btn-outline{background:color-mix(in srgb,var(--_a) 16%,transparent);border-color:var(--_a);color:var(--b-fg)}
.mo-stage .mo-pressed{transform:translateY(1px) scale(.99)}
.mo-stage .mo-focus{outline:2px solid var(--b-accent);outline-offset:3px}
@keyframes mo-splash{0%{opacity:0;letter-spacing:.5em}100%{opacity:1;letter-spacing:.12em}}
.mo-splash-word{animation:mo-splash .9s cubic-bezier(.2,.8,.2,1) both}
`;

function useSystemPrefs() {
  const [prefs, setPrefs] = useState({ motion: false, transparency: false });
  useEffect(() => {
    try {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      const t = window.matchMedia("(prefers-reduced-transparency: reduce)");
      const read = () => setPrefs({ motion: m.matches, transparency: t.matches });
      read();
      m.addEventListener("change", read);
      t.addEventListener("change", read);
      return () => {
        m.removeEventListener("change", read);
        t.removeEventListener("change", read);
      };
    } catch {
      return undefined;
    }
  }, []);
  return prefs;
}

interface ToggleProps {
  readonly label: string;
  readonly hint: string;
  readonly on: boolean;
  readonly onChange: (next: boolean) => void;
}

function Toggle({ label, hint, on, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-sfx="toggle"
      onClick={() => onChange(!on)}
      className="flex min-h-11 items-center gap-3 rounded-[var(--b-radius)] border border-[var(--b-border)] px-4 py-2 text-left hover:border-[var(--b-accent)]"
    >
      <span aria-hidden="true" className={cn("relative h-6 w-11 shrink-0 rounded-full border border-[var(--b-border)] transition-colors", on ? "bg-[var(--b-accent)]" : "bg-[var(--b-surface)]")}>
        <span className={cn("absolute top-0.5 h-4.5 w-4.5 rounded-full bg-[var(--b-fg)] transition-all", on ? "left-[1.375rem]" : "left-0.5")} style={{ height: "1.125rem", width: "1.125rem" }} />
      </span>
      <span>
        <span className="block font-ui text-sm font-semibold text-[var(--b-fg)]">{label}</span>
        <span className="block text-[0.8125rem] leading-snug text-[var(--b-muted)]">{hint}</span>
      </span>
    </button>
  );
}

function ShineDemo({ period, onPeriod }: { readonly period: number; readonly onPeriod: (n: number) => void }) {
  return (
    <GlowCard className="flex flex-col gap-4">
      <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">Shine sweep</p>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">A diagonal light gradient on a loop, soft-light so it only lightens. Pure CSS. The sweep is clipped by overflow-hidden on the card.</p>
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">Period</legend>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <label key={p.id} className="cursor-pointer">
              <input type="radio" name="mo-period" value={p.seconds} checked={period === p.seconds} onChange={() => onPeriod(p.seconds)} data-sfx="toggle" className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-[var(--b-border)] px-4 font-ui text-sm text-[var(--b-fg)] peer-checked:border-[var(--b-accent)] peer-checked:bg-[color-mix(in_srgb,var(--b-accent)_16%,transparent)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--b-accent)]">
                {p.label} <span className="ml-1.5 font-mono text-xs text-[var(--b-muted)]">{p.seconds}s</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </GlowCard>
  );
}

function ZoomDemo({ forced, onForce }: { readonly forced: boolean; readonly onForce: (n: boolean) => void }) {
  return (
    <GlowCard className="flex flex-col gap-4">
      <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">Card hover zoom</p>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">Scale 1.03 on real cards only. Badges, pills and nav sheets stay still even though they are glass too.</p>
      <div className="grid grid-cols-2 items-center gap-4">
        <GlowCard zoom className={cn("!p-4 text-center", forced && "mo-forced-zoom")}>
          <span className="font-ui text-sm font-semibold text-[var(--b-fg)]">Card</span>
          <span className="block text-xs text-[var(--b-muted)]">Hover me</span>
        </GlowCard>
        <div className="flex justify-center">
          <span className="gn-glass rounded-full px-4 py-2 font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-fg)]">Pill, no zoom</span>
        </div>
      </div>
      <Toggle label="Hold the hover state" hint="Pins the card at scale 1.03." on={forced} onChange={onForce} />
    </GlowCard>
  );
}

function ButtonStates() {
  const cls = ["", "mo-hover", "mo-pressed", "mo-focus", ""] as const;
  return (
    <div className="overflow-x-auto rounded-[var(--b-radius)] border border-[var(--b-border)] p-4">
      <table className="w-full min-w-[44rem] border-collapse text-sm">
        <caption className="sr-only">Button variants in each state, forced for display</caption>
        <thead>
          <tr className="font-ui text-xs uppercase tracking-[0.1em] text-[var(--b-muted)]">
            <th scope="col" className="p-2 text-left font-medium">Variant</th>
            {BUTTON_STATES.map((s) => <th key={s} scope="col" className="p-2 text-left font-medium">{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {VARIANTS.map((v) => (
            <tr key={v}>
              <th scope="row" className="p-2 text-left font-ui text-sm font-medium capitalize text-[var(--b-fg)]">{v}</th>
              {BUTTON_STATES.map((s, i) => (
                <td key={s} className="p-2">
                  <Button variant={v} className={cls[i]} disabled={s === "Disabled"} tabIndex={-1} data-sfx="none">Button</Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SplashDemo() {
  const [run, setRun] = useState(0);
  return (
    <GlowCard className="flex flex-col gap-4">
      <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">Splash</p>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">The splash shows the site name, and the first click on load unlocks the sound. This is a preview of the behavior.</p>
      <div className="flex h-28 items-center justify-center rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--deep)]">
        <span key={run} className="mo-splash-word font-display text-2xl uppercase text-[var(--b-accent)]" style={{ fontFamily: "var(--b-font-display)", fontWeight: 300 }}>GN Ventures</span>
      </div>
      <Button variant="secondary" onClick={() => setRun((n) => n + 1)} data-sfx="open">Replay splash</Button>
    </GlowCard>
  );
}

function CursorDemo({ reduced }: { readonly reduced: boolean }) {
  const dot = useRef<HTMLSpanElement>(null);
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    if (dot.current) dot.current.style.transform = `translate(${e.clientX - box.left - 14}px, ${e.clientY - box.top - 14}px)`;
  }
  return (
    <GlowCard className="flex flex-col gap-4">
      <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">Cursor</p>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">This site uses Mazal&apos;s custom cursor (cursor.svg). GN Club has its own mascot cursor, a 44px and 88px PNG. The ring below only previews pointer tracking.</p>
      <div onPointerMove={onMove} className="relative h-28 overflow-hidden rounded-[var(--b-radius)] border border-dashed border-[var(--b-border)] touch-none">
        <span className="absolute inset-0 flex items-center justify-center text-sm text-[var(--b-muted)]">Move your pointer here</span>
        <span ref={dot} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-7 w-7 rounded-full border-2 border-[var(--b-accent)]" style={{ transition: reduced ? "none" : "transform 0.12s ease-out" }} />
      </div>
    </GlowCard>
  );
}

function SoundDemo() {
  const muted = useSfxMuted();
  return (
    <GlowCard className="flex flex-col gap-4">
      <p className="font-ui text-xs uppercase tracking-[0.12em] text-[var(--b-accent)]">Sound</p>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--b-muted)]">Every click makes a short synthesized sound. No audio files. Sound starts after the first gesture and can be muted.</p>
      <div className="flex flex-wrap gap-2">
        {SOUNDS.map((k) => (
          <button key={k} type="button" data-sfx="none" onClick={() => sfx.play(k)} className="min-h-11 rounded-full border border-[var(--b-border)] px-4 font-ui text-sm capitalize text-[var(--b-fg)] hover:border-[var(--b-accent)]">{k}</button>
        ))}
      </div>
      <Toggle label="Muted" hint="Saved on this device." on={muted} onChange={(n) => sfx.setMuted(n)} />
    </GlowCard>
  );
}

const RULES: readonly (readonly string[])[] = [
  ["prefers-reduced-motion: reduce", "The shine freezes to a static highlight. It is not removed. Hover zoom, smooth scroll and splash motion stop."],
  ["prefers-reduced-transparency: reduce", "Glass becomes a solid surface, blur and saturate drop, the shine pseudo-element is hidden."],
  ["Shine sweep", "Always paired with overflow-hidden, because the sweep element is oversized (inset -20%)."],
  ["Hover zoom", "Cards only, about scale 1.03."],
];

export default function Motion() {
  const [period, setPeriod] = useState<number>(7);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [reduceTransparency, setReduceTransparency] = useState(false);
  const [forced, setForced] = useState(false);
  const system = useSystemPrefs();
  const effectiveReduce = reduceMotion || system.motion;

  return (
    <SectionShell
      id="motion"
      num="15"
      eyebrow="Foundations"
      title="Motion"
      lead="Motion is part of the brand: a slow shine on glass, a small lift on cards, bright buttons, a splash, a custom cursor and a click sound. Everything below is live, with toggles that preview the reduced fallbacks."
    >
      <style>{STAGE_CSS}</style>
      <div className="flex flex-wrap items-center gap-4">
        <Toggle label="Preview reduced motion" hint="Static highlight, no zoom, no sweep." on={reduceMotion} onChange={setReduceMotion} />
        <Toggle label="Preview reduced transparency" hint="Solid surfaces, no blur, no shine." on={reduceTransparency} onChange={setReduceTransparency} />
        {system.motion || system.transparency ? (
          <Badge tone="cyan">Your system already requests: {[system.motion && "reduced motion", system.transparency && "reduced transparency"].filter(Boolean).join(" and ")}</Badge>
        ) : null}
      </div>

      <div
        className="mo-stage space-y-5"
        data-rm={effectiveReduce ? "reduce" : "full"}
        data-rt={reduceTransparency ? "reduce" : "full"}
        style={{ ["--mo-period" as string]: `${period}s` }}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <ShineDemo period={period} onPeriod={setPeriod} />
          <ZoomDemo forced={forced} onForce={setForced} />
        </div>
        <div>
          <SubHead title="Bright button states" note="Primary, secondary and outline, each tinted by the accent. States are held for display." />
          <ButtonStates />
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <SplashDemo />
          <CursorDemo reduced={effectiveReduce} />
          <SoundDemo />
        </div>
      </div>

      <div>
        <SubHead title="Reduced motion and transparency" />
        <SpecTable caption="Motion rules and fallbacks" head={["Rule", "Behavior"]} minWidth="32rem" rows={RULES} />
      </div>
    </SectionShell>
  );
}
