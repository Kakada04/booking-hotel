"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookingStay, BookingStatus } from "@/features/admin/calendar/types";
import { Room } from "@/features/admin/rooms/types";

interface StayCardProps {
  stay: BookingStay;
  room?: Room;
  onCheckIn: (stayId: string) => void;
  onCheckOut: (stayId: string) => void;
}

export function StayCard({
  stay,
  room,
  onCheckIn,
  onCheckOut,
}: StayCardProps) {
  const isArrival = stay.status === "confirmed" || stay.status === "reserved";
  const isInHouse = stay.status === "checked_in";
  const isCheckedOut = stay.status === "checked_out";

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case "checked_in":
        return "occupied";
      case "confirmed":
        return "available";
      case "reserved":
        return "gold";
      case "checked_out":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const hkStatus = room?.housekeepingStatus || "clean";

  return (
    <Card className="hover:border-primary/40 transition-all duration-200">
      <CardContent className="p-4 space-y-3">
        {/* Top Header: Guest Name & Room Identifier */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-normal text-muted-foreground">
                {stay.bookingCode}
              </span>
              <Badge
                variant={getStatusBadgeVariant(stay.status)}
                className="text-xs font-bold capitalize"
              >
                {stay.status.replace("_", " ")}
              </Badge>
            </div>
            <h3 className="font-heading text-sm font-bold text-foreground">
              {stay.guestName}
            </h3>
          </div>

          {/* Room Badge */}
          <div className="text-right space-y-0.5 shrink-0">
            <div className="flex items-center justify-end gap-1.5">
              <span
                className={`size-2 rounded-full ${
                  hkStatus === "clean"
                    ? "bg-emerald-500"
                    : hkStatus === "dirty"
                    ? "bg-amber-500"
                    : "bg-cyan-500"
                }`}
                title={`Room Cleanliness: ${hkStatus}`}
              />
              <span className="font-bold text-sm text-foreground">
                Room {stay.roomNumber}
              </span>
            </div>
            <p className="text-xs font-normal text-muted-foreground truncate max-w-[130px]">
              {stay.roomName}
            </p>
          </div>
        </div>

        {/* Stay Operational Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/40 dark:border-white/10 text-xs">
          <div>
            <span className="font-normal text-muted-foreground block">Check-In</span>
            <span className="font-bold text-foreground">{stay.checkIn}</span>
          </div>

          <div>
            <span className="font-normal text-muted-foreground block">Check-Out</span>
            <span className="font-bold text-foreground">{stay.checkOut}</span>
          </div>

          <div>
            <span className="font-normal text-muted-foreground block">Stay Length</span>
            <span className="font-bold text-foreground">{stay.nights} Nights</span>
          </div>

          <div>
            <span className="font-normal text-muted-foreground block">Bill Status</span>
            <span
              className={`font-bold ${
                stay.paymentStatus === "paid" ? "text-foreground" : "text-primary"
              }`}
            >
              ${stay.totalPrice} ({stay.paymentStatus})
            </span>
          </div>
        </div>

        {/* Guest Notes / Requests */}
        {stay.notes && (
          <p className="text-xs font-normal text-muted-foreground/90 bg-white/30 dark:bg-white/[0.03] p-2 rounded-lg leading-relaxed">
            &ldquo;{stay.notes}&rdquo;
          </p>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/40 dark:border-white/10">
          <Link
            href={`/admin/frontdesk/${stay.id}`}
            className={buttonVariants({
              variant: "glass",
              size: "xs",
              className: "gap-1 text-xs font-bold",
            })}
          >
            <span>Stay & Folio Details</span>
            <ArrowRight className="size-3" />
          </Link>

          <div className="flex items-center gap-2">
            {isArrival && (
              <Button
                variant="primary-glass"
                size="xs"
                onClick={() => onCheckIn(stay.id)}
                className="text-xs font-bold px-3"
              >
                Check In
              </Button>
            )}

            {isInHouse && (
              <Button
                variant="glass"
                size="xs"
                onClick={() => onCheckOut(stay.id)}
                className="text-xs font-bold text-primary px-3"
              >
                Check Out
              </Button>
            )}

            {isCheckedOut && (
              <span className="text-xs font-normal text-muted-foreground">
                Departed
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
