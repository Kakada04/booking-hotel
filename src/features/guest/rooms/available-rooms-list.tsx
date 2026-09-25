"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInCalendarDays } from "date-fns";
import {
  BedDouble,
  Users,
  Ruler,
  Wifi,
  Wind,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROOM_TYPES, type RoomType } from "@/lib/mock-data";

// ─── Helpers ───────────────────────────────────────────────────────────────
function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function calcNights(checkIn: string, checkOut: string) {
  return Math.max(1, differenceInCalendarDays(parseDate(checkOut), parseDate(checkIn)));
}

function formatDisplayDate(s: string) {
  return format(parseDate(s), "dd MMM yyyy");
}

// ─── Room Card ─────────────────────────────────────────────────────────────
function RoomCard({
  room,
  checkIn,
  checkOut,
  adults,
  children,
}: {
  room: RoomType;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}) {
  const nights = calcNights(checkIn, checkOut);
  const total = room.pricePerNight * nights;
  const [showAll, setShowAll] = useState(false);
  const displayedAmenities = showAll ? room.amenities : room.amenities.slice(0, 4);

  const bookParams = new URLSearchParams({
    checkIn,
    checkOut,
    adults: adults.toString(),
    children: children.toString(),
    roomId: room.id,
  }).toString();

  return (
    <div className="glass-card rounded-srok-xl overflow-hidden transition-all duration-200 hover:shadow-lg">
      {/* Room Image */}
      <div className="relative h-52 sm:h-60 overflow-hidden">
        <Image src={room.image} alt={room.name} fill className="object-cover" />
        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`glass-pill px-2.5 py-1 text-xs font-bold ${
              room.availableRooms <= 1
                ? "text-orange-600 dark:text-orange-400"
                : "text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {room.availableRooms === 1
              ? "Last room!"
              : `${room.availableRooms} rooms left`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-foreground leading-tight">{room.name}</h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BedDouble className="size-3.5" />
                {room.bedType}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                Max {room.maxGuests}
              </span>
              <span className="flex items-center gap-1">
                <Ruler className="size-3.5" />
                {room.roomSize} m²
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-foreground">${room.pricePerNight}</p>
            <p className="text-xs text-muted-foreground">/ night</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {displayedAmenities.map((a) => (
            <span
              key={a}
              className="glass-pill px-2.5 py-0.5 text-xs text-foreground/75"
            >
              {a}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-xs text-primary flex items-center gap-0.5 hover:underline"
            >
              {showAll ? (
                <>Less <ChevronUp className="size-3" /></>
              ) : (
                <>+{room.amenities.length - 4} more <ChevronDown className="size-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Price Summary & Actions */}
        <div className="border-t border-border pt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{nights} night{nights > 1 ? "s" : ""}</p>
            <p className="text-base font-bold text-foreground">Total ${total}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/rooms/${room.id}?${bookParams}`}
              id={`view-room-${room.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              View Room
            </Link>
            <Link
              href={`/booking?${bookParams}`}
              id={`book-now-${room.id}`}
            >
              <Button size="sm" className="gap-1.5">
                Book Now
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Filters Bar ──────────────────────────────────────────────────────────
type SortOption = "price_asc" | "price_desc" | "guests_desc";

function FiltersBar({
  sort,
  onSort,
  maxGuests,
  onMaxGuests,
}: {
  sort: SortOption;
  onSort: (s: SortOption) => void;
  maxGuests: number;
  onMaxGuests: (n: number) => void;
}) {
  return (
    <div className="glass-panel rounded-srok-xl p-4 flex flex-wrap items-center gap-3">
      <SlidersHorizontal className="size-4 text-muted-foreground flex-shrink-0" />
      <span className="text-sm font-medium text-muted-foreground">Filters:</span>

      <div className="flex flex-wrap gap-2 flex-1">
        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortOption)}
          className="glass-card rounded-srok-full px-3 py-1.5 text-xs font-medium border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-ring/40"
          aria-label="Sort rooms"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="guests_desc">Most Guests First</option>
        </select>

        {/* Min guests */}
        <select
          value={maxGuests}
          onChange={(e) => onMaxGuests(Number(e.target.value))}
          className="glass-card rounded-srok-full px-3 py-1.5 text-xs font-medium border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-ring/40"
          aria-label="Filter by guests"
        >
          <option value={0}>All Guest Counts</option>
          <option value={2}>Up to 2 Guests</option>
          <option value={3}>Up to 3 Guests</option>
          <option value={4}>Up to 4 Guests</option>
        </select>
      </div>
    </div>
  );
}

// ─── Search Summary ────────────────────────────────────────────────────────
function SearchSummary({
  checkIn,
  checkOut,
  adults,
  children,
}: {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}) {
  const nights = calcNights(checkIn, checkOut);
  return (
    <div className="glass-panel rounded-srok-xl p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div>
          <span className="text-xs text-muted-foreground block">Check-in</span>
          <span className="font-bold">{formatDisplayDate(checkIn)}</span>
        </div>
        <ArrowRight className="size-4 text-muted-foreground hidden sm:block" />
        <div>
          <span className="text-xs text-muted-foreground block">Check-out</span>
          <span className="font-bold">{formatDisplayDate(checkOut)}</span>
        </div>
        <div className="border-l border-border pl-4">
          <span className="text-xs text-muted-foreground block">Duration</span>
          <span className="font-bold">{nights} night{nights > 1 ? "s" : ""}</span>
        </div>
        <div className="border-l border-border pl-4">
          <span className="text-xs text-muted-foreground block">Guests</span>
          <span className="font-bold">
            {adults} adult{adults > 1 ? "s" : ""}
            {children > 0 && `, ${children} child${children > 1 ? "ren" : ""}`}
          </span>
        </div>
      </div>
      <Link
        href="/"
        id="change-search-btn"
        className="text-xs font-medium text-primary hover:underline"
      >
        Change Search
      </Link>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────
export function AvailableRoomsList({
  checkIn,
  checkOut,
  adults,
  children,
}: {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}) {
  const [sort, setSort] = useState<SortOption>("price_asc");
  const [maxGuests, setMaxGuests] = useState(0);

  const filtered = useMemo(() => {
    let rooms = ROOM_TYPES.filter((r) => r.availableRooms > 0);
    if (maxGuests > 0) rooms = rooms.filter((r) => r.maxGuests <= maxGuests);
    if (sort === "price_asc") rooms = [...rooms].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "price_desc") rooms = [...rooms].sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sort === "guests_desc") rooms = [...rooms].sort((a, b) => b.maxGuests - a.maxGuests);
    return rooms;
  }, [sort, maxGuests]);

  return (
    <div className="space-y-6">
      <SearchSummary checkIn={checkIn} checkOut={checkOut} adults={adults} children={children} />
      <FiltersBar sort={sort} onSort={setSort} maxGuests={maxGuests} onMaxGuests={setMaxGuests} />

      {filtered.length === 0 ? (
        <div className="glass-card rounded-srok-xl p-10 text-center space-y-3">
          <AlertCircle className="size-10 text-muted-foreground mx-auto" />
          <p className="font-bold text-base">No rooms match your filters</p>
          <p className="text-sm text-muted-foreground">Try adjusting your guest count filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              checkIn={checkIn}
              checkOut={checkOut}
              adults={adults}
              children={children}
            />
          ))}
        </div>
      )}
    </div>
  );
}
