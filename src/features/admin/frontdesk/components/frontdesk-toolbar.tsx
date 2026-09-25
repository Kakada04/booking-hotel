"use client";

import React from "react";
import Link from "next/link";
import { Search, X, Plus, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FrontDeskFilters, FrontDeskStream, FrontDeskStatsData } from "../types";

interface FrontDeskToolbarProps {
  filters: FrontDeskFilters;
  stats: FrontDeskStatsData;
  availableFloors: number[];
  totalFilteredCount: number;
  onFilterChange: (patch: Partial<FrontDeskFilters>) => void;
}

export function FrontDeskToolbar({
  filters,
  stats,
  availableFloors,
  totalFilteredCount,
  onFilterChange,
}: FrontDeskToolbarProps) {
  const streams: { id: FrontDeskStream; label: string; count?: number }[] = [
    { id: "all", label: "All Activity" },
    { id: "arrivals", label: "Arrivals", count: stats.arrivalsToday },
    { id: "in_house", label: "In-House", count: stats.inHouseCount },
    { id: "departures", label: "Departures", count: stats.departuresToday },
  ];

  // Dynamic floors based on actual inventory
  const floors = [
    { id: "all", label: "All Floors" },
    ...availableFloors.map((fl) => ({
      id: String(fl),
      label: `Floor ${fl}`,
    })),
  ];

  const activeFloor = floors.find((f) => f.id === (filters.floor || "all")) || floors[0];

  return (
    <div className="space-y-3">
      {/* Top Filter Bar: Search + Floor Dropdown + Walk-In Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input with 2D Glass Styling */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search guest, room #, booking ref..."
            className="pl-9 pr-8 h-10 w-full"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Controls: Floor Dropdown + Walk-In Action Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto pb-1 sm:pb-0 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 shrink-0">
            {/* Floor selector dropdown (identical to rooms standard) */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 sm:h-10 px-3.5 rounded-full text-xs font-normal gap-1.5 bg-white/40 backdrop-blur-md border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] hover:bg-white/60 dark:bg-white/[0.06] dark:border-white/15 shrink-0"
                    aria-label="Filter by floor"
                  />
                }
              >
                <span className={activeFloor.id === "all" ? "text-muted-foreground" : "text-foreground font-bold"}>
                  {activeFloor.id === "all" ? "All Floors" : activeFloor.label}
                </span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 max-h-64 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  Filter Floor
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {floors.map((fl) => {
                  const isSelected = (filters.floor || "all") === fl.id;
                  return (
                    <DropdownMenuItem
                      key={fl.id}
                      onClick={() => onFilterChange({ floor: fl.id })}
                      className={`text-xs cursor-pointer flex items-center justify-between px-2.5 py-1.5 rounded-lg ${
                        isSelected
                          ? "bg-primary/15 text-primary font-bold"
                          : "text-foreground hover:bg-black/5 dark:hover:bg-white/10 font-normal"
                      }`}
                    >
                      <span>{fl.label}</span>
                      {isSelected && <Check className="size-3.5 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Dedicated Full Page Route Action - STRICTLY NO MODAL */}
          <Link
            href="/admin/frontdesk/walk-in"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "h-9 sm:h-10 px-3 sm:px-4 gap-1.5 font-bold shrink-0 shadow-sm text-xs sm:text-sm",
            })}
          >
            <Plus className="size-4" />
            <span className="hidden xs:inline">Walk-In Check-In</span>
            <span className="xs:hidden">Walk-In</span>
          </Link>
        </div>
      </div>

      {/* Stream Filter Pills Row (Standard horizontal scroll with hidden scrollbar) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1.5 pt-0.5 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          {streams.map((s) => {
            const isActive = filters.stream === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onFilterChange({ stream: s.id })}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap backdrop-blur-md select-none flex items-center gap-1.5 ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] font-bold"
                    : "bg-white/35 text-muted-foreground hover:text-foreground border border-white/60 hover:bg-white/50 font-normal dark:bg-white/[0.05] dark:border-white/10"
                }`}
              >
                <span>{s.label}</span>
                {typeof s.count === "number" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-primary/25 text-primary"
                        : "bg-black/5 text-muted-foreground dark:bg-white/10"
                    }`}
                  >
                    {s.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-muted-foreground shrink-0 hidden md:inline-block">
          Showing <span className="font-bold text-foreground">{totalFilteredCount}</span> stays
        </span>
      </div>
    </div>
  );
}
