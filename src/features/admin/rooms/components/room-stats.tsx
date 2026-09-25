"use client";

import React from "react";
import {
  BedDouble,
  CheckCircle2,
  UserCheck,
  CalendarCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { RoomStats } from "../types";

interface RoomStatsProps {
  stats: RoomStats;
  activeStatusFilter?: string;
  onSelectStatus?: (status: string) => void;
}

export function RoomStatsCards({
  stats,
  activeStatusFilter = "all",
  onSelectStatus,
}: RoomStatsProps) {
  const statItems: Array<{
    id: string;
    label: string;
    value: number;
    subtext: string;
    icon: React.ElementType;
    badgeBg: string;
    iconBorder: string;
  }> = [
    {
      id: "all",
      label: "Total Rooms",
      value: stats.total,
      subtext: `${stats.occupancyRate}% Occupied`,
      icon: BedDouble,
      badgeBg: "bg-primary/20 text-primary",
      iconBorder: "border-primary/30",
    },
    {
      id: "available",
      label: "Ready to Sell",
      value: stats.available,
      subtext: "Vacant & Clean",
      icon: CheckCircle2,
      badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
      iconBorder: "border-emerald-500/30",
    },
    {
      id: "occupied",
      label: "Occupied",
      value: stats.occupied,
      subtext: "In-House Guests",
      icon: UserCheck,
      badgeBg: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
      iconBorder: "border-blue-500/30",
    },
    {
      id: "reserved",
      label: "Reserved",
      value: stats.reserved,
      subtext: "Arriving Today",
      icon: CalendarCheck,
      badgeBg: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
      iconBorder: "border-purple-500/30",
    },
    {
      id: "dirty",
      label: "Housekeeping",
      value: stats.dirty,
      subtext: `${stats.cleaning} In Progress`,
      icon: Sparkles,
      badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
      iconBorder: "border-amber-500/30",
    },
    {
      id: "maintenance",
      label: "Out of Order",
      value: stats.maintenance,
      subtext: "Repairs / Blocked",
      icon: Wrench,
      badgeBg: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
      iconBorder: "border-rose-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isSelected = activeStatusFilter === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectStatus?.(item.id)}
            className={`group w-full text-left outline-none rounded-[14px] p-2 sm:p-2.5 transition-all duration-200 backdrop-blur-xl border select-none ${
              isSelected
                ? "bg-white/65 border-primary/50 shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-2 ring-primary/20 dark:bg-white/[0.12] dark:border-primary/40"
                : "bg-white/40 border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.75)] hover:bg-white/55 hover:border-white/80 hover:translate-y-[-1px] dark:bg-white/[0.05] dark:border-white/15 dark:hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              {/* Frosted Glass Mini Icon Badge */}
              <div
                className={`size-7 sm:size-8 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md shadow-xs border ${item.iconBorder} ${item.badgeBg}`}
              >
                <Icon className="size-3.5 sm:size-4" />
              </div>

              {/* Number and Label side-by-side with subtext */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0">
                  <span className="font-heading text-base sm:text-lg font-extrabold tracking-tight text-foreground leading-none">
                    {item.value}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-foreground/85 truncate leading-none">
                    {item.label}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate mt-1 leading-none font-medium">
                  {item.subtext}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
