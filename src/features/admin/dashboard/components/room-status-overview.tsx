"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { RoomStatusBreakdown } from "../types";

interface RoomStatusOverviewProps {
  roomStatus: RoomStatusBreakdown;
}

export function RoomStatusOverview({ roomStatus }: RoomStatusOverviewProps) {
  const total = roomStatus.total || 1;

  const statuses = [
    {
      key: "available",
      label: "Available",
      count: roomStatus.available,
      color: "bg-emerald-500",
      textColor: "text-emerald-700 dark:text-emerald-300",
      href: "/admin/rooms?status=available",
    },
    {
      key: "occupied",
      label: "Occupied",
      count: roomStatus.occupied,
      color: "bg-blue-500",
      textColor: "text-blue-700 dark:text-blue-300",
      href: "/admin/rooms?status=occupied",
    },
    {
      key: "reserved",
      label: "Reserved",
      count: roomStatus.reserved,
      color: "bg-amber-400",
      textColor: "text-amber-800 dark:text-amber-300",
      href: "/admin/rooms?status=reserved",
    },
    {
      key: "dirty",
      label: "Dirty",
      count: roomStatus.dirty,
      color: "bg-amber-600",
      textColor: "text-amber-900 dark:text-amber-200",
      href: "/admin/housekeeping",
    },
    {
      key: "cleaning",
      label: "Cleaning",
      count: roomStatus.cleaning,
      color: "bg-cyan-500",
      textColor: "text-cyan-700 dark:text-cyan-300",
      href: "/admin/housekeeping",
    },
    {
      key: "maintenance",
      label: "Maintenance",
      count: roomStatus.maintenance,
      color: "bg-destructive",
      textColor: "text-destructive",
      href: "/admin/rooms?status=maintenance",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-white/40 dark:border-white/10 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Room Status Overview
          </CardTitle>
          <p className="text-xs font-normal text-muted-foreground mt-0.5">
            Physical room inventory and cleanliness distribution
          </p>
        </div>
        <Link
          href="/admin/rooms"
          className={buttonVariants({
            variant: "glass",
            size: "icon-xs",
            className: "text-muted-foreground hover:text-foreground",
          })}
          title="View all rooms"
        >
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Status Distribution Progress Bar */}
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-black/5 dark:bg-white/5 border border-white/40 dark:border-white/10 p-0.5">
          {statuses.map((s) => {
            const percent = (s.count / total) * 100;
            if (percent === 0) return null;
            return (
              <div
                key={s.key}
                style={{ width: `${percent}%` }}
                className={`h-full ${s.color} first:rounded-l-full last:rounded-r-full transition-all`}
                title={`${s.label}: ${s.count} rooms (${Math.round(percent)}%)`}
              />
            );
          })}
        </div>

        {/* Status Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {statuses.map((s) => {
            const percent = Math.round((s.count / total) * 100);
            return (
              <Link
                key={s.key}
                href={s.href}
                className="p-2.5 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 transition-all dark:bg-white/[0.03] dark:border-white/10 block outline-none"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`size-2 rounded-full ${s.color}`} />
                  <span className="text-xs font-normal text-muted-foreground truncate">
                    {s.label}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-foreground">
                    {s.count}
                  </span>
                  <span className="text-[10px] font-normal text-muted-foreground">
                    {percent}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
