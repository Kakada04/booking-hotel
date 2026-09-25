import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  BedDouble,
  Calendar,
  Users,
  Phone,
  Send,
  Navigation,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BOOKINGS, HOTEL_INFO } from "@/lib/mock-data";
import type { Metadata } from "next";

function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDisplay(s: string) {
  return format(parseDate(s), "dd MMM yyyy");
}

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  checked_in: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  checked_out: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  cancelled: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};
const statusLabels: Record<string, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
};
const paymentColors: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  partial: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  unpaid: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};
const paymentLabels: Record<string, string> = {
  paid: "Fully Paid",
  partial: "Partially Paid",
  unpaid: "Unpaid",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Booking ${code} — SrokHotel`,
    description: `Manage your booking ${code} at SrokHotel.`,
  };
}

export default async function MyBookingDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const booking = MOCK_BOOKINGS.find((b) => b.code === code);
  if (!booking) notFound();

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${HOTEL_INFO.lat},${HOTEL_INFO.lng}`;
  const canCancel = booking.status === "confirmed" || booking.status === "pending";
  const canPayRemaining = booking.paymentStatus === "partial" || booking.paymentStatus === "unpaid";

  return (
    <div className="max-w-2xl mx-auto pb-16 space-y-5">
      {/* Back */}
      <Link
        href="/my-booking"
        id="back-to-my-booking"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Booking Lookup
      </Link>

      {/* Status Banner */}
      <div className="glass-panel rounded-srok-2xl p-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Booking {booking.code}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Guest: {booking.guestName}</p>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[booking.status]}`}
          >
            {statusLabels[booking.status]}
          </span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="glass-panel rounded-srok-xl p-6 space-y-4">
        <h2 className="text-sm font-bold">Reservation Details</h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <BedDouble className="size-4 text-primary flex-shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span className="font-bold">{booking.roomTypeName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-primary flex-shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-bold">{formatDisplay(booking.checkIn)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-bold">{formatDisplay(booking.checkOut)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="size-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-bold">
                {booking.adults} adult{booking.adults > 1 ? "s" : ""}
                {booking.children > 0 ? ` + ${booking.children} child` : ""}
              </span>
            </div>
          </div>
          {booking.specialRequest && (
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">Special Request</p>
              <p className="text-sm mt-0.5">{booking.specialRequest}</p>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold">${booking.total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paid</span>
            <span className="font-bold text-emerald-600">${booking.paid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-bold">${booking.remaining}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-muted-foreground">Payment Status</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${paymentColors[booking.paymentStatus]}`}
            >
              {paymentLabels[booking.paymentStatus]}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {canPayRemaining && (
          <button
            type="button"
            id="pay-remaining-btn"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-srok-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Pay Remaining ${booking.remaining}
          </button>
        )}
        <a
          href={`tel:${HOTEL_INFO.phone}`}
          id="contact-hotel-phone-btn"
          className="flex items-center justify-center gap-2 px-4 py-3 glass-card rounded-srok-lg text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
        >
          <Phone className="size-4 text-emerald-500" />
          Contact Hotel
        </a>
        <a
          href={HOTEL_INFO.telegram}
          target="_blank"
          rel="noreferrer"
          id="telegram-hotel-btn"
          className="flex items-center justify-center gap-2 px-4 py-3 glass-card rounded-srok-lg text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
        >
          <Send className="size-4 text-sky-500" />
          Chat on Telegram
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          id="view-location-btn"
          className="flex items-center justify-center gap-2 px-4 py-3 glass-card rounded-srok-lg text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
        >
          <Navigation className="size-4 text-primary" />
          View Hotel Location
        </a>
      </div>

      {/* Optional Requests */}
      <div className="glass-card rounded-srok-xl p-5 space-y-3">
        <h2 className="text-sm font-bold">Additional Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            id="request-date-change-btn"
            className="flex items-center gap-2 px-3 py-2.5 rounded-srok-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
          >
            <Calendar className="size-3.5 text-muted-foreground" />
            Request Date Change
          </button>
          <button
            type="button"
            id="request-extra-bed-btn"
            className="flex items-center gap-2 px-3 py-2.5 rounded-srok-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
          >
            <BedDouble className="size-3.5 text-muted-foreground" />
            Request Extra Bed
          </button>
          <button
            type="button"
            id="send-special-request-btn"
            className="flex items-center gap-2 px-3 py-2.5 rounded-srok-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
          >
            <MessageSquare className="size-3.5 text-muted-foreground" />
            Special Request
          </button>
        </div>
      </div>

      {/* Cancel */}
      {canCancel && (
        <div className="text-center">
          <button
            type="button"
            id="request-cancellation-btn"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <XCircle className="size-3.5" />
            Request Cancellation
          </button>
        </div>
      )}
    </div>
  );
}
