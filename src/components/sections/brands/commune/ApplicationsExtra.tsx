import { BRANDS } from "@/content/brands";
import { cn } from "@/lib/utils";
import { Doodle } from "./doodles";
import { Eyebrow, FONT, Panel, PlaceholderStamp, SketchHeading } from "./ui";

const OCCASIONS: readonly string[] = ["Wedding", "Office", "Birthday"];
const MENU_ROWS: readonly number[] = [1, 2, 3, 4];

function Checkbox() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-[var(--b-fg)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 4 Q10 2.5 17 4 Q18 10 17 17 Q10 18.5 3 17 Q2 10 3 4 Z" />
    </svg>
  );
}

function Field({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="flex items-end gap-3">
      <span className={cn("shrink-0 text-xs uppercase tracking-[0.12em] text-[var(--b-muted)]", FONT.mono)}>{label}</span>
      <span className="h-0 grow border-b-2 border-dotted border-[var(--b-line-strong)]" aria-hidden="true" />
      <span className={cn("text-xl text-[var(--b-fg)]", FONT.hand)}>{value}</span>
    </div>
  );
}

function Ticket() {
  return (
    <Panel title="Booking ticket | mock" rotate={-1} className="h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className={cn("text-3xl text-[var(--b-fg)]", FONT.word)}>GN Commune</p>
          <Doodle name="cart" className="h-14 w-14" />
        </div>
        <hr className="sk-dashed" />
        <ul className="space-y-2">
          {OCCASIONS.map((o) => (
            <li key={o} className="flex items-center gap-3 text-base text-[var(--b-fg)]">
              <Checkbox />
              {o}
            </li>
          ))}
        </ul>
        <Field label="Date" value="TBC" />
        <Field label="Place" value="Metro Manila" />
        <Field label="Guests" value="TBC" />
        <hr className="sk-dotted" />
        <p className={cn("text-xl text-[var(--b-muted)]", FONT.hand)}>booking details are placeholders</p>
      </div>
    </Panel>
  );
}

function MenuBoard() {
  return (
    <Panel title="Menu board | mock" rotate={1} className="h-full">
      <div className="space-y-4">
        <p className={cn("text-4xl text-[var(--b-fg)]", FONT.hand)}>menu</p>
        <ul className="space-y-3">
          {MENU_ROWS.map((n) => (
            <li key={n} className="flex items-end gap-2 text-base text-[var(--b-fg)]">
              <span>Item {n} TBC</span>
              <span aria-hidden="true" className="h-0 grow border-b-2 border-dotted border-[var(--b-line-strong)]" />
              <span className={cn("text-sm text-[var(--b-muted)]", FONT.mono)}>Price TBC</span>
            </li>
          ))}
        </ul>
        <p className="text-base leading-relaxed text-[var(--b-muted)]">No menu or prices exist yet. Nothing here is a real offer.</p>
      </div>
    </Panel>
  );
}

function SocialSquare() {
  return (
    <Panel title="Social square | mock" rotate={-1} className="h-full">
      <div className="sk-dotted-bg sk-ink flex aspect-square flex-col justify-between rounded-[6px] p-5">
        <Eyebrow>GN Commune | Metro Manila</Eyebrow>
        <div className="space-y-3">
          <p className={cn("text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] text-[var(--b-fg)]", FONT.display)}>
            {BRANDS.commune.tagline}
          </p>
          <Doodle name="cup" label="Coffee cup with steam" className="h-16 w-16" />
        </div>
      </div>
    </Panel>
  );
}

/** Applications: a booking ticket, a menu board and a social square. All copy is placeholder. */
export default function ApplicationsExtra() {
  return (
    <div className="space-y-4">
      <SketchHeading>Sketchbook mocks</SketchHeading>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Ticket />
        <MenuBoard />
        <SocialSquare />
      </div>
      <PlaceholderStamp />
    </div>
  );
}
