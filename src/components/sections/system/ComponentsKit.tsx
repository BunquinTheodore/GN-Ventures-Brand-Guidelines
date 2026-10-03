"use client";

import { useId, useState, type ReactNode } from "react";
import { Badge, Button, GlowCard } from "@/components/ui";
import { BRANDS } from "@/content/brands";
import { cn } from "@/lib/utils";
import { DEPARTMENTS, UsageTable, type DeptId } from "./shared";

type KitBrand = "ventures" | DeptId;
type Variant = "light" | "dark" | "web" | "social";

const SWITCH: readonly { readonly id: KitBrand; readonly label: string }[] = [
  { id: "ventures", label: "GN Ventures" },
  ...DEPARTMENTS.map((d) => ({ id: d.id, label: d.name })),
];

/** Secondary control per department: theme or channel. */
const VARIANTS: Partial<Record<KitBrand, readonly { readonly id: Variant; readonly label: string }[]>> = {
  academy: [{ id: "light", label: "Light" }, { id: "dark", label: "Dark" }],
  commune: [{ id: "dark", label: "Black" }, { id: "light", label: "White" }],
  mazal: [{ id: "web", label: "Web" }, { id: "social", label: "Social kit" }],
};

const NAV_ITEMS = ["Home", "Services", "About", "Contact"] as const;

function Spinner() {
  return <span aria-hidden="true" className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

function Note({ children }: { readonly children: string }) {
  return <p className="mt-3 text-sm text-[var(--b-muted)]">{children}</p>;
}

function Block({ title, children, note }: { readonly title: string; readonly children: ReactNode; readonly note: string }) {
  return (
    <div className="rounded-[var(--b-radius)] border border-[var(--b-border)] p-4 sm:p-5">
      <h3 className="mb-4 font-ui text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[var(--b-accent)]">{title}</h3>
      {children}
      <Note>{note}</Note>
    </div>
  );
}

function ButtonsBlock() {
  return (
    <Block title="Buttons" note="Bright house recipe: lighter gradient fill, top highlight, slow shine. Primary is filled, secondary is glass, outline is a tinted ring. Disabled drops to 50%.">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary" disabled aria-busy="true"><Spinner /> Loading</Button>
      </div>
    </Block>
  );
}

function BadgesBlock() {
  return (
    <Block title="Badges" note="Uppercase Poppins at 0.1em tracking. Tones follow the brand accents. Proposed and TBC use amber.">
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent">Accent</Badge>
        <Badge tone="cyan">Cyan</Badge>
        <Badge tone="amber">Proposed</Badge>
        <Badge tone="neutral">Neutral</Badge>
        <Badge tone="danger">Error</Badge>
      </div>
    </Block>
  );
}

function NavBlock() {
  const [active, setActive] = useState<(typeof NAV_ITEMS)[number]>("Home");
  return (
    <Block title="Navigation" note="Uppercase with 0.1em tracking. Active item gets the accent underline and aria-current.">
      <nav aria-label="Kit navigation demo">
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button
                type="button"
                data-sfx="nav"
                aria-current={active === item ? "page" : undefined}
                onClick={() => setActive(item)}
                className={cn(
                  "gn-nav-link min-h-11 border-b-2 px-1 transition-colors",
                  active === item ? "border-[var(--b-accent)] text-[var(--b-fg)]" : "border-transparent text-[var(--b-muted)] hover:text-[var(--b-fg)]",
                )}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </Block>
  );
}

function InputsBlock() {
  const uid = useId();
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && !value.includes("@");
  const field =
    "min-h-11 w-full rounded-[calc(var(--b-radius)*0.8)] border bg-[color-mix(in_srgb,var(--b-fg)_5%,transparent)] px-3 font-[family-name:var(--b-font-body)] text-base text-[var(--b-fg)] placeholder:text-[var(--b-muted)] focus-visible:border-[var(--b-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]";
  return (
    <Block title="Inputs" note="Visible label, 44px height, accent focus ring. Error state sets aria-invalid and shows a message in the error color, never color alone.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-a`} className="mb-1.5 block font-ui text-sm font-medium text-[var(--b-fg)]">Email (type to test)</label>
          <input id={`${uid}-a`} type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="name@example.com" aria-invalid={invalid} aria-describedby={invalid ? `${uid}-err` : undefined} className={cn(field, invalid ? "border-[var(--b-danger)]" : "border-[var(--b-border)]")} />
          {invalid ? <p id={`${uid}-err`} role="alert" className="mt-1.5 text-sm text-[var(--b-danger)]">Enter an email address with an @.</p> : null}
        </div>
        <div>
          <label htmlFor={`${uid}-b`} className="mb-1.5 block font-ui text-sm font-medium text-[var(--b-fg)]">Error example</label>
          <input id={`${uid}-b`} type="text" defaultValue="name.example.com" aria-invalid="true" aria-describedby={`${uid}-berr`} className={cn(field, "border-[var(--b-danger)]")} />
          <p id={`${uid}-berr`} className="mt-1.5 text-sm text-[var(--b-danger)]">Enter an email address with an @.</p>
        </div>
      </div>
    </Block>
  );
}

function CardBlock() {
  return (
    <Block title="Glass card" note="Translucent surface, blur and saturate, top inset highlight, tinted shadow, continuous shine (soft-light). Hover zoom is for real cards only.">
      <GlowCard zoom>
        <p className="gn-eyebrow mb-1 text-[0.75rem]">Card</p>
        <h4 className="mb-1 text-lg text-[var(--b-fg)]">Card title</h4>
        <p className="text-[0.9375rem] text-[var(--b-muted)]">Body copy in the department body font.</p>
      </GlowCard>
    </Block>
  );
}

function TableBlock({ brand }: { readonly brand: KitBrand }) {
  const ui = BRANDS[brand].ui;
  return (
    <Block title="Table" note="Real tokens for the selected department. Header is uppercase UI type, rows separated by 1px borders, scrolls sideways on phones.">
      <UsageTable caption={`UI tokens for ${BRANDS[brand].name}`} head={["Property", "Value"]} rows={ui.map((u) => [u.label, u.value])} />
    </Block>
  );
}

function StatesBlock() {
  return (
    <Block title="Empty and error states" note="Say what happened and what to do next. One action, no blame, no dash punctuation.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--b-radius)] border border-dashed border-[var(--b-border)] p-4 text-center">
          <p className="font-medium text-[var(--b-fg)]">Nothing here yet</p>
          <p className="mb-3 text-sm text-[var(--b-muted)]">Items you add will show up here.</p>
          <Button variant="outline">Add the first one</Button>
        </div>
        <div role="alert" className="rounded-[var(--b-radius)] border border-[var(--b-danger)] bg-[color-mix(in_srgb,var(--b-danger)_10%,transparent)] p-4 text-center">
          <p className="font-medium text-[var(--b-fg)]">Something went wrong</p>
          <p className="mb-3 text-sm text-[var(--b-muted)]">We could not load this. Check your connection and try again.</p>
          <Button variant="secondary">Try again</Button>
        </div>
      </div>
    </Block>
  );
}

function Switcher({ brand, onChange }: { readonly brand: KitBrand; readonly onChange: (b: KitBrand) => void }) {
  return (
    <div role="group" aria-label="Department switcher" className="flex flex-wrap gap-2">
      {SWITCH.map((s) => (
        <button
          key={s.id}
          type="button"
          data-sfx="toggle"
          aria-pressed={brand === s.id}
          onClick={() => onChange(s.id)}
          className={cn(
            "gn-nav-link min-h-11 rounded-full border px-4 transition-colors",
            brand === s.id ? "border-[var(--lime)] bg-[color-mix(in_srgb,var(--lime)_16%,transparent)] text-[var(--fog)]" : "border-[var(--glass-border)] text-[var(--fog-dim)] hover:text-[var(--fog)]",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default function ComponentsKit() {
  const [brand, setBrand] = useState<KitBrand>("ventures");
  const [variant, setVariant] = useState<Variant | undefined>(undefined);
  const options = VARIANTS[brand];
  const selectBrand = (next: KitBrand) => {
    setBrand(next);
    setVariant(undefined);
  };
  const attrs: Record<string, string | undefined> = {
    "data-brand": brand,
    "data-theme": brand === "academy" || brand === "commune" ? (variant ?? (brand === "academy" ? "light" : "dark")) : undefined,
    "data-channel": brand === "mazal" ? (variant ?? "web") : undefined,
  };
  return (
    <div className="space-y-4">
      <Switcher brand={brand} onChange={selectBrand} />
      {options ? (
        <div role="group" aria-label="Variant" className="flex flex-wrap gap-2">
          {options.map((o) => {
            const current = variant ?? options[0].id;
            return (
              <button key={o.id} type="button" data-sfx="toggle" aria-pressed={current === o.id} onClick={() => setVariant(o.id)} className="gn-nav-link min-h-11 rounded-full border border-[var(--glass-border)] px-4 text-[var(--fog-dim)] aria-pressed:border-[var(--lime)] aria-pressed:text-[var(--fog)]">
                {o.label}
              </button>
            );
          })}
        </div>
      ) : null}
      <div {...attrs} className={cn("brand-surface rounded-[1.25rem] border border-[var(--b-border)] p-4 sm:p-6", brand === "commune" && "sk-dotted-bg")}>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <ButtonsBlock />
          <BadgesBlock />
          <NavBlock />
          <InputsBlock />
          <CardBlock />
          <TableBlock brand={brand} />
          <div className="lg:col-span-2 xl:col-span-3"><StatesBlock /></div>
        </div>
      </div>
    </div>
  );
}
