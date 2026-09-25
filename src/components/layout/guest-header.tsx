"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Hotel,
  Menu,
  Ticket,
  PhoneCall,
  BedDouble,
  Compass,
  ArrowRight,
  Send,
  ExternalLink,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const guestNavLinks = [
  { title: "Home & Search", href: "/", icon: Compass },
  { title: "Rooms & Rates", href: "/rooms", icon: BedDouble },
  { title: "My Booking", href: "/my-booking", icon: Ticket },
];

export function GuestHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Mobile Sheet Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile Navigation Drawer */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden size-9"
                  aria-label="Toggle menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-4 w-72 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Brand inside drawer */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                  <div className="size-8 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md">
                    <Hotel className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold tracking-tight text-base leading-tight">
                      SrokHotel
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Boutique & Resort
                    </span>
                  </div>
                </div>

                {/* Mobile Links */}
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
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="size-4" />
                          <span>{link.title}</span>
                        </div>
                        <ArrowRight className="size-3.5 opacity-60" />
                      </Link>
                    );
                  })}
                </nav>

                <Separator />

                {/* Direct Contact in mobile drawer */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="font-semibold text-foreground">Need Assistance?</div>
                  <div className="flex flex-col gap-1.5">
                    <a
                      href="tel:+85512345678"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-foreground transition-colors"
                    >
                      <PhoneCall className="size-3.5 text-emerald-500" />
                      <span>+855 12 345 678</span>
                    </a>
                    <a
                      href="https://t.me"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-foreground transition-colors"
                    >
                      <Send className="size-3.5 text-sky-500" />
                      <span>Chat on Telegram</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Link to Admin Portal */}
              <div className="pt-4 border-t border-border">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Switch to Admin PMS</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Brand */}
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-lg">
            <div className="size-8 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-md">
              <Hotel className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">SrokHotel</span>
              <span className="text-[10px] text-muted-foreground font-normal hidden sm:inline-block">
                Boutique Hotel & Resort
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links on Desktop (Full Width Site Layout) */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-srok transition-colors ${
              pathname === "/"
                ? "bg-muted text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/rooms"
            className={`px-3 py-1.5 rounded-srok transition-colors ${
              pathname?.startsWith("/rooms")
                ? "bg-muted text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Rooms & Rates
          </Link>
          <Link
            href="/my-booking"
            className={`px-3 py-1.5 rounded-srok transition-colors ${
              pathname?.startsWith("/my-booking")
                ? "bg-muted text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Booking
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <a
            href="tel:+85512345678"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
            })}
          >
            <PhoneCall className="size-3.5 text-emerald-500" />
            <span>+855 12 345 678</span>
          </a>

          <Link
            href="/my-booking"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "hidden sm:flex items-center gap-1.5 text-xs",
            })}
          >
            <Ticket className="size-3.5" />
            <span>Find Booking</span>
          </Link>

          <Link
            href="/rooms"
            className={buttonVariants({
              size: "sm",
              className: "h-9 px-3.5 text-xs font-semibold shadow-sm",
            })}
          >
            <BedDouble className="size-3.5 mr-1.5" />
            <span>Book a Room</span>
          </Link>

          {/* Quick Admin PMS Switcher on desktop */}
          <Link
            href="/admin/dashboard"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "hidden xl:flex text-xs text-muted-foreground hover:text-foreground",
            })}
          >
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
