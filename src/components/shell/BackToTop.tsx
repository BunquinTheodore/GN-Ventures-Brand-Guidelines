"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 900;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      data-sfx="nav"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={toTop}
      className={cn(
        "gn-btn gn-btn-secondary gn-shine fixed bottom-5 right-4 z-40 h-12 w-12 min-h-0 overflow-hidden p-0 transition-opacity sm:right-6",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <span aria-hidden="true">&#8593;</span>
    </button>
  );
}
