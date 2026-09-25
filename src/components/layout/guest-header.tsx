"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Hotel,
  Menu,
  X,
  Ticket,
  PhoneCall,
  BedDouble,
  Compass,
  ArrowRight,
  Send,
  ExternalLink,
} from "lucide-react";

const guestNavLinks = [
  {
    title: "Home & Search",
    href: "/",
    icon: Compass,
    description: "Explore hotel & dates",
  },
  {
    title: "Rooms & Rates",
    href: "/rooms",
    icon: BedDouble,
    description: "All suites & availability",
  },
  {
    title: "My Booking",
    href: "/my-booking",
    icon: Ticket,
    description: "Find & manage reservation",
  },
];

export function GuestHeader() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-2xl"
    >
      <div className="w-full max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        {/* Left: Brand Logo & Title */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 shrink-0"
        >
          <div className="size-8 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md">
            <Hotel className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg leading-tight font-bold tracking-tight">
              SrokHotel
            </span>
            <span className="text-[10px] text-muted-foreground font-normal hidden sm:inline-block leading-none">
              Boutique Hotel & Resort
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {guestNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Right: Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="tel:+85512345678"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <PhoneCall className="size-3.5 text-emerald-500" />
            <span>+855 12 345 678</span>
          </a>

          <Link
            href="/my-booking"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border/80 bg-background/60 hover:bg-muted/80 text-foreground transition-colors"
          >
            <Ticket className="size-3.5 text-muted-foreground" />
            <span>Find Booking</span>
          </Link>

          <Link
            href="/rooms"
            className="flex items-center gap-1.5 h-8.5 px-4 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all active:scale-[0.98]"
          >
            <BedDouble className="size-3.5" />
            <span>Book a Room</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors hidden xl:inline-flex"
            title="Switch to PMS Admin"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Right Controls: Compact Book Button + Dropdown Toggle */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <Link
            href="/rooms"
            className="flex items-center gap-1 h-8 px-3 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-colors shrink-0"
          >
            <BedDouble className="size-3.5" />
            <span>Book</span>
          </Link>

          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-label="Toggle navigation menu"
            className="size-8.5 rounded-full border border-border/80 bg-card/80 hover:bg-muted/80 flex items-center justify-center text-foreground transition-colors shrink-0 active:scale-95"
          >
            {dropdownOpen ? (
              <X className="size-4.5 transition-transform duration-150 rotate-90" />
            ) : (
              <Menu className="size-4.5 transition-transform duration-150" />
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE SLICK DROPDOWN (No Sidebar Drawer) ───────────────────────── */}
      {dropdownOpen && (
        <>
          {/* Backdrop Blur Overlay for closing outside */}
          <div
            className="fixed inset-0 top-14 bg-black/30 backdrop-blur-xs z-40 md:hidden animate-in fade-in-0 duration-150"
            onClick={() => setDropdownOpen(false)}
            aria-hidden="true"
          />

          {/* Floating Dropdown Card */}
          <div className="absolute top-14 left-0 right-0 z-50 p-3 pt-2 md:hidden">
            <div className="rounded-2xl border-2 border-primary/35 dark:border-primary/45 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl p-3 shadow-[0_20px_50px_rgba(56,148,224,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(56,189,248,0.25)] space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-150">
              {/* Navigation Links */}
              <nav className="space-y-1">
                {guestNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-foreground hover:bg-muted/70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-8 rounded-lg flex items-center justify-center ${
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-semibold leading-tight">
                            {link.title}
                          </span>
                          <span
                            className={`text-[11px] ${
                              isActive
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            }`}
                          >
                            {link.description}
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        className={`size-4 ${
                          isActive
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>

              {/* Direct Help & Contact Quick Actions */}
              <div className="pt-2 border-t border-border/60">
                <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Guest Assistance
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+85512345678"
                    className="flex items-center gap-2 p-2 rounded-xl border border-border/70 hover:bg-muted/60 text-xs font-medium transition-colors"
                  >
                    <PhoneCall className="size-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">Call Hotel</span>
                  </a>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl border border-border/70 hover:bg-muted/60 text-xs font-medium transition-colors"
                  >
                    <Send className="size-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">Telegram</span>
                  </a>
                </div>
              </div>

              {/* Quick switch to Admin PMS */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between px-1">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3" />
                  <span>Switch to Hotel PMS (Staff)</span>
                </Link>
                <span className="text-[10px] text-muted-foreground">v1.0</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
