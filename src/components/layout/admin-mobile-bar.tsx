"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ConciergeBell,
  CalendarDays,
  BedDouble,
  LayoutGrid,
} from "lucide-react";

const bottomTabs = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Calendar", href: "/admin/calendar", icon: CalendarDays },
  { title: "Front Desk", href: "/admin/frontdesk", icon: ConciergeBell },
  { title: "Rooms", href: "/admin/rooms", icon: BedDouble },
];

export function AdminMobileBar() {
  const pathname = usePathname();
  const isMenuActive = pathname === "/admin/menu";

  return (
    /* Outer positioner — fixed, bottom-centered, no background, no border */
    <div
      className="lg:hidden fixed bottom-5 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
      aria-label="Mobile bottom navigation"
    >
      {/* Floating glass pill */}
      <nav
        className="pointer-events-auto flex items-center gap-1 px-3 py-2 rounded-full
          bg-background/55 backdrop-blur-2xl
          border border-white/65 dark:border-white/15
          shadow-[0_8px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.10),inset_0_1px_1px_rgba(255,255,255,0.7)]
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.08)]"
      >
        {/* Core nav tabs */}
        {bottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href || pathname?.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-full text-[10px] font-bold transition-all ${
                isActive
                  ? "bg-primary/15 border border-primary/30 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8"
              }`}
            >
              <Icon
                className={`size-5 transition-transform ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span className="leading-none whitespace-nowrap">{tab.title}</span>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px h-6 bg-border/60 mx-1 shrink-0" />

        {/* Menu button */}
        <Link
          href="/admin/menu"
          aria-label="Open full menu"
          className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-full text-[10px] font-bold transition-all ${
            isMenuActive
              ? "bg-primary/15 border border-primary/30 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
              : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8"
          }`}
        >
          <LayoutGrid
            className={`size-5 transition-transform ${
              isMenuActive ? "scale-110" : ""
            }`}
          />
          <span className="leading-none">Menu</span>
        </Link>
      </nav>
    </div>
  );
}
