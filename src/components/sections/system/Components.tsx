import { SectionShell } from "@/components/ui";
import ComponentsKit from "./ComponentsKit";

export default function Components() {
  return (
    <SectionShell
      id="components"
      num="18"
      eyebrow="Components"
      title="The UI kit, live"
      lead={
        <p>
          Every piece below is a real component. Use the switcher to re-theme the whole kit per department through <code className="font-mono text-[0.9em] text-[var(--b-fg)]">data-brand</code>. Academy shows light and dark, Mazal shows its web and social channels, and Commune drops glass for its black and white sketchbook style.
        </p>
      }
    >
      <ComponentsKit />
    </SectionShell>
  );
}
