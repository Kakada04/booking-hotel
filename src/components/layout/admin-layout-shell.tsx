"use client";

import React from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminMobileBar } from "@/components/layout/admin-mobile-bar";
import { RouteProgress } from "@/components/layout/route-progress";
import { NavModeProvider, useNavModeContext } from "@/context/nav-mode-context";

/** Inner shell — reads context, must live inside NavModeProvider */
function LayoutShellInner({ children }: { children: React.ReactNode }) {
  const { mode, mounted } = useNavModeContext();
  const isSidebarMode = mounted && mode === "sidebar";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <RouteProgress />

      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        <AdminSidebar />
      </div>

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${
            isSidebarMode ? "pb-8" : "pb-28 lg:pb-8"
          }`}
        >
          {children}
        </main>
      </div>

      {/* Bottom bar — only in bottombar mode on mobile */}
      {(!mounted || mode === "bottombar") && <AdminMobileBar />}
    </div>
  );
}

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <NavModeProvider>
      <LayoutShellInner>{children}</LayoutShellInner>
    </NavModeProvider>
  );
}

