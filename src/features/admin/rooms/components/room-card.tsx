"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Room, RoomStatus, HousekeepingStatus } from "../types";

interface RoomCardProps {
  room: Room;
  onUpdateStatus?: (roomId: string, status: RoomStatus) => void;
  onUpdateHousekeeping?: (roomId: string, status: HousekeepingStatus) => void;
}

export function RoomCard({
  room,
  onUpdateStatus,
  onUpdateHousekeeping,
}: RoomCardProps) {
  const [imgError, setImgError] = useState(false);

  // Status mapping to badge variants
  const getStatusVariant = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "available";
      case "occupied":
        return "occupied";
      case "dirty":
        return "dirty";
      case "cleaning":
        return "cleaning";
      case "reserved":
        return "default";
      case "maintenance":
      case "out_of_order":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const statusLabels: Record<RoomStatus, string> = {
    available: "Available",
    occupied: "Occupied",
    reserved: "Reserved",
    dirty: "Dirty",
    cleaning: "Cleaning",
    maintenance: "Maintenance",
    out_of_order: "Out of Order",
  };

  const imageSrc =
    !imgError && room.images && room.images.length > 0
      ? room.images[0]
      : "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-[18px] bg-white/45 backdrop-blur-xl border border-white/65 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-200 hover:bg-white/55 dark:bg-white/[0.05] dark:border-white/15 dark:hover:bg-white/[0.08]">
      <div>
        {/* Photo Container with Glass Overlay Pills */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/10">
          <img
            src={imageSrc}
            alt={room.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Left: Clean Room Pill */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/70 shadow-xs text-xs font-bold text-foreground dark:bg-black/70 dark:border-white/20">
            Room {room.roomNumber}
          </div>

          {/* Top Right: Status Glass Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={getStatusVariant(room.status)}
              className="text-xs font-bold capitalize"
            >
              {statusLabels[room.status]}
            </Badge>
          </div>
        </div>

        {/* Card Content: Strict 3 font sizes, 2 weights, 3 colors, no icon spam */}
        <CardContent className="p-4 space-y-2.5">
          {/* Title & Price Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/admin/rooms/${room.id}`}
                className="font-heading text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1 leading-snug"
              >
                {room.name}
              </Link>
              <p className="text-xs font-normal text-muted-foreground">
                {room.typeName} · Floor {room.floor}
              </p>
            </div>

            {/* Price (text-sm font-bold text-primary) */}
            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-primary">
                ${room.pricePerNight}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / night
              </span>
            </div>
          </div>

          {/* Capacity & Bed Info: Typographic, no icon clutter */}
          <p className="text-xs font-normal text-muted-foreground">
            {room.capacity.adults} adults
            {room.capacity.children > 0 && `, ${room.capacity.children} children`}{" "}
            · {room.bedType}
          </p>

          {/* Operational Details (In-House Guest or Housekeeping) */}
          {room.currentGuest ? (
            <div className="pt-2 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-xs font-normal text-muted-foreground">
              <span>
                Guest:{" "}
                <strong className="font-bold text-foreground">
                  {room.currentGuest.name}
                </strong>
              </span>
              <span>Depart: {room.currentGuest.checkOut}</span>
            </div>
          ) : room.housekeepingStatus === "dirty" ? (
            <div className="pt-2 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-xs font-normal text-muted-foreground">
              <span>Housekeeping pending</span>
              {onUpdateHousekeeping && (
                <button
                  type="button"
                  onClick={() => onUpdateHousekeeping(room.id, "clean")}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Mark clean
                </button>
              )}
            </div>
          ) : null}
        </CardContent>
      </div>

      {/* Card Footer: Clear full-page navigation actions with 2D Frosted Glass Buttons */}
      <CardFooter className="px-4 pb-4 pt-1 flex items-center justify-between gap-2.5 bg-transparent border-t-0">
        <Link
          href={`/admin/rooms/${room.id}`}
          className={buttonVariants({
            variant: "primary-glass",
            size: "sm",
            className: "h-8 flex-1 text-xs font-bold justify-center",
          })}
        >
          Manage Room
        </Link>

        <Link
          href={`/admin/rooms/${room.id}/edit`}
          className={buttonVariants({
            variant: "glass",
            size: "sm",
            className: "h-8 px-4 text-xs font-bold justify-center",
          })}
        >
          Edit
        </Link>
      </CardFooter>
    </Card>
  );
}
