"use client";

import React from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingStay, BookingStatus } from "../types";

interface StayQuickViewProps {
  stay: BookingStay | null;
  onClose: () => void;
  onStatusUpdate: (id: string, newStatus: BookingStatus) => void;
}

export function StayQuickView({
  stay,
  onClose,
  onStatusUpdate,
}: StayQuickViewProps) {
  if (!stay) return null;

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
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm p-4 flex flex-col justify-between bg-white/80 backdrop-blur-2xl border-l border-white/70 shadow-2xl dark:bg-black/80 dark:border-white/15 animate-in slide-in-from-right duration-200">
      <div className="space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/50 dark:border-white/10">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-primary">
              {stay.bookingCode}
            </span>
            <h3 className="font-heading text-base font-bold text-foreground">
              {stay.guestName}
            </h3>
          </div>
          <Button
            variant="glass"
            size="icon-xs"
            onClick={onClose}
            title="Close summary"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        {/* Status & Room */}
        <div className="flex items-center justify-between">
          <Badge
            variant={getStatusBadgeVariant(stay.status)}
            className="text-xs font-bold capitalize"
          >
            {stay.status.replace("_", " ")}
          </Badge>
          <span className="text-xs font-bold text-foreground">
            Room {stay.roomNumber} · {stay.roomName}
          </span>
        </div>

        {/* Stay Details Grid */}
        <div className="p-3 rounded-[14px] bg-white/45 backdrop-blur-md border border-white/65 space-y-2.5 text-xs dark:bg-white/[0.05] dark:border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
            <span className="font-normal text-muted-foreground">Check-In</span>
            <span className="font-bold text-foreground">{stay.checkIn}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
            <span className="font-normal text-muted-foreground">Check-Out</span>
            <span className="font-bold text-foreground">{stay.checkOut}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
            <span className="font-normal text-muted-foreground">Duration</span>
            <span className="font-bold text-foreground">{stay.nights} Nights</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
            <span className="font-normal text-muted-foreground">Guests</span>
            <span className="font-bold text-foreground">
              {stay.adults} Adults{stay.children > 0 ? `, ${stay.children} Children` : ""}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
            <span className="font-normal text-muted-foreground">Total Bill</span>
            <span className="font-bold text-sm text-primary">${stay.totalPrice}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-normal text-muted-foreground">Payment</span>
            <span className="font-bold text-foreground capitalize">
              {stay.paymentStatus}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        {(stay.guestPhone || stay.guestEmail) && (
          <div className="p-3 rounded-[14px] bg-white/35 backdrop-blur-md border border-white/50 space-y-1 text-xs dark:bg-white/[0.03] dark:border-white/10">
            {stay.guestPhone && (
              <div className="flex justify-between">
                <span className="font-normal text-muted-foreground">Phone</span>
                <span className="font-normal text-foreground">{stay.guestPhone}</span>
              </div>
            )}
            {stay.guestEmail && (
              <div className="flex justify-between">
                <span className="font-normal text-muted-foreground">Email</span>
                <span className="font-normal text-foreground truncate max-w-[180px]">{stay.guestEmail}</span>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {stay.notes && (
          <div className="p-3 rounded-[14px] bg-white/35 backdrop-blur-md border border-white/50 text-xs dark:bg-white/[0.03] dark:border-white/10">
            <span className="font-bold text-foreground block mb-1">Guest Notes:</span>
            <p className="font-normal text-muted-foreground leading-relaxed">
              {stay.notes}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="space-y-2 pt-4 border-t border-white/50 dark:border-white/10">
        {/* Quick Check-In / Check-Out Toggle */}
        {stay.status === "confirmed" || stay.status === "reserved" ? (
          <Button
            variant="glass"
            size="sm"
            onClick={() => onStatusUpdate(stay.id, "checked_in")}
            className="w-full text-xs font-bold text-primary"
          >
            Check In Guest
          </Button>
        ) : stay.status === "checked_in" ? (
          <Button
            variant="glass"
            size="sm"
            onClick={() => onStatusUpdate(stay.id, "checked_out")}
            className="w-full text-xs font-bold text-foreground"
          >
            Check Out Guest
          </Button>
        ) : null}

        {/* Dedicated Full Page Link (Strict adherence to AGENTS.md) */}
        <Link
          href={`/admin/bookings/${stay.id}`}
          className={buttonVariants({
            variant: "primary-glass",
            size: "sm",
            className: "w-full justify-center gap-1.5 text-xs font-bold",
          })}
        >
          <span>View Full Booking Details</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
