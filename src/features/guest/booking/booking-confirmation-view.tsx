"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  CheckCircle2,
  Copy,
  BedDouble,
  Calendar,
  Users,
  MapPin,
  Phone,
  Send,
  Navigation,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HOTEL_INFO, ROOM_TYPES } from "@/lib/mock-data";
import { useState } from "react";

function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDisplay(s: string) {
  return format(parseDate(s), "dd MMM yyyy");
}

export function BookingConfirmationView() {
  const sp = useSearchParams();
  const [copied, setCopied] = useState(false);

  const code = sp.get("code") ?? "BK-2026-00125";
  const name = sp.get("name") ?? "Guest";
  const roomId = sp.get("roomId") ?? "standard-double";
  const checkIn = sp.get("checkIn") ?? "";
  const checkOut = sp.get("checkOut") ?? "";
  const adults = Number(sp.get("adults") ?? 2);
  const children = Number(sp.get("children") ?? 0);
  const total = Number(sp.get("total") ?? 0);
  const paid = Number(sp.get("paid") ?? 0);
  const remaining = Number(sp.get("remaining") ?? 0);
  const paymentMethod = sp.get("paymentMethod") ?? "aba";

  const room = ROOM_TYPES.find((r) => r.id === roomId) ?? ROOM_TYPES[0];

  const paymentStatus = paid === 0 ? "unpaid" : paid >= total ? "paid" : "partial";
  const paymentStatusLabel = paid === 0 ? "Pay on Arrival" : paid >= total ? "Fully Paid" : "Partially Paid";

  function copyCode() {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${HOTEL_INFO.lat},${HOTEL_INFO.lng}`;

  return (
    <div className="max-w-2xl mx-auto pb-16 space-y-5">
      {/* ── Success Banner ────────────────────────────────────────────── */}
      <div className="glass-panel rounded-srok-2xl p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="size-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="size-9 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Booking Confirmed!</h1>
          <p className="text-sm text-muted-foreground">
            Thank you, <span className="font-bold text-foreground">{name}</span>. Your reservation is confirmed.
          </p>
        </div>

        {/* Booking Code */}
        <div className="inline-flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Booking Code</span>
          <button
            onClick={copyCode}
            id="copy-booking-code-btn"
            className="flex items-center gap-2.5 px-5 py-2.5 glass-card rounded-srok-full border border-border hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            <span className="text-lg font-bold tracking-widest">{code}</span>
            {copied ? (
              <CheckCircle2 className="size-4 text-emerald-500" />
            ) : (
              <Copy className="size-4 text-muted-foreground" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">Tap to copy · Save this for your records</span>
        </div>
      </div>

      {/* ── Booking Details ───────────────────────────────────────────── */}
      <div className="glass-panel rounded-srok-xl p-6 space-y-4">
        <h2 className="text-sm font-bold">Reservation Details</h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <BedDouble className="size-4 text-primary flex-shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span className="font-bold">{room.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-primary flex-shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-bold">{checkIn ? formatDisplay(checkIn) : "—"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-bold">{checkOut ? formatDisplay(checkOut) : "—"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="size-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-bold">
                {adults} adult{adults > 1 ? "s" : ""}
                {children > 0 ? ` + ${children} child` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold">${total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paid</span>
            <span className="font-bold text-emerald-600">${paid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-bold">${remaining}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-muted-foreground">Payment Status</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                paymentStatus === "paid"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : paymentStatus === "partial"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
              }`}
            >
              {paymentStatusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Hotel Info ────────────────────────────────────────────────── */}
      <div className="glass-panel rounded-srok-xl p-6 space-y-4">
        <h2 className="text-sm font-bold">Hotel Information</h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="size-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground leading-snug">{HOTEL_INFO.address}</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="size-4 text-primary flex-shrink-0" />
            <a href={`tel:${HOTEL_INFO.phone}`} className="hover:text-primary transition-colors">
              {HOTEL_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href={`/my-booking/${code}`}
          id="view-booking-btn"
          className="flex items-center justify-center gap-2 px-4 py-3 glass-card rounded-srok-lg text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
        >
          <Ticket className="size-4 text-primary" />
          View Booking
        </Link>
        <a
          href={HOTEL_INFO.telegram}
          target="_blank"
          rel="noreferrer"
          id="contact-hotel-telegram-btn"
          className="flex items-center justify-center gap-2 px-4 py-3 glass-card rounded-srok-lg text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
        >
          <Send className="size-4 text-sky-500" />
          Contact Hotel
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          id="get-directions-btn"
          className="flex items-center justify-center gap-2 px-4 py-3 glass-card rounded-srok-lg text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
        >
          <Navigation className="size-4 text-emerald-500" />
          Get Directions
        </a>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        A confirmation SMS will be sent to your phone number shortly.
      </p>
    </div>
  );
}
