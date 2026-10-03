import Badge from "./Badge";

interface DerivedTagProps {
  /** "derived" (default) for traced or generated files, "original" for owner-supplied files. */
  readonly kind?: "derived" | "original";
  readonly note?: string;
  readonly className?: string;
}

/** Marks an asset as derived (never official) or original. */
export default function DerivedTag({ kind = "derived", note, className }: DerivedTagProps) {
  const derived = kind === "derived";
  return (
    <Badge
      tone={derived ? "amber" : "accent"}
      className={className}
      title={note ?? (derived ? "Derived file, not an official original" : "Original file")}
    >
      {derived ? "Derived" : "Original"}
    </Badge>
  );
}
