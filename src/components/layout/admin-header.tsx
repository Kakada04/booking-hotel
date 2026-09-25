"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Plus,
  Calendar,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSidebar } from "./admin-sidebar";
import { useNavModeContext } from "@/context/nav-mode-context";

const pageTitles: Record<string, { title: string; shortTitle: string; subtitle: string }> = {
  "/admin": { title: "Admin Portal", shortTitle: "Admin", subtitle: "Overview" },
  "/admin/dashboard": { title: "Dashboard", shortTitle: "Dashboard", subtitle: "Real-time hotel statistics" },
  "/admin/calendar": { title: "Calendar", shortTitle: "Calendar", subtitle: "Room availability & reservations grid" },
  "/admin/bookings": { title: "Bookings", shortTitle: "Bookings", subtitle: "Manage all guest bookings" },
  "/admin/bookings/create": { title: "New Booking", shortTitle: "New Booking", subtitle: "Create booking (Full Page)" },
  "/admin/frontdesk": { title: "Front Desk", shortTitle: "Front Desk", subtitle: "Arrivals, In-House, and Departures" },
  "/admin/frontdesk/walk-in": { title: "Walk-In", shortTitle: "Walk-In", subtitle: "Direct arrival registration (Full Page)" },
  "/admin/rooms": { title: "Rooms", shortTitle: "Rooms", subtitle: "Status & physical room details" },
  "/admin/rooms/create": { title: "New Room", shortTitle: "New Room", subtitle: "Add physical room unit (Full Page)" },
  "/admin/housekeeping": { title: "Housekeeping", shortTitle: "Housekeeping", subtitle: "Cleaning queues & room inspection" },
  "/admin/payments": { title: "Payments", shortTitle: "Payments", subtitle: "Cash, KHQR, ABA & balance ledger" },
  "/admin/payments/create": { title: "New Payment", shortTitle: "New Payment", subtitle: "Collect transaction (Full Page)" },
  "/admin/guests": { title: "Guests", shortTitle: "Guests", subtitle: "Profiles, passports & stay records" },
  "/admin/guests/create": { title: "New Guest", shortTitle: "New Guest", subtitle: "Create guest profile (Full Page)" },
  "/admin/settings": { title: "Settings", shortTitle: "Settings", subtitle: "Hotel policy & configuration" },
  "/admin/settings/room-types": { title: "Room Types", shortTitle: "Types", subtitle: "Pricing & capacity tiers" },
  "/admin/settings/room-types/create": { title: "New Room Type", shortTitle: "New Type", subtitle: "Add category (Full Page)" },
  "/admin/settings/payment-rules": { title: "Payment Rules", shortTitle: "Policies", subtitle: "Deposit rules & KHQR settings" },
  "/admin/settings/staff": { title: "Staff", shortTitle: "Staff", subtitle: "Roles & permissions" },
  "/admin/menu": { title: "Menu", shortTitle: "Menu", subtitle: "All modules & quick actions" },
};

export function AdminHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode } = useNavModeContext();

  // Match title with short words
  const currentInfo =
    pageTitles[pathname] ||
    (pathname?.includes("/bookings/")
      ? { title: "Booking Details", shortTitle: "Booking", subtitle: "Reservation record" }
      : pathname?.includes("/rooms/")
      ? { title: "Room Details", shortTitle: "Room", subtitle: "Inventory management" }
      : pathname?.includes("/frontdesk/")
      ? { title: "Stay & Folio", shortTitle: "Stay", subtitle: "Stay & billing record" }
      : pathname?.includes("/guests/")
      ? { title: "Guest Details", shortTitle: "Guest", subtitle: "Customer history" }
      : { title: "SrokHotel PMS", shortTitle: "SrokHotel", subtitle: "Hotel Operations" });

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 gap-2">
        {/* Left: Mobile trigger & Short Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Sidebar sheet trigger — hidden on mobile in bottombar mode; shown on all mobile in sidebar mode */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={`lg:hidden size-8.5 shrink-0 ${mode === "sidebar" ? "flex" : "hidden sm:flex"}`}
                  aria-label="Toggle menu"
                />
              }
            >
              <Menu className="size-4.5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-72 max-w-[85vw] border-r border-border bg-background"
              showCloseButton={false}
            >
              <AdminSidebar onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground leading-none truncate">
              <span className="sm:hidden">{currentInfo.shortTitle}</span>
              <span className="hidden sm:inline">{currentInfo.title}</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block truncate mt-0.5 font-normal">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Operational Status & Actions (Always strictly right-aligned on single row) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Today's Date Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-background text-xs text-muted-foreground font-normal border border-border shadow-xs">
            <Calendar className="size-3.5 text-primary" />
            <span>{todayStr}</span>
          </div>

          {/* Quick Metrics Badges */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/admin/frontdesk"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 backdrop-blur-md border border-emerald-500/30 text-xs font-bold transition-all dark:bg-emerald-500/20 dark:border-emerald-500/35"
            >
              <LogIn className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>Arrivals: 3</span>
            </Link>
            <Link
              href="/admin/frontdesk"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-200 backdrop-blur-md border border-amber-500/30 text-xs font-bold transition-all dark:bg-amber-500/20 dark:border-amber-500/35"
            >
              <LogOut className="size-3 text-amber-600 dark:text-amber-400" />
              <span>Departures: 2</span>
            </Link>
          </div>

          {/* Direct Full Page Action Button */}
          <Link
            href="/admin/frontdesk/walk-in"
            className={buttonVariants({
              size: "sm",
              variant: "primary-glass",
              className: "h-8 text-xs font-bold gap-1.5 hidden sm:flex",
            })}
          >
            <Plus className="size-3.5" />
            <span>Walk-In</span>
          </Link>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="glass"
                  size="icon-sm"
                  className="relative text-foreground"
                  aria-label="Notifications"
                />
              }
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive animate-pulse" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="flex justify-between items-center text-xs font-bold">
                <span>Operational Alerts</span>
                <Badge variant="secondary" className="text-xs font-bold">2 New</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-2 text-xs cursor-pointer">
                <span className="font-bold text-foreground">Room 102 Dirty</span>
                <span className="text-xs font-normal text-muted-foreground">Guest checked out at 10:20 AM. Ready for cleaning.</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-2 text-xs cursor-pointer">
                <span className="font-bold text-foreground">Upcoming Arrival</span>
                <span className="text-xs font-normal text-muted-foreground">Sokha Dara (Room 201) expected around 2:00 PM.</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/admin/housekeeping" />}
                className="p-2 text-center text-xs text-primary font-bold cursor-pointer"
              >
                View Housekeeping Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="glass"
                  size="icon-sm"
                  className="rounded-full text-foreground"
                  aria-label="User profile"
                />
              }
            >
              <User className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs">
                <div className="font-bold text-foreground">Reception Staff</div>
                <div className="text-xs text-muted-foreground font-normal">reception@srokhotel.com</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/admin/settings" />}
                className="text-xs font-normal cursor-pointer"
              >
                System Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/" />}
                className="text-xs font-normal cursor-pointer"
              >
                Open Guest Website
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
