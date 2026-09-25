import React from "react";
import { GuestHeader } from "@/components/layout/guest-header";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Guest Navigation Header */}
      <GuestHeader />

      {/* Main Full-Width Guest Content (NO Sidebar, NO Footer) */}
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
