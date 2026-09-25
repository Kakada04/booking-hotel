"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  ConciergeBell,
  BedDouble,
  Sparkles,
  CreditCard,
  Users,
  Settings,
  Plus,
  ArrowUpRight,
  UserPlus,
  LayoutList,
  Hotel,
  DoorOpen,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Menu data — same groups as the sidebar, plus quick actions
   ───────────────────────────────────────────────────────── */
const menuGroups = [
  {
    group: "Operations",
    color: "sky",
    items: [
      {
        title: "Dashboard",
        subtitle: "Real-time hotel overview",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Calendar",
        subtitle: "Timeline booking grid",
        href: "/admin/calendar",
        icon: CalendarDays,
        badge: "Timeline",
      },
      {
        title: "Front Desk",
        subtitle: "Arrivals, in-house & departures",
        href: "/admin/frontdesk",
        icon: ConciergeBell,
        badge: "Live",
      },
      {
        title: "Bookings",
        subtitle: "All reservation records",
        href: "/admin/bookings",
        icon: CalendarCheck,
      },
    ],
  },
  {
    group: "Property & Inventory",
    color: "violet",
    items: [
      {
        title: "Rooms",
        subtitle: "Room status & details",
        href: "/admin/rooms",
        icon: BedDouble,
      },
      {
        title: "Housekeeping",
        subtitle: "Cleaning queues & inspection",
        href: "/admin/housekeeping",
        icon: Sparkles,
        badge: "Clean/Dirty",
      },
    ],
  },
  {
    group: "Finance & CRM",
    color: "amber",
    items: [
      {
        title: "Payments",
        subtitle: "Cash, KHQR & ABA ledger",
        href: "/admin/payments",
        icon: CreditCard,
        badge: "KHQR",
      },
      {
        title: "Guests CRM",
        subtitle: "Profiles & stay history",
        href: "/admin/guests",
        icon: Users,
      },
    ],
  },
  {
    group: "System",
    color: "slate",
    items: [
      {
        title: "Settings",
        subtitle: "Hotel policy & configuration",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Room Types",
        subtitle: "Pricing & capacity tiers",
        href: "/admin/settings/room-types",
        icon: LayoutList,
      },
      {
        title: "Staff",
        subtitle: "Roles & permissions",
        href: "/admin/settings/staff",
        icon: Hotel,
      },
    ],
  },
];

const quickActions = [
  {
    title: "Walk-In",
    subtitle: "Direct arrival",
    href: "/admin/frontdesk/walk-in",
    icon: DoorOpen,
  },
  {
    title: "New Booking",
    subtitle: "Create reservation",
    href: "/admin/bookings/create",
    icon: Plus,
  },
  {
    title: "New Guest",
    subtitle: "Register profile",
    href: "/admin/guests/create",
    icon: UserPlus,
  },
  {
    title: "New Payment",
    subtitle: "Collect transaction",
    href: "/admin/payments/create",
    icon: CreditCard,
  },
];

/* ─────────────────────────────────────────────────────────
   Color helpers — kept to ≤ 3 colors per card (AGENTS rule)
   ───────────────────────────────────────────────────────── */
const badgeColors: Record<string, string> = {
  Timeline: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/25",
  Live: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  "Clean/Dirty":
    "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/25",
  KHQR: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
};

export function AdminMenuView() {
  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      {/* ── Quick Actions ── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3 px-0.5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex flex-col items-start gap-3 p-4 rounded-[18px] bg-primary/8 dark:bg-primary/12 border border-primary/20 backdrop-blur-xl hover:bg-primary/15 hover:border-primary/35 hover:shadow-lg transition-all"
              >
                <div className="size-9 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md">
                  <Icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-normal mt-0.5">
                    {action.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Navigation Groups ── */}
      {menuGroups.map((group) => (
        <section key={group.group}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-3 px-0.5">
            {group.group}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between p-4 rounded-[18px] bg-background/60 dark:bg-white/4 border border-white/65 dark:border-white/10 backdrop-blur-xl hover:bg-background/90 hover:border-white/80 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-2xl bg-black/5 dark:bg-white/8 border border-border flex items-center justify-center shrink-0">
                      <Icon className="size-4.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground leading-tight truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-normal mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          badgeColors[item.badge] ?? "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ArrowUpRight className="size-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
