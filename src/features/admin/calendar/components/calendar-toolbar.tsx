"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Plus, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarFilters, CalendarViewMode } from "../types";

interface CalendarToolbarProps {
  startDate: Date;
  viewMode: CalendarViewMode;
  filters: CalendarFilters;
  availableFloors: number[];
  availableTypes: { id: string; name: string }[];
  onNavigate: (direction: "prev" | "next" | "today") => void
  onViewModeChange: (mode: CalendarViewMode) => void;
  onFiltersChange: (patch: Partial<CalendarFilters>) => void;
}

export function CalendarToolbar({
  startDate,
  viewMode,
  filters,
  availableFloors,
  availableTypes,
  onNavigate,
  onViewModeChange,
  onFiltersChange,
}: CalendarToolbarProps) {
  // Format Month & Year range
  const daysCount = parseInt(viewMode, 10);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + daysCount - 1);

  const startMonth = startDate.toLocaleString("en-US", { month: "short" });
  const endMonth = endDate.toLocaleString("en-US", { month: "short" });
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const monthYearLabel =
    startMonth === endMonth && startYear === endYear
      ? `${startDate.toLocaleString("en-US", { month: "long" })} ${startYear}`
      : startYear === endYear
      ? `${startMonth} – ${endMonth} ${startYear}`
      : `${startMonth} ${startYear} – ${endMonth} ${endYear}`;

  return (
    <div className="flex flex-col gap-3 p-3 rounded-[18px] bg-white/45 backdrop-blur-xl border border-white/65 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:bg-white/[0.05] dark:border-white/15">
      {/* Top Row: Date Navigation & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Date Navigation Cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Button
              variant="glass"
              size="icon-xs"
              onClick={() => onNavigate("prev")}
              title="Previous period"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="glass"
              size="icon-xs"
              onClick={() => onNavigate("next")}
              title="Next period"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>

          <Button
            variant="glass"
            size="xs"
            onClick={() => onNavigate("today")}
            className="text-xs font-bold"
          >
            Today
          </Button>

          <h2 className="font-heading text-base font-bold text-foreground ml-1">
            {monthYearLabel}
          </h2>
        </div>

        {/* View Mode Segmented Controls & Create Booking Link */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Segmented Day Range Toggle */}
          <div className="flex items-center p-0.5 rounded-full bg-black/[0.04] backdrop-blur-md border border-white/50 overflow-x-auto touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden dark:bg-white/[0.06] dark:border-white/10">
            {(["7", "14", "30"] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  viewMode === mode
                    ? "bg-white/80 font-bold text-primary shadow-xs dark:bg-white/20 dark:text-sky-100"
                    : "font-normal text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "30" ? "Month" : `${mode} Days`}
              </button>
            ))}
          </div>

          {/* New Reservation Action (Full Page route) */}
          <Link
            href="/admin/bookings/create"
            className={buttonVariants({
              variant: "primary-glass",
              size: "xs",
              className: "gap-1 text-xs font-bold px-3",
            })}
          >
            <Plus className="size-3" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* Bottom Row: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-white/40 dark:border-white/10">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search guest or room..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full pl-8.5 pr-3 py-1 text-xs font-normal rounded-full bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
          />
        </div>

        {/* Dropdowns for Floor and Room Type */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Floor Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({
                variant: "glass",
                size: "xs",
                className: "gap-1.5 text-xs px-2.5",
              })}
            >
              <span className="font-normal text-muted-foreground">Floor:</span>
              <span className="font-bold text-foreground">
                {filters.floor === "all" ? "All" : `Floor ${filters.floor}`}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => onFiltersChange({ floor: "all" })}
                className={`text-xs cursor-pointer ${
                  filters.floor === "all"
                    ? "font-bold text-primary bg-primary/10"
                    : "font-normal text-foreground"
                }`}
              >
                All Floors
              </DropdownMenuItem>
              {availableFloors.map((fl) => (
                <DropdownMenuItem
                  key={fl}
                  onClick={() => onFiltersChange({ floor: String(fl) })}
                  className={`text-xs cursor-pointer ${
                    filters.floor === String(fl)
                      ? "font-bold text-primary bg-primary/10"
                      : "font-normal text-foreground"
                  }`}
                >
                  Floor {fl}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Room Type Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({
                variant: "glass",
                size: "xs",
                className: "gap-1.5 text-xs px-2.5",
              })}
            >
              <span className="font-normal text-muted-foreground">Type:</span>
              <span className="font-bold text-foreground max-w-[120px] truncate">
                {filters.roomType === "all"
                  ? "All"
                  : availableTypes.find((t) => t.id === filters.roomType)?.name || "Type"}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <DropdownMenuItem
                onClick={() => onFiltersChange({ roomType: "all" })}
                className={`text-xs cursor-pointer ${
                  filters.roomType === "all"
                    ? "font-bold text-primary bg-primary/10"
                    : "font-normal text-foreground"
                }`}
              >
                All Room Types
              </DropdownMenuItem>
              {availableTypes.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => onFiltersChange({ roomType: t.id })}
                  className={`text-xs cursor-pointer ${
                    filters.roomType === t.id
                      ? "font-bold text-primary bg-primary/10"
                      : "font-normal text-foreground"
                  }`}
                >
                  {t.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
