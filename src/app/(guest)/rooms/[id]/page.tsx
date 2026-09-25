import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, differenceInCalendarDays } from "date-fns";
import {
  BedDouble,
  Users,
  Ruler,
  Clock,
  ArrowLeft,
  Check,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROOM_TYPES, HOTEL_INFO, PAYMENT_POLICY } from "@/lib/mock-data";
import type { Metadata } from "next";

function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(s: string) {
  return format(parseDate(s), "dd MMM yyyy");
}

function calcNights(checkIn: string, checkOut: string) {
  return Math.max(1, differenceInCalendarDays(parseDate(checkOut), parseDate(checkIn)));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const room = ROOM_TYPES.find((r) => r.id === id);
  return {
    title: room ? `${room.name} — SrokHotel` : "Room Detail — SrokHotel",
    description: room?.description,
  };
}

export default async function RoomDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; adults?: string; children?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const room = ROOM_TYPES.find((r) => r.id === id);
  if (!room) notFound();

  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");

  const checkIn = sp.checkIn ?? today;
  const checkOut = sp.checkOut ?? tomorrow;
  const adults = Number(sp.adults ?? 2);
  const children = Number(sp.children ?? 0);
  const nights = calcNights(checkIn, checkOut);
  const subtotal = room.pricePerNight * nights;
  const fees = 0;
  const total = subtotal + fees;
  const depositAmount = Math.round((total * PAYMENT_POLICY.depositPercent) / 100);
  const remaining = total - depositAmount;

  const bookParams = new URLSearchParams({
    checkIn,
    checkOut,
    adults: adults.toString(),
    children: children.toString(),
    roomId: room.id,
  }).toString();

  const backParams = new URLSearchParams({ checkIn, checkOut, adults: adults.toString(), children: children.toString() }).toString();

  return (
    <div className="pb-16 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href={`/rooms?${backParams}`}
        id="back-to-rooms"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Available Rooms
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Gallery */}
          <div className="relative h-72 sm:h-96 rounded-srok-xl overflow-hidden">
            <Image src={room.image} alt={room.name} fill className="object-cover" priority />
          </div>

          {/* Room Info */}
          <div className="glass-card rounded-srok-xl p-6 space-y-5">
            <div>
              <h1 className="text-xl font-bold tracking-tight">{room.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BedDouble className="size-4" />
                  {room.bedType}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  Max {room.maxGuests} Guests
                </span>
                <span className="flex items-center gap-1.5">
                  <Ruler className="size-4" />
                  {room.roomSize} m²
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed">{room.description}</p>

            {/* Amenities */}
            <div>
              <h2 className="text-sm font-bold mb-3">Room Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {room.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="size-3.5 text-primary flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in / Check-out times */}
            <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="text-sm font-bold">{HOTEL_INFO.checkinTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className="text-sm font-bold">{HOTEL_INFO.checkoutTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Booking Panel ─────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-20">
          {/* Stay Summary */}
          <div className="glass-panel rounded-srok-xl p-5 space-y-4">
            <h2 className="text-sm font-bold">Your Stay</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Check-in</span>
                <span className="font-bold">{formatDisplay(checkIn)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Check-out</span>
                <span className="font-bold">{formatDisplay(checkOut)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-bold">{nights} night{nights > 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Guests</span>
                <span className="font-bold">
                  {adults} adult{adults > 1 ? "s" : ""}
                  {children > 0 ? ` + ${children} child` : ""}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  ${room.pricePerNight} × {nights} night{nights > 1 ? "s" : ""}
                </span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fees</span>
                <span>${fees}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            {/* Payment Policy */}
            <div className="glass-card rounded-srok-lg p-3 space-y-1">
              <p className="text-xs font-bold text-foreground">{PAYMENT_POLICY.label}</p>
              <p className="text-xs text-muted-foreground leading-snug">{PAYMENT_POLICY.description}</p>
              {PAYMENT_POLICY.depositPercent > 0 && PAYMENT_POLICY.depositPercent < 100 && (
                <div className="pt-1.5 space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Required now</span>
                    <span className="font-bold text-primary">${depositAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Pay at property</span>
                    <span className="font-bold">${remaining}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <Link href={`/booking?${bookParams}`} id="book-this-room-btn">
              <Button size="lg" className="w-full gap-2 font-bold">
                Book This Room
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <p className="text-center text-xs text-muted-foreground">No credit card required to reserve</p>
          </div>

          {/* Location */}
          <div className="glass-card rounded-srok-xl p-4 flex items-start gap-3">
            <MapPin className="size-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold">Location</p>
              <p className="text-xs text-muted-foreground leading-snug">{HOTEL_INFO.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
