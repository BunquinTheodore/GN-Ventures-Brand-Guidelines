"use client";

import { useState } from "react";
import { BRANDS } from "@/content/brands";
import { FONT_VIEWS, FONTS_ZIP, formatBytes, specimenFontFaceCss, type FontView } from "@/content/fonts";
import { FONTS_TOTAL_BYTES } from "@/content/fonts-manifest";
import { Badge, Button, GlowCard, SectionShell, toast } from "@/components/ui";
import { sfx } from "@/lib/sfx";
import { copyText } from "@/lib/utils";

const PANGRAM = "The quick brown fox jumps over the lazy dog 0123456789";
const FACE_CSS = specimenFontFaceCss();

function CopySnippet({ snippet, family }: { readonly snippet: string; readonly family: string }) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    const ok = await copyText(snippet);
    if (!ok) {
      sfx.play("error");
      toast.show("Copy failed. Select the snippet and copy manually.", "error");
      return;
    }
    sfx.play("copy");
    toast.show(`Copied next/font snippet for ${family}`);
    setDone(true);
    window.setTimeout(() => setDone(false), 1400);
  }

  return (
    <button
      type="button"
      data-sfx="copy"
      onClick={onCopy}
      aria-label={`Copy next/font snippet for ${family}`}
      className="min-h-11 rounded-md border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-fg)_7%,transparent)] px-3 font-ui text-xs font-medium uppercase tracking-[0.1em] text-[var(--b-accent)] transition-colors hover:border-[var(--b-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]"
    >
      {done ? "Copied" : "Copy snippet"}
    </button>
  );
}

function Specimen({ view }: { readonly view: FontView }) {
  const { entry } = view;
  const style = { fontFamily: `"${view.specimenFamily}", ${entry.slug.includes("mono") ? "monospace" : "sans-serif"}` };
  const caps = view.caps ? "uppercase tracking-[0.04em]" : "";
  const heaviest = entry.weights[entry.weights.length - 1] ?? 400;
  const lightest = entry.weights[0] ?? 400;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2" style={style}>
        <span aria-hidden="true" className="text-7xl leading-none text-[var(--b-accent)]" style={{ fontWeight: lightest }}>
          Aa
        </span>
        <span aria-hidden="true" className="text-7xl leading-none" style={{ fontWeight: heaviest }}>
          Gg
        </span>
      </div>
      <ul className="space-y-1.5" aria-label={`${entry.family} weights`}>
        {entry.weights.map((w) => (
          <li key={w} className="flex items-baseline gap-3">
            <span className="w-9 shrink-0 font-mono text-xs text-[var(--b-muted)]">{w}</span>
            <span className={`truncate text-lg ${caps}`} style={{ ...style, fontWeight: w }}>
              {PANGRAM}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FileLinks({ view }: { readonly view: FontView }) {
  const { entry } = view;
  return (
    <div className="space-y-2">
      <p className="gn-eyebrow">Download woff2 (latin subset)</p>
      <div className="flex flex-wrap gap-2">
        {entry.files.map((f) => (
          <Button
            key={f.file}
            variant="secondary"
            href={f.file}
            download
            aria-label={`Download ${entry.family} ${f.weight} woff2, ${formatBytes(f.bytes)}`}
            className="min-h-11 px-4 text-xs"
          >
            {f.weight} · {formatBytes(f.bytes)}
          </Button>
        ))}
        <Button
          variant="outline"
          href={entry.licenseFile}
          download
          aria-label={`Download ${entry.family} OFL license text`}
          className="min-h-11 px-4 text-xs"
        >
          OFL.txt · {formatBytes(entry.licenseBytes)}
        </Button>
      </div>
    </div>
  );
}

function FamilyCard({ view, index }: { readonly view: FontView; readonly index: number }) {
  const { entry } = view;
  return (
    <GlowCard as="article" shineDelay={index * 0.6} className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl">{entry.family}</h3>
          <p className="mt-1 text-sm text-[var(--b-muted)]">{entry.role}</p>
        </div>
        <Badge tone="neutral">{entry.license}</Badge>
      </header>

      <Specimen view={view} />

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="gn-eyebrow mb-1">Weights</dt>
          <dd className="font-mono">{entry.weights.join(", ")}</dd>
        </div>
        <div>
          <dt className="gn-eyebrow mb-1">Used by</dt>
          <dd className="flex flex-wrap gap-1.5">
            {entry.brands.map((id) => (
              <Badge key={id} tone="cyan">
                {BRANDS[id].name}
              </Badge>
            ))}
          </dd>
        </div>
      </dl>
      {entry.note ? <p className="text-sm text-[var(--b-muted)]">{entry.note}</p> : null}

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="gn-eyebrow">next/font</p>
          <CopySnippet snippet={view.snippet} family={entry.family} />
        </div>
        <pre className="overflow-x-auto rounded-lg border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-bg,#000)_70%,transparent)] p-3 font-mono text-xs leading-relaxed">
          <code>{view.snippet}</code>
        </pre>
      </div>

      <FileLinks view={view} />

      <footer className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--b-muted)]">
        <a
          href={entry.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-sfx="nav"
          className="min-h-11 content-center text-[var(--b-accent)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]"
        >
          {entry.family} on Google Fonts
        </a>
        <span>Source: {entry.source}</span>
      </footer>
    </GlowCard>
  );
}

function BulkNote() {
  return (
    <GlowCard className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
      <div className="space-y-1">
        <p className="font-ui text-sm font-medium">
          {FONT_VIEWS.length} families, {FONT_VIEWS.reduce((n, v) => n + v.entry.files.length, 0)} woff2 files,{" "}
          {formatBytes(FONTS_TOTAL_BYTES)} in total.
        </p>
        <p className="text-sm text-[var(--b-muted)]">
          {FONTS_ZIP
            ? "Everything in one archive."
            : "No zip archive is published yet, so each file is a separate download below."}{" "}
          All families are licensed under the SIL Open Font License 1.1, which allows use, embedding and redistribution
          in commercial work. Keep the OFL.txt file with any copy you share and do not sell the fonts on their own.
        </p>
      </div>
      {FONTS_ZIP ? (
        <Button href={FONTS_ZIP.href} download aria-label={`Download all fonts, ${formatBytes(FONTS_ZIP.bytes)}`}>
          Download all fonts
        </Button>
      ) : (
        <Badge tone="amber">Zip pending</Badge>
      )}
    </GlowCard>
  );
}

export default function Fonts() {
  return (
    <SectionShell
      id="fonts"
      num="29"
      eyebrow="Part III"
      title="Fonts"
      lead="Every font family used across GN Ventures and its departments, rendered live from the shipped files. Each family lists its weights, role, who uses it, how to load it with next/font and where to download it."
    >
      <style>{FACE_CSS}</style>
      <BulkNote />
      <div className="grid gap-6 xl:grid-cols-2">
        {FONT_VIEWS.map((view, i) => (
          <FamilyCard key={view.entry.slug} view={view} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}
