"use client";

import React from "react";
import Link from "next/link";
import { Plus, UserCheck, CreditCard, CalendarPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function DashboardQuickActions() {
  const actions = [
    {
      label: "New Booking",
      href: "/admin/bookings/create",
      icon: CalendarPlus,
      variant: "primary-glass" as const,
    },
    {
      label: "Walk-in Check-in",
      href: "/admin/frontdesk/walk-in",
      icon: Plus,
      variant: "primary-glass" as const,
    },
    {
      label: "Arrivals Check-in",
      href: "/admin/frontdesk?stream=arrivals",
      icon: UserCheck,
      variant: "glass" as const,
    },
    {
      label: "Record Payment",
      href: "/admin/payments/create",
      icon: CreditCard,
      variant: "glass" as const,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <Link
            key={idx}
            href={act.href}
            className={buttonVariants({
              variant: act.variant,
              size: "sm",
              className: "gap-1.5 text-xs font-bold shrink-0",
            })}
          >
            <Icon className="size-3.5" />
            <span>{act.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
