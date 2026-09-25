"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Calendar } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calendarService, BookingStay, BookingStatus } from "@/features/admin/calendar";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const bookingId = unwrappedParams.id;
  const [booking, setBooking] = useState<BookingStay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      try {
        const found = await calendarService.getBookingById(bookingId);
        setBooking(found);
      } catch (err) {
        console.error("Failed to load booking:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [bookingId]);

  const handleUpdateStatus = async (newStatus: BookingStatus) => {
    if (!booking) return;
    try {
      const updated = await calendarService.updateBookingStatus(booking.id, newStatus);
      setBooking(updated);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-normal text-muted-foreground animate-pulse">
        Loading reservation record #{bookingId}...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 rounded-[18px] bg-white/45 backdrop-blur-xl border border-white/65 p-8 shadow-sm">
        <h2 className="font-heading text-base font-bold text-foreground">Booking not found</h2>
        <p className="text-xs font-normal text-muted-foreground">
          The requested booking record (&quot;{bookingId}&quot;) could not be located.
        </p>
        <div>
          <Link
            href="/admin/calendar"
            className={buttonVariants({
              variant: "glass",
              size: "sm",
              className: "gap-1.5 font-bold text-xs",
            })}
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Timeline</span>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/admin/calendar"
            className={buttonVariants({
              variant: "glass",
              size: "icon",
              className: "size-8.5 rounded-full shrink-0 mt-0.5 sm:mt-0",
            })}
            title="Back to Calendar"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-normal text-muted-foreground">
                Reservation {booking.bookingCode} · Room {booking.roomNumber}
              </span>
              <Badge
                variant={getStatusBadgeVariant(booking.status)}
                className="capitalize text-xs font-bold"
              >
                {booking.status.replace("_", " ")}
              </Badge>
            </div>
            <h1 className="font-heading text-base font-bold text-foreground">
              {booking.guestName}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {booking.status === "confirmed" || booking.status === "reserved" ? (
            <Button
              variant="glass"
              size="sm"
              onClick={() => handleUpdateStatus("checked_in")}
              className="text-xs font-bold text-primary"
            >
              Check In Guest
            </Button>
          ) : booking.status === "checked_in" ? (
            <Button
              variant="glass"
              size="sm"
              onClick={() => handleUpdateStatus("checked_out")}
              className="text-xs font-bold text-foreground"
            >
              Check Out Guest
            </Button>
          ) : null}

          <Link
            href={`/admin/bookings/${booking.id}/edit`}
            className={buttonVariants({
              variant: "primary-glass",
              size: "sm",
              className: "gap-1.5 text-xs font-bold",
            })}
          >
            <Edit2 className="size-3.5" />
            <span>Edit Booking</span>
          </Link>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Guest & Stay Information (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Stay Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Stay Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Check-In Date</span>
                <span className="font-bold text-foreground">{booking.checkIn}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Check-Out Date</span>
                <span className="font-bold text-foreground">{booking.checkOut}</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Length of Stay</span>
                <span className="font-bold text-foreground">{booking.nights} Nights</span>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Party Size</span>
                <span className="font-bold text-foreground">
                  {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-muted-foreground">Assigned Room</span>
                <Link
                  href={`/admin/rooms/${booking.roomId}`}
                  className="font-bold text-primary hover:underline"
                >
                  Room {booking.roomNumber} ({booking.roomName})
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
                <span className="font-bold text-foreground">{booking.guestName}</span>
              </div>
              {booking.guestPhone && (
                <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                  <span className="font-normal text-muted-foreground">Phone Number</span>
                  <span className="font-bold text-foreground">{booking.guestPhone}</span>
                </div>
              )}
              {booking.guestEmail && (
                <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                  <span className="font-normal text-muted-foreground">Email Address</span>
                  <span className="font-bold text-foreground">{booking.guestEmail}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-normal text-muted-foreground">Booking Source</span>
                <span className="font-bold text-foreground capitalize">{booking.source}</span>
              </div>
            </CardContent>
          </Card>

          {/* Special Notes Card */}
          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="font-bold text-base text-foreground">Special Requests & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-normal text-foreground/85 leading-relaxed">
                  {booking.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Billing & Financials (1 col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Folio & Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Payment Status</span>
                <span className="font-bold text-foreground capitalize">{booking.paymentStatus}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Room Rate Total</span>
                <span className="font-bold text-sm text-foreground">${booking.totalPrice}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-foreground">Balance Due</span>
                <span className="font-bold text-sm text-primary">
                  {booking.paymentStatus === "paid" ? "$0.00" : `$${booking.totalPrice}`}
                </span>
              </div>

              <div className="pt-3">
                <Link
                  href="/admin/payments/create"
                  className={buttonVariants({
                    variant: "glass",
                    size: "sm",
                    className: "w-full text-xs font-bold justify-center",
                  })}
                >
                  Record Payment (KHQR / Cash)
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
