"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardSummary } from "../types";

interface DashboardKPIsProps {
  summary: DashboardSummary;
}

export function DashboardKPIs({ summary }: DashboardKPIsProps) {
  const kpiItems = [
    {
      label: "Available Rooms",
      value: summary.availableRooms,
      subtext: "ready for check-in",
      href: "/admin/rooms?status=available",
      isPrimary: false,
    },
    {
      label: "Occupied Rooms",
      value: summary.occupiedRooms,
      subtext: "currently in-house",
      href: "/admin/rooms?status=occupied",
      isPrimary: false,
    },
    {
      label: "Reserved Rooms",
      value: summary.reservedRooms,
      subtext: "upcoming bookings",
      href: "/admin/rooms?status=reserved",
      isPrimary: false,
    },
    {
      label: "Dirty Rooms",
      value: summary.dirtyRooms,
      subtext: "cleaning queue",
      href: "/admin/housekeeping",
      isPrimary: false,
    },
    {
      label: "Today's Arrivals",
      value: summary.arrivalsToday,
      subtext: "expected check-ins",
      href: "/admin/frontdesk?stream=arrivals",
      isPrimary: true,
    },
    {
      label: "Today's Departures",
      value: summary.departuresToday,
      subtext: "due check-outs",
      href: "/admin/frontdesk?stream=departures",
      isPrimary: false,
    },
    {
      label: "Today's Revenue",
      value: `$${summary.todayRevenue.toLocaleString()}`,
      subtext: "active room folios",
      href: "/admin/payments",
      isPrimary: true,
    },
    {
      label: "Outstanding Balance",
      value: `$${summary.outstandingBalance.toLocaleString()}`,
      subtext: "pending settlement",
      href: "/admin/payments",
      isPrimary: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
      {kpiItems.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className="group/kpi outline-none block"
        >
          <Card className="p-3 transition-all duration-200 group-hover/kpi:border-primary/50 group-hover/kpi:bg-white/60 dark:group-hover/kpi:bg-white/[0.08]">
            <CardContent className="p-0 space-y-1">
              <p className="text-xs font-normal text-muted-foreground truncate">
                {item.label}
              </p>
              <div className="flex flex-col">
                <span
                  className={`text-base font-bold ${
                    item.isPrimary ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.value}
                </span>
                <span className="text-[10px] sm:text-xs font-normal text-muted-foreground truncate">
                  {item.subtext}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
