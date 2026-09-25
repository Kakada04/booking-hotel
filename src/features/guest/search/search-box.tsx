"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, Search, ChevronDown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";

// ─── Date Picker Popover (minimal inline) ────────────────────────────────
function formatDate(d: Date) {
  return format(d, "EEE, dd MMM yyyy");
}

function formatShortDate(d: Date) {
  return format(d, "dd MMM");
}

// ─── Guest Counter ────────────────────────────────────────────────────────
function GuestCounter({
  label,
  value,
  min,
  max,
  onInc,
  onDec,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          disabled={value <= min}
          className="size-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="text-sm font-bold w-4 text-center">{value}</span>
        <button
          type="button"
          onClick={onInc}
          disabled={value >= max}
          className="size-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Search Box ──────────────────────────────────────────────────────
export function SearchBox() {
  const router = useRouter();

  const today = new Date();
  const [checkIn, setCheckIn] = useState<Date>(today);
  const [checkOut, setCheckOut] = useState<Date>(addDays(today, 1));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestOpen, setGuestOpen] = useState(false);

  const nights = Math.max(
    1,
    Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalGuests = adults + children;

  function handleCheckInChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = new Date(e.target.value);
    setCheckIn(d);
    if (d >= checkOut) setCheckOut(addDays(d, 1));
  }

  function handleCheckOutChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = new Date(e.target.value);
    setCheckOut(d);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      adults: adults.toString(),
      children: children.toString(),
    });
    router.push(`/rooms?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="glass-panel rounded-srok-2xl p-3 shadow-xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Check-in */}
          <label
            htmlFor="search-checkin"
            className="glass-card rounded-srok-lg px-4 py-3 flex flex-col gap-0.5 cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="size-3" />
              Check-in
            </span>
            <span className="text-sm font-bold text-foreground">{formatShortDate(checkIn)}</span>
            <span className="text-xs text-muted-foreground">{format(checkIn, "EEE")}</span>
            <input
              id="search-checkin"
              type="date"
              value={format(checkIn, "yyyy-MM-dd")}
              min={format(today, "yyyy-MM-dd")}
              onChange={handleCheckInChange}
              className="sr-only"
            />
          </label>

          {/* Check-out */}
          <label
            htmlFor="search-checkout"
            className="glass-card rounded-srok-lg px-4 py-3 flex flex-col gap-0.5 cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="size-3" />
              Check-out
            </span>
            <span className="text-sm font-bold text-foreground">{formatShortDate(checkOut)}</span>
            <span className="text-xs text-muted-foreground">
              {format(checkOut, "EEE")} · {nights} night{nights > 1 ? "s" : ""}
            </span>
            <input
              id="search-checkout"
              type="date"
              value={format(checkOut, "yyyy-MM-dd")}
              min={format(addDays(checkIn, 1), "yyyy-MM-dd")}
              onChange={handleCheckOutChange}
              className="sr-only"
            />
          </label>

          {/* Guests */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setGuestOpen((v) => !v)}
              className="glass-card rounded-srok-lg px-4 py-3 flex flex-col gap-0.5 w-full text-left hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Users className="size-3" />
                Guests
              </span>
              <span className="text-sm font-bold text-foreground flex items-center gap-1">
                {totalGuests} Guest{totalGuests > 1 ? "s" : ""}
                <ChevronDown className={`size-3.5 text-muted-foreground ml-auto transition-transform ${guestOpen ? "rotate-180" : ""}`} />
              </span>
              <span className="text-xs text-muted-foreground">
                {adults} adult{adults > 1 ? "s" : ""}{children > 0 ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}
              </span>
            </button>

            {/* Guest dropdown */}
            {guestOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card/98 dark:bg-zinc-950/98 rounded-srok-xl p-4 shadow-2xl border border-border backdrop-blur-2xl min-w-[220px]">
                <GuestCounter
                  label="Adults"
                  value={adults}
                  min={1}
                  max={10}
                  onInc={() => setAdults((v) => v + 1)}
                  onDec={() => setAdults((v) => v - 1)}
                />
                <div className="border-t border-border my-1" />
                <GuestCounter
                  label="Children"
                  value={children}
                  min={0}
                  max={6}
                  onInc={() => setChildren((v) => v + 1)}
                  onDec={() => setChildren((v) => v - 1)}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => setGuestOpen(false)}
                >
                  Done
                </Button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            size="lg"
            className="h-full min-h-[72px] rounded-srok-lg text-sm font-bold shadow-lg gap-2"
          >
            <Search className="size-4" />
            Check Available Rooms
          </Button>
        </div>
      </div>
    </form>
  );
}
