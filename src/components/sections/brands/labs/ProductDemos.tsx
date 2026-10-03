"use client";

import { useState, type KeyboardEvent } from "react";
import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Card, SubHeading } from "../parts";

type TabId = "consult" | "jobs" | "talent";
const TABS: readonly { readonly id: TabId; readonly label: string }[] = [
  { id: "consult", label: "Consultation" },
  { id: "jobs", label: "Jobs board" },
  { id: "talent", label: "Talent pool" },
];

const FIELD =
  "min-h-11 w-full rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-surface)_70%,transparent)] px-4 text-base text-[var(--b-fg)] placeholder:text-[var(--b-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]";

function ConsultForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="space-y-1 text-sm text-[var(--b-muted)]">
        <span>Your name</span>
        <input className={FIELD} placeholder="Name" autoComplete="off" />
      </label>
      <label className="space-y-1 text-sm text-[var(--b-muted)]">
        <span>Work email</span>
        <input type="email" className={FIELD} placeholder="name@company.com" autoComplete="off" />
      </label>
      <label className="space-y-1 text-sm text-[var(--b-muted)] sm:col-span-2">
        <span>What would you like to automate?</span>
        <textarea rows={3} className={cn(FIELD, "py-3")} placeholder="Describe the task in plain words" />
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" variant="primary" data-sfx="click">
          Book a consultation
        </Button>
        {sent ? <Badge tone="cyan">Demo only. Nothing was sent.</Badge> : null}
      </div>
    </form>
  );
}

const TAGS: readonly string[] = ["Role type TBC", "Location TBC", "Arrangement TBC"];

function RowList({ kind }: { readonly kind: "jobs" | "talent" }) {
  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {TAGS.map((tag) => (
        <li
          key={`${kind}-${tag}`}
          className="gn-zoom space-y-2 rounded-[var(--b-radius)] border border-[var(--b-border)] bg-[color-mix(in_srgb,var(--b-surface)_70%,transparent)] p-4"
        >
          <p className="text-base font-semibold text-[var(--b-fg)]">{kind === "jobs" ? "Sample role title" : "Sample profile"}</p>
          <Badge tone="neutral">{tag}</Badge>
          <p className="text-sm text-[var(--b-muted)]">Placeholder content. Real listings are TBC.</p>
        </li>
      ))}
    </ul>
  );
}

/** Interactive mock of the three Labs product surfaces, in Labs tokens. All content is placeholder. */
export default function ProductDemos() {
  const [tab, setTab] = useState<TabId>("consult");

  /** Roving tabindex: arrows, Home and End move selection and focus. */
  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const index = TABS.findIndex((t) => t.id === tab);
    const last = TABS.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (index + 1) % TABS.length
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (index + last) % TABS.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(TABS[next].id);
    document.getElementById(`labs-tab-${TABS[next].id}`)?.focus();
  }

  return (
    <section aria-labelledby="labs-demo-h" className="space-y-4">
      <SubHeading>
        <span id="labs-demo-h">Product surfaces</span>
      </SubHeading>
      <Card brand="labs" glass className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Labs surfaces" onKeyDown={onTabKey} className="inline-flex flex-wrap rounded-full border border-[var(--b-border)] p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`labs-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={tab === t.id ? "labs-tabpanel" : undefined}
                tabIndex={tab === t.id ? 0 : -1}
                data-sfx="toggle"
                onClick={() => setTab(t.id)}
                className={cn(
                  "min-h-11 rounded-full px-4 font-ui text-xs font-medium uppercase tracking-[0.1em] transition-colors",
                  tab === t.id ? "bg-[var(--b-accent)] text-[var(--b-accent-fg)]" : "text-[var(--b-fg)] hover:text-[var(--b-accent)]",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Badge tone="amber">Sample content</Badge>
        </div>
        <div id="labs-tabpanel" role="tabpanel" aria-labelledby={`labs-tab-${tab}`}>
          {tab === "consult" ? <ConsultForm /> : <RowList kind={tab} />}
        </div>
      </Card>
    </section>
  );
}
