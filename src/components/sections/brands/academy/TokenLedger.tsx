import { Badge, CopyChip } from "@/components/ui";
import { Card } from "../parts/shared";
import Block from "./Block";
import { ACADEMY_TOKENS, type AcademyToken, type TokenSide } from "./tokens";

function SideView({ label, side }: { readonly label: string; readonly side?: TokenSide }) {
  if (!side) {
    return (
      <div className="space-y-2">
        <p className="font-ui text-[0.75rem] uppercase tracking-[0.12em] text-[var(--b-muted)]">{label}</p>
        <div className="flex h-14 items-center justify-center rounded-[var(--b-radius)] border border-dashed border-[var(--b-border)]">
          <Badge tone="neutral">TBC</Badge>
        </div>
      </div>
    );
  }
  const shown = side.exact ? side.hex : `\u2248 ${side.hex}`;
  return (
    <div className="space-y-2">
      <p className="font-ui text-[0.75rem] uppercase tracking-[0.12em] text-[var(--b-muted)]">{label}</p>
      <div
        role="img"
        aria-label={`${label} swatch ${side.css}`}
        className="h-14 rounded-[var(--b-radius)] border border-[var(--b-border)]"
        style={{ background: side.css }}
      />
      <CopyChip value={shown} copyValue={side.css} label={`Copy ${side.css}`} />
      {side.exact ? null : <p className="break-all font-mono text-[0.75rem] text-[var(--b-muted)]">{side.css}</p>}
    </div>
  );
}

function TokenCard({ token }: { readonly token: AcademyToken }) {
  return (
    <Card brand="academy" glass zoom className="flex flex-col gap-4">
      <div>
        <p className="font-ui text-[0.9375rem] font-semibold text-[var(--b-fg)]">{token.name}</p>
        <p className="text-[0.8125rem] leading-snug text-[var(--b-muted)]">{token.role}</p>
      </div>
      {token.shared ? (
        <SideView label="Both themes" side={token.shared} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <SideView label="Light" side={token.light} />
          <SideView label="Dark" side={token.dark} />
        </div>
      )}
    </Card>
  );
}

/** Every Academy token, light and dark side by side. Hex is approximate, the copy value is the exact oklch string. */
export default function TokenLedger() {
  return (
    <Block
      title="Token ledger, light and dark"
      lead="Academy writes its tokens in oklch. The hex shown is an approximation for tools that cannot read oklch. Clicking a chip copies the exact oklch string."
    >
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ACADEMY_TOKENS.map((t) => (
          <li key={t.name} className="flex">
            <div className="flex w-full">
              <TokenCard token={t} />
            </div>
          </li>
        ))}
      </ul>
    </Block>
  );
}
