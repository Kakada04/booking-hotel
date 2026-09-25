"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Hotel,
  ArrowUpRight,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

interface AdminSidebarProps {
  onClose?: () => void;
}

const navSections = [
  {
    title: "Operations",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        title: "Calendar",
        href: "/admin/calendar",
        icon: CalendarDays,
        badge: "Timeline",
      },
      {
        title: "Front Desk",
        href: "/admin/frontdesk",
        icon: ConciergeBell,
        badge: "Live",
      },
      {
        title: "Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck,
        badge: null,
      },
    ],
  },
  {
    title: "Property & Inventory",
    items: [
      {
        title: "Rooms",
        href: "/admin/rooms",
        icon: BedDouble,
        badge: null,
      },
      {
        title: "Housekeeping",
        href: "/admin/housekeeping",
        icon: Sparkles,
        badge: "Clean/Dirty",
      },
    ],
  },
  {
    title: "Finance & CRM",
    items: [
      {
        title: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
        badge: "KHQR/Cash",
      },
      {
        title: "Guests CRM",
        href: "/admin/guests",
        icon: Users,
        badge: null,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        badge: null,
      },
    ],
  },
];

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-full lg:w-64 border-r border-border bg-background/80 backdrop-blur-xl flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border">
        <Link
          href="/admin/dashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-3"
        >
          <div className="size-9 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md">
            <Hotel className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-base leading-tight">
              SrokHotel
            </span>
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              PMS Console
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Quick Action Buttons (Direct Full Pages - No Modals) */}
      <div className="p-3 pb-1 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/admin/frontdesk/walk-in"
            onClick={handleLinkClick}
            className={buttonVariants({
              size: "sm",
              variant: "default",
              className: "h-8 text-xs font-semibold gap-1 justify-center px-2",
            })}
          >
            <Plus className="size-3.5" />
            <span>Walk-In</span>
          </Link>

          <Link
            href="/admin/bookings/create"
            onClick={handleLinkClick}
            className={buttonVariants({
              size: "sm",
              variant: "outline",
              className: "h-8 text-xs font-semibold gap-1 justify-center px-2",
            })}
          >
            <Plus className="size-3.5" />
            <span>Booking</span>
          </Link>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {section.title}
            </div>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between px-3 py-2 rounded-[14px] text-xs font-medium transition-all ${
                      isActive
                        ? "bg-primary/20 text-sky-950 dark:text-sky-100 border border-primary/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant={isActive ? "secondary" : "outline"}
                        className="text-[9px] px-1.5 py-0 font-normal leading-tight"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer info: Staff & Public Site */}
      <div className="p-3 border-t border-border bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
        <div className="flex items-center justify-between px-2 py-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
              FD
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground leading-tight text-xs">
                Front Desk
              </span>
              <span className="text-[10px] text-muted-foreground">
                Morning Shift
              </span>
            </div>
          </div>
          <Badge variant="available" className="text-[10px]">
            Active
          </Badge>
        </div>

        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center justify-between p-2 rounded-[14px] border border-border bg-background/50 hover:bg-background text-xs font-medium text-muted-foreground hover:text-foreground transition-all shadow-xs"
        >
          <span>View Guest Website</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
