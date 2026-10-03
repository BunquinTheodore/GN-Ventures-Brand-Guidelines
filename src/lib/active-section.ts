import { findSection } from "@/content/nav";
import type { BrandId } from "@/content/types";

type Listener = (id: string) => void;

const FIRST_SECTION = "essence";

let current = FIRST_SECTION;
const listeners = new Set<Listener>();

/** Tiny external store for the scroll-spy section id. Safe on the server (no DOM access). */
export const activeSection = {
  get(): string {
    return current;
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  set(id: string): void {
    if (id === current) return;
    current = id;
    listeners.forEach((fn) => fn(id));
  },
};

/** Which brand a section belongs to (drives tinting). Unknown ids fall back to the umbrella. */
export function brandForSection(id: string): BrandId {
  return findSection(id)?.brand ?? "ventures";
}
