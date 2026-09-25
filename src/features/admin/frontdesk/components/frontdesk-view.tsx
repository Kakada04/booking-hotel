"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BookingStay } from "@/features/admin/calendar/types";
import { Room } from "@/features/admin/rooms/types";
import { FrontDeskFilters, FrontDeskStatsData } from "../types";
import { frontDeskService, SYSTEM_DATE } from "../frontdesk.service";
import { FrontDeskToolbar } from "./frontdesk-toolbar";
import { StayCard } from "./stay-card";

interface FrontDeskViewProps {
  initialBookings?: BookingStay[];
  initialRooms?: Room[];
  initialStats?: FrontDeskStatsData;
}

export function FrontDeskView({
  initialBookings = [],
  initialRooms = [],
  initialStats,
}: FrontDeskViewProps) {
  const [bookings, setBookings] = useState<BookingStay[]>(initialBookings);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [stats, setStats] = useState<FrontDeskStatsData>(
    initialStats || {
      arrivalsToday: 0,
      inHouseCount: 0,
      departuresToday: 0,
      availableCleanRooms: 0,
    }
  );
  const [loading, setLoading] = useState(initialBookings.length === 0);

  const [filters, setFilters] = useState<FrontDeskFilters>({
    stream: "all",
    search: "",
    floor: "all",
  });

  // Load real-time data
  const loadData = async () => {
    try {
      const data = await frontDeskService.getFrontDeskStays();
      setBookings(data.bookings);
      setRooms(data.rooms);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to load front desk data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute available floors
  const availableFloors = useMemo(() => {
    const set = new Set<number>();
    rooms.forEach((r) => set.add(r.floor));
    return Array.from(set).sort((a, b) => a - b);
  }, [rooms]);

  // Check-In handler
  const handleCheckIn = async (stayId: string) => {
    try {
      await frontDeskService.checkInGuest(stayId);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Check-Out handler
  const handleCheckOut = async (stayId: string) => {
    try {
      await frontDeskService.checkOutGuest(stayId);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered stays
  const displayedStays = useMemo(() => {
    return bookings.filter((stay) => {
      // 1. Stream filter
      if (filters.stream === "arrivals") {
        const isArrival =
          stay.checkIn === SYSTEM_DATE &&
          (stay.status === "confirmed" || stay.status === "reserved");
        if (!isArrival) return false;
      } else if (filters.stream === "in_house") {
        if (stay.status !== "checked_in") return false;
      } else if (filters.stream === "departures") {
        const isDeparture =
          stay.checkOut === SYSTEM_DATE &&
          (stay.status === "checked_in" || stay.status === "checked_out");
        if (!isDeparture) return false;
      } else {
        // "all" stream: include arrivals today, in-house, and departures today
        const isArrival =
          stay.checkIn === SYSTEM_DATE &&
          (stay.status === "confirmed" || stay.status === "reserved");
        const isInHouse = stay.status === "checked_in";
        const isDeparture = stay.checkOut === SYSTEM_DATE;
        if (!isArrival && !isInHouse && !isDeparture) return false;
      }

      // 2. Floor filter
      if (filters.floor !== "all") {
        const room = rooms.find(
          (r) => r.id === stay.roomId || r.roomNumber === stay.roomNumber
        );
        if (room && String(room.floor) !== filters.floor) return false;
      }

      // 3. Search query
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const match =
          stay.guestName.toLowerCase().includes(q) ||
          stay.roomNumber.toLowerCase().includes(q) ||
          stay.bookingCode.toLowerCase().includes(q) ||
          stay.roomName.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [bookings, rooms, filters]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-normal text-muted-foreground animate-pulse">
        Loading Front Desk operations...
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Toolbar: Search + Floor + Walk-In + Stream Tabs */}
      <FrontDeskToolbar
        filters={filters}
        stats={stats}
        availableFloors={availableFloors}
        totalFilteredCount={displayedStays.length}
        onFilterChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      />

      {/* Stays List Stream */}
      {displayedStays.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {displayedStays.map((stay) => {
            const room = rooms.find(
              (r) => r.id === stay.roomId || r.roomNumber === stay.roomNumber
            );
            return (
              <StayCard
                key={stay.id}
                stay={stay}
                room={room}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3 rounded-[18px] bg-white/45 backdrop-blur-xl border border-white/65 p-8 dark:bg-white/[0.05] dark:border-white/15 shadow-sm">
          <h3 className="font-heading text-base font-bold text-foreground">
            No matching stays in this stream
          </h3>
          <p className="text-xs font-normal text-muted-foreground max-w-md mx-auto">
            {filters.search
              ? `No guest or room matching "${filters.search}" was found.`
              : "There are currently no active operations in this stream category."}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/frontdesk/walk-in"
              className={buttonVariants({
                variant: "primary-glass",
                size: "sm",
                className: "gap-1.5 text-xs font-bold",
              })}
            >
              <Plus className="size-3.5" />
              <span>Register Walk-In Guest</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
