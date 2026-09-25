import React from "react";
import { GuestHeader } from "@/components/layout/guest-header";
import { RouteProgress } from "@/components/layout/route-progress";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Route Progress Indicator */}
      <RouteProgress />
      {/* Guest Navigation Header */}
      <GuestHeader />

      {/* Main Guest Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {children}
      </main>
    </div>
  );
}
