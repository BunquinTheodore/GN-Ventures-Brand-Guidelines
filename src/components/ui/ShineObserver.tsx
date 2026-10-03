"use client";

import { useShineVisibility } from "@/lib/useShineVisibility";

/**
 * Renders nothing. Starts the shared shine visibility observer (idempotent).
 * GlowCard mounts it automatically; the integrator may also mount it once in the
 * app shell or layout, which is harmless.
 */
export default function ShineObserver() {
  useShineVisibility();
  return null;
}
