"use client";

import React from "react";
import Link from "next/link";
import { BedDouble, Plus, RotateCcw } from "lucide-react";
import { RoomCard } from "./room-card";
import { Room, RoomStatus, HousekeepingStatus } from "../types";
import { Button, buttonVariants } from "@/components/ui/button";

interface RoomGridProps {
  rooms: Room[];
  onUpdateStatus?: (roomId: string, status: RoomStatus) => void;
  onUpdateHousekeeping?: (roomId: string, status: HousekeepingStatus) => void;
  onResetFilters?: () => void;
}

export function RoomGrid({
  rooms,
  onUpdateStatus,
  onUpdateHousekeeping,
  onResetFilters,
}: RoomGridProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-[18px] bg-white/35 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] dark:bg-white/[0.04] dark:border-white/10">
        <div className="size-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4 border border-primary/25 shadow-sm">
          <BedDouble className="size-7" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">
          No rooms match your filter
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6">
          Try clearing search keywords or changing the status filter to see all physical rooms in the inventory.
        </p>
        <div className="flex items-center gap-3">
          {onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Filters</span>
            </Button>
          )}
          <Link
            href="/admin/rooms/create"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "gap-1.5 text-xs font-semibold",
            })}
          >
            <Plus className="size-3.5" />
            <span>Create New Room</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onUpdateStatus={onUpdateStatus}
          onUpdateHousekeeping={onUpdateHousekeeping}
        />
      ))}
    </div>
  );
}
