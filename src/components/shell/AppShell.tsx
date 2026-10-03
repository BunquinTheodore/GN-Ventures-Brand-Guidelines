"use client";

import { useState, type ReactNode } from "react";
import { ToastHost } from "@/components/ui/Toast";
import BackToTop from "./BackToTop";
import ReadingProgress from "./ReadingProgress";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import { useScrollSpy } from "./useScrollSpy";

/**
 * Page frame: sticky left nav (lg+), mobile top bar with drawer, reading progress,
 * back to top, toast host, and the content column (max 1200px). Mounts the scroll-spy.
 */
export default function AppShell({ children }: { readonly children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  useScrollSpy();

  return (
    <div className="relative z-10 flex min-h-dvh">
      <ReadingProgress />
      <TopBar />
      <SideNav collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full min-w-0 max-w-[var(--content-max)] flex-1 px-4 pb-24 pt-[calc(var(--topbar-h)+1.5rem)] outline-none sm:px-6 lg:px-10 lg:pt-12"
      >
        {children}
      </main>
      <BackToTop />
      <ToastHost />
    </div>
  );
}
