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
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
  roomType,
  onRoomType,
  sort,
  onSort,
  maxGuests,
  onMaxGuests,
  onReset,
  hasActiveFilters,
}: {
  roomType: string;
  onRoomType: (rt: string) => void;
  sort: SortOption;
  onSort: (s: SortOption) => void;
  maxGuests: number;
  onMaxGuests: (n: number) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}) {
  const currentRoomType = ROOM_TYPES.find((r) => r.id === roomType);
  const roomTypeLabel = currentRoomType ? currentRoomType.name : "All Types";

  const sortLabels: Record<SortOption, string> = {
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low",
    guests_desc: "Most Guests First",
  };

  const guestLabels: Record<number, string> = {
    0: "All Guests",
    2: "Up to 2 Guests",
    3: "Up to 3 Guests",
    4: "Up to 4 Guests",
  };

  return (
    <div className="glass-panel rounded-srok-xl p-3.5 sm:p-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-1">
        <SlidersHorizontal className="size-3.5" />
        <span>Filter:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* 1. Choose Room Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className={`h-8 px-3.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer shadow-xs select-none backdrop-blur-md ${
                  roomType !== "all"
                    ? "bg-primary text-white border-primary shadow-[0_2px_10px_rgba(56,148,224,0.3)]"
                    : "bg-card/90 hover:bg-primary/10 text-foreground border-primary/30 hover:border-primary"
                }`}
              />
            }
          >
            <BedDouble className={`size-3.5 shrink-0 ${roomType !== "all" ? "text-white" : "text-primary"}`} />
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              {roomType === "all" ? "Choose Room Type" : roomTypeLabel}
            </span>
            <ChevronDown className="size-3 shrink-0 opacity-70 ml-0.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-72 p-1.5 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-2 border-primary/35 dark:border-primary/45 shadow-[0_20px_50px_rgba(56,148,224,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(56,189,248,0.25)] rounded-2xl z-50 space-y-0.5"
          >
            <div className="px-3 py-1.5 flex items-center justify-between border-b border-primary/15 dark:border-primary/20 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Room Category</span>
              <span className="text-[10px] text-muted-foreground">{ROOM_TYPES.length} Types</span>
            </div>

            <DropdownMenuItem
              onClick={() => onRoomType("all")}
              className={`flex items-center justify-between py-2 px-3 text-xs rounded-xl cursor-pointer transition-colors ${
                roomType === "all"
                  ? "bg-primary text-white font-bold shadow-[0_2px_8px_rgba(56,148,224,0.35)]"
                  : "text-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <div>
                <p className="font-semibold leading-tight">All Room Types</p>
                <p className={`text-[10px] mt-0.5 ${roomType === "all" ? "text-white/80" : "text-muted-foreground"}`}>
                  Show all available options
                </p>
              </div>
              {roomType === "all" && <Check className="size-3.5 text-white shrink-0 ml-2" />}
            </DropdownMenuItem>

            {ROOM_TYPES.map((rt) => {
              const isSelected = roomType === rt.id;
              return (
                <DropdownMenuItem
                  key={rt.id}
                  onClick={() => onRoomType(rt.id)}
                  className={`flex items-center justify-between py-2 px-3 text-xs rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary text-white font-bold shadow-[0_2px_8px_rgba(56,148,224,0.35)]"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-semibold leading-tight">{rt.name}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? "text-white/85" : "text-muted-foreground"}`}>
                      ${rt.pricePerNight}/night · {rt.bedType}
                    </span>
                  </div>
                  {isSelected && <Check className="size-3.5 text-white shrink-0 ml-2" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 2. Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="h-8 px-3.5 rounded-full text-xs font-semibold border border-primary/30 hover:border-primary bg-card/90 hover:bg-primary/10 text-foreground flex items-center gap-1.5 transition-all cursor-pointer shadow-xs select-none backdrop-blur-md"
              />
            }
          >
            <span className="text-muted-foreground font-normal">Sort:</span>
            <span>{sortLabels[sort]}</span>
            <ChevronDown className="size-3 opacity-70 ml-0.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-52 p-1.5 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-2 border-primary/35 dark:border-primary/45 shadow-[0_20px_50px_rgba(56,148,224,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(56,189,248,0.25)] rounded-2xl z-50 space-y-0.5"
          >
            {(["price_asc", "price_desc", "guests_desc"] as SortOption[]).map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => onSort(opt)}
                className={`flex items-center justify-between py-2 px-3 text-xs rounded-xl cursor-pointer transition-colors ${
                  sort === opt
                    ? "bg-primary text-white font-bold shadow-[0_2px_8px_rgba(56,148,224,0.35)]"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <span>{sortLabels[opt]}</span>
                {sort === opt && <Check className="size-3.5 text-white shrink-0 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 3. Max Guests Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className={`h-8 px-3.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer shadow-xs select-none backdrop-blur-md ${
                  maxGuests > 0
                    ? "bg-primary text-white border-primary shadow-[0_2px_10px_rgba(56,148,224,0.3)]"
                    : "bg-card/90 hover:bg-primary/10 text-foreground border-primary/30 hover:border-primary"
                }`}
              />
            }
          >
            <Users className={`size-3.5 shrink-0 ${maxGuests > 0 ? "text-white" : "text-primary"}`} />
            <span>{guestLabels[maxGuests] ?? `${maxGuests} Guests`}</span>
            <ChevronDown className="size-3 opacity-70 ml-0.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 p-1.5 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-2 border-primary/35 dark:border-primary/45 shadow-[0_20px_50px_rgba(56,148,224,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(56,189,248,0.25)] rounded-2xl z-50 space-y-0.5"
          >
            {[0, 2, 3, 4].map((cnt) => (
              <DropdownMenuItem
                key={cnt}
                onClick={() => onMaxGuests(cnt)}
                className={`flex items-center justify-between py-2 px-3 text-xs rounded-xl cursor-pointer transition-colors ${
                  maxGuests === cnt
                    ? "bg-primary text-white font-bold shadow-[0_2px_8px_rgba(56,148,224,0.35)]"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <span>{guestLabels[cnt]}</span>
                {maxGuests === cnt && <Check className="size-3.5 text-white shrink-0 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Filters Pill */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="h-8 px-2.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        )}
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
  const [roomType, setRoomType] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("price_asc");
  const [maxGuests, setMaxGuests] = useState(0);

  const hasActiveFilters = roomType !== "all" || maxGuests > 0 || sort !== "price_asc";

  function handleReset() {
    setRoomType("all");
    setSort("price_asc");
    setMaxGuests(0);
  }

  const filtered = useMemo(() => {
    let rooms = ROOM_TYPES.filter((r) => r.availableRooms > 0);
    if (roomType !== "all") rooms = rooms.filter((r) => r.id === roomType);
    if (maxGuests > 0) rooms = rooms.filter((r) => r.maxGuests <= maxGuests);
    if (sort === "price_asc") rooms = [...rooms].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "price_desc") rooms = [...rooms].sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sort === "guests_desc") rooms = [...rooms].sort((a, b) => b.maxGuests - a.maxGuests);
    return rooms;
  }, [roomType, sort, maxGuests]);

  return (
    <div className="space-y-6">
      <SearchSummary checkIn={checkIn} checkOut={checkOut} adults={adults} children={children} />
      <FiltersBar
        roomType={roomType}
        onRoomType={setRoomType}
        sort={sort}
        onSort={setSort}
        maxGuests={maxGuests}
        onMaxGuests={setMaxGuests}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      {filtered.length === 0 ? (
        <div className="glass-card rounded-srok-xl p-10 text-center space-y-3">
          <AlertCircle className="size-10 text-muted-foreground mx-auto" />
          <p className="font-bold text-base">No rooms match your filters</p>
          <p className="text-sm text-muted-foreground">Try clearing your filters or selecting a different room type.</p>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-primary underline"
          >
            Clear all filters
          </button>
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

