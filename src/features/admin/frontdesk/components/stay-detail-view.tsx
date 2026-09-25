"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Key, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookingStay, BookingStatus } from "@/features/admin/calendar/types";
import { frontDeskService } from "../frontdesk.service";

interface StayDetailViewProps {
  initialStay: BookingStay;
}

export function StayDetailView({ initialStay }: StayDetailViewProps) {
  const [stay, setStay] = useState<BookingStay>(initialStay);
  const [reissued, setReissued] = useState(false);

  const handleCheckIn = async () => {
    try {
      const updated = await frontDeskService.checkInGuest(stay.id);
      setStay(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      const updated = await frontDeskService.checkOutGuest(stay.id);
      setStay(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReissueKeycard = () => {
    setReissued(true);
    setTimeout(() => setReissued(false), 3000);
  };

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

  const isArrival = stay.status === "confirmed" || stay.status === "reserved";
  const isInHouse = stay.status === "checked_in";
  const isCheckedOut = stay.status === "checked_out";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/admin/frontdesk"
            className={buttonVariants({
              variant: "glass",
              size: "icon",
              className: "size-8.5 rounded-full shrink-0 mt-0.5 sm:mt-0",
            })}
            title="Back to Front Desk"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-normal text-muted-foreground">
                Folio {stay.bookingCode} · Room {stay.roomNumber}
              </span>
              <Badge
                variant={getStatusBadgeVariant(stay.status)}
                className="capitalize text-xs font-bold"
              >
                {stay.status.replace("_", " ")}
              </Badge>
            </div>
            <h1 className="font-heading text-base font-bold text-foreground">
              {stay.guestName}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {isArrival && (
            <Button
              variant="primary-glass"
              size="sm"
              onClick={handleCheckIn}
              className="text-xs font-bold"
            >
              Check In Guest
            </Button>
          )}

          {isInHouse && (
            <Button
              variant="glass"
              size="sm"
              onClick={handleCheckOut}
              className="text-xs font-bold text-primary"
            >
              Process Check-Out
            </Button>
          )}

          <Button
            variant="glass"
            size="sm"
            onClick={handleReissueKeycard}
            className="text-xs font-bold text-foreground"
          >
            {reissued ? "Keycard Encoded!" : "Issue / Re-encode Keycard"}
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Stay Info & Folio Breakdown (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Stay Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Stay Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Check-In</span>
                <span className="font-bold text-foreground">{stay.checkIn}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Check-Out</span>
                <span className="font-bold text-foreground">{stay.checkOut}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Stay Length</span>
                <span className="font-bold text-foreground">{stay.nights} Nights</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Party Size</span>
                <span className="font-bold text-foreground">
                  {stay.adults} Adults{stay.children > 0 ? `, ${stay.children} Children` : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-muted-foreground">Room Unit</span>
                <Link
                  href={`/admin/rooms/${stay.roomId}`}
                  className="font-bold text-primary hover:underline"
                >
                  Room {stay.roomNumber} ({stay.roomName})
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Guest Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Primary Guest</span>
                <span className="font-bold text-foreground">{stay.guestName}</span>
              </div>
              {stay.guestPhone && (
                <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                  <span className="font-normal text-muted-foreground">Phone Number</span>
                  <span className="font-bold text-foreground">{stay.guestPhone}</span>
                </div>
              )}
              {stay.guestEmail && (
                <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                  <span className="font-normal text-muted-foreground">Email Address</span>
                  <span className="font-bold text-foreground">{stay.guestEmail}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-normal text-muted-foreground">Channel / Source</span>
                <span className="font-bold text-foreground capitalize">{stay.source}</span>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          {stay.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-base text-foreground">Guest Remarks & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-normal text-foreground/85 leading-relaxed">
                  {stay.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Folio Billing & Actions (1 col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Folio Balance</CardTitle>
              <CardDescription className="text-xs font-normal text-muted-foreground">
                Charges and settlement summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Room Charges</span>
                <span className="font-bold text-foreground">${stay.totalPrice}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Settlement State</span>
                <span className="font-bold text-foreground capitalize">{stay.paymentStatus}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-foreground">Outstanding Due</span>
                <span className="font-bold text-sm text-primary">
                  {stay.paymentStatus === "paid" ? "$0.00" : `$${stay.totalPrice}`}
                </span>
              </div>

              <div className="pt-3 space-y-2">
                <Link
                  href="/admin/payments/create"
                  className={buttonVariants({
                    variant: "glass",
                    size: "sm",
                    className: "w-full text-xs font-bold justify-center",
                  })}
                >
                  Collect Payment (KHQR / Cash)
                </Link>

                <Link
                  href="/admin/calendar"
                  className={buttonVariants({
                    variant: "glass",
                    size: "sm",
                    className: "w-full text-xs font-bold justify-center text-muted-foreground",
                  })}
                >
                  View on Timeline Calendar
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Keycard Lock Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Keycard Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Lock Station</span>
                <span className="font-bold text-foreground">Door {stay.roomNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-muted-foreground">Active Card ID</span>
                <span className="font-bold text-primary">KC-{stay.roomNumber}-A</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
