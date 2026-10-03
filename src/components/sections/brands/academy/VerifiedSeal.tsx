interface VerifiedSealProps {
  readonly size?: number;
  /** Optional accessible name. Decorative when omitted. */
  readonly label?: string;
  /** Paint the seal in a non-gold color. Used only to show a not-yet-verified state. */
  readonly muted?: boolean;
}

/** Seal with a check. Gold (--b-accent-3) is reserved for verified credentials, so this is the only gold glyph. */
export default function VerifiedSeal({ size = 32, label, muted = false }: VerifiedSealProps) {
  const stroke = muted ? "var(--b-muted)" : "var(--b-accent-3)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="shrink-0"
    >
      <circle cx="16" cy="16" r="13" stroke={stroke} strokeWidth="2.5" fill={muted ? "none" : "color-mix(in oklch, var(--b-accent-3) 18%, transparent)"} />
      <path d="M10.5 16.5l4 4 7-8" stroke={stroke} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
