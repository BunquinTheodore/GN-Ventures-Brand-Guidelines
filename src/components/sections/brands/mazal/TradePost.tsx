"use client";

import { useId, useState } from "react";
import { Badge } from "@/components/ui";
import { LIME, MUTED, NAVY, STOP_RED, TRADE_REQUIRED } from "./data";
import { MazalMark } from "./Mark";
import { Plate } from "./Plate";

interface Levels {
  readonly entry: string;
  readonly stop: string;
  readonly target: string;
}

/** Illustrative sample values so the component has something to draw. Not a trade. */
const SAMPLE: Levels = { entry: "100", stop: "95", target: "115" };

type Result = { readonly ok: true; readonly rr: string } | { readonly ok: false; readonly reason: string };

/** Long trade: risk is entry minus stop, reward is target minus entry. */
function computeRR(levels: Levels): Result {
  const raw = [levels.entry, levels.stop, levels.target];
  const [entry, stop, target] = raw.map(Number);
  if (raw.some((v) => v.trim() === "") || ![entry, stop, target].every(Number.isFinite)) {
    return { ok: false, reason: "Enter a number in all three fields." };
  }
  if (!(stop < entry)) return { ok: false, reason: "For a long, the stop sits below the entry." };
  if (!(target > entry)) return { ok: false, reason: "For a long, the target sits above the entry." };
  return { ok: true, rr: ((target - entry) / (entry - stop)).toFixed(1) };
}

function Field({ label, value, onChange }: { readonly label: string; readonly value: string; readonly onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-ui text-xs font-medium uppercase tracking-[0.12em] text-[var(--b-muted)]">{label}</label>
      <input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-12 w-full rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[var(--b-surface)] px-4 font-mono text-base text-[var(--b-fg)]"
      />
    </div>
  );
}

function Row({ label, value, color }: { readonly label: string; readonly value: string; readonly color: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/10 py-[2.2cqw]">
      <dt style={{ color: MUTED, fontSize: "4.2cqw" }}>{label}</dt>
      <dd style={{ color, fontSize: "6.4cqw" }} className="font-black">{value}</dd>
    </div>
  );
}

function PostPreview({ levels, result }: { readonly levels: Levels; readonly result: Result }) {
  return (
    <div className="mx-auto w-full max-w-[26rem] [container-type:inline-size]">
      <Plate className="aspect-square w-full border border-[var(--b-border)]">
        <div className="flex h-full flex-col justify-between p-[7cqw]" style={{ fontFamily: "var(--font-archivo), 'Archivo', sans-serif", color: "#fff" }}>
          <div className="flex items-center justify-between">
            <MazalMark width="9cqw" label="Mazal M mark" />
            <span className="font-extrabold uppercase" style={{ color: LIME, fontSize: "3.6cqw", letterSpacing: "0.06em" }}>Unrealised</span>
          </div>
          <dl>
            <Row label="Entry" value={levels.entry || "TBC"} color="#fff" />
            <Row label="Stop" value={levels.stop || "TBC"} color={STOP_RED} />
            <Row label="Target" value={levels.target || "TBC"} color="#fff" />
            <Row label="R:R" value={result.ok ? result.rr : "TBC"} color={LIME} />
          </dl>
          <p className="font-extrabold" style={{ background: LIME, color: NAVY, fontSize: "3.8cqw", padding: "2.4cqw 4cqw", alignSelf: "flex-start", borderRadius: 999 }}>
            Comment MAZAL to learn more
          </p>
        </div>
      </Plate>
    </div>
  );
}

/** Trade post anatomy: entry, stop, target and R:R, with the open trade labeled unrealised. */
export default function TradePost() {
  const [levels, setLevels] = useState<Levels>(SAMPLE);
  const result = computeRR(levels);
  const set = (key: keyof Levels) => (v: string) => setLevels((prev) => ({ ...prev, [key]: v }));
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Required on every trade post</Badge>
          {TRADE_REQUIRED.map((r) => (<Badge key={r} tone="neutral">{r}</Badge>))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Entry" value={levels.entry} onChange={set("entry")} />
          <Field label="Stop" value={levels.stop} onChange={set("stop")} />
          <Field label="Target" value={levels.target} onChange={set("target")} />
        </div>
        <p role="status" className={`text-base ${result.ok ? "text-[var(--b-fg)]" : "text-[var(--b-danger)]"}`}>
          {result.ok ? `R:R works out to ${result.rr}. Long trade: risk is entry minus stop, reward is target minus entry.` : result.reason}
        </p>
        <ul className="list-disc space-y-1 pl-5 text-base leading-relaxed text-[var(--b-muted)]">
          <li>Open trades are labeled unrealised.</li>
          <li>Stop Red is for the stop-loss value only.</li>
          <li>Never write guaranteed profit, risk-free or easy money. Never call a post a signal.</li>
        </ul>
        <p className="text-sm text-[var(--b-muted)]">Numbers here are editable samples. They are not a trade or a claim.</p>
      </div>
      <PostPreview levels={levels} result={result} />
    </div>
  );
}
