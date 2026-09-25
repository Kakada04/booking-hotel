"use client";

import React from "react";
import Link from "next/link";
import { Search, X, LayoutGrid, List, Plus, ChevronDown, Check } from "lucide-react";
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
import { RoomFilter } from "../types";

interface RoomFiltersProps {
  filter: RoomFilter;
  onFilterChange: (updated: Partial<RoomFilter>) => void;
  totalFilteredCount: number;
  availableFloors?: number[];
}

export function RoomFilters({
  filter,
  onFilterChange,
  totalFilteredCount,
  availableFloors = [1, 2, 3],
}: RoomFiltersProps) {
  const statusTabs = [
    { id: "all", label: "All Rooms" },
    { id: "available", label: "Available" },
    { id: "occupied", label: "Occupied" },
    { id: "reserved", label: "Reserved" },
    { id: "dirty", label: "Dirty" },
    { id: "maintenance", label: "Maintenance" },
  ];

  // Dynamic floors based on actual inventory
  const floors = [
    { id: "all", label: "All Floors" },
    ...availableFloors.map((fl) => ({
      id: String(fl),
      label: `Floor ${fl}`,
    })),
  ];

  const activeFloor = floors.find((f) => f.id === (filter.floor || "all")) || floors[0];

  return (
    <div className="space-y-3">
      {/* Top Filter Bar: Search + Floor + View Mode + Add Room Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input with 2D Glass Styling */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={filter.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search room #, guest, bed..."
            className="pl-9 pr-8 h-10 w-full"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Controls: Floor Dropdown + View Switcher + Create Room Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 sm:pb-0">
          <div className="flex items-center gap-2 shrink-0">
            {/* Floor selector dropdown (dynamically based on actual rooms) */}
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
              <DropdownMenuContent align="start" className="w-40 max-h-64 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  Filter Floor
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {floors.map((fl) => {
                  const isSelected = (filter.floor || "all") === fl.id;
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

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center p-1 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] dark:bg-white/[0.06] dark:border-white/15">
              <button
                type="button"
                onClick={() => onFilterChange({ viewMode: "grid" })}
                className={`size-8 rounded-full flex items-center justify-center transition-all ${
                  filter.viewMode === "grid"
                    ? "bg-white/80 text-primary shadow-sm dark:bg-white/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ viewMode: "table" })}
                className={`size-8 rounded-full flex items-center justify-center transition-all ${
                  filter.viewMode === "table"
                    ? "bg-white/80 text-primary shadow-sm dark:bg-white/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>

          {/* Dedicated Full Page Route Action - STRICTLY NO MODAL */}
          <Link
            href="/admin/rooms/create"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "h-9 sm:h-10 px-3 sm:px-4 gap-1.5 font-bold shrink-0 shadow-sm text-xs sm:text-sm",
            })}
          >
            <Plus className="size-4" />
            <span className="hidden xs:inline">Add Room</span>
            <span className="xs:hidden">Add</span>
          </Link>
        </div>
      </div>

      {/* Status Filter Pills Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1.5 pt-0.5 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          {statusTabs.map((tab) => {
            const isActive = (filter.status || "all") === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange({ status: tab.id })}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap backdrop-blur-md select-none ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] font-bold"
                    : "bg-white/35 text-muted-foreground hover:text-foreground border border-white/60 hover:bg-white/50 font-normal dark:bg-white/[0.05] dark:border-white/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-muted-foreground shrink-0 hidden md:inline-block">
          Showing <span className="font-bold text-foreground">{totalFilteredCount}</span> rooms
        </span>
      </div>
    </div>
  );
}
