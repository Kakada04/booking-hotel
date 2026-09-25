"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Room } from "@/features/admin/rooms/types";
import { roomService } from "@/features/admin/rooms/room.service";
import {
  BookingStay,
  CalendarFilters,
  CalendarViewMode,
  BookingStatus,
} from "../types";
import { calendarService } from "../calendar.service";
import { CalendarToolbar } from "./calendar-toolbar";
import { CalendarGrid } from "./calendar-grid";
import { StayQuickView } from "./stay-quick-view";

const SYSTEM_TODAY = "2026-09-25";

interface CalendarViewProps {
  initialRooms?: Room[];
  initialBookings?: BookingStay[];
}

export function CalendarView({
  initialRooms = [],
  initialBookings = [],
}: CalendarViewProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [bookings, setBookings] = useState<BookingStay[]>(initialBookings);
  const [loading, setLoading] = useState(initialRooms.length === 0);

  // Calendar View Window: Start 1 day before today for immediate visual context
  const [startDate, setStartDate] = useState<Date>(() => new Date(2026, 8, 24)); // Sep 24, 2026
  const [viewMode, setViewMode] = useState<CalendarViewMode>("14");
  const [selectedStay, setSelectedStay] = useState<BookingStay | null>(null);

  // Auto-switch to 7-day view on small screens
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 640) {
        setViewMode((prev) => (prev === "14" || prev === "30" ? "7" : prev));
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [filters, setFilters] = useState<CalendarFilters>({
    floor: "all",
    roomType: "all",
    search: "",
  });

  // Load real-time / local storage data
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedRooms, loadedBookings] = await Promise.all([
          roomService.getRooms(),
          calendarService.getBookings(),
        ]);
        setRooms(loadedRooms);
        setBookings(loadedBookings);
      } catch (err) {
        console.error("Failed to load calendar data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute available floors and types
  const availableFloors = useMemo(() => {
    const set = new Set<number>();
    rooms.forEach((r) => set.add(r.floor));
    return Array.from(set).sort((a, b) => a - b);
  }, [rooms]);

  const availableTypes = useMemo(() => {
    const map = new Map<string, string>();
    rooms.forEach((r) => {
      if (!map.has(r.typeId)) {
        map.set(r.typeId, r.typeName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rooms]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Floor filter
      if (filters.floor !== "all" && String(room.floor) !== filters.floor) {
        return false;
      }
      // Room Type filter
      if (filters.roomType !== "all" && room.typeId !== filters.roomType) {
        return false;
      }
      // Search filter (room number, room name, or guest name staying in room)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchesRoom =
          room.roomNumber.toLowerCase().includes(q) ||
          room.name.toLowerCase().includes(q) ||
          room.typeName.toLowerCase().includes(q);

        if (matchesRoom) return true;

        // Check if any booking in this room matches guest name
        const matchesGuest = bookings.some(
          (b) =>
            (b.roomId === room.id || b.roomNumber === room.roomNumber) &&
            (b.guestName.toLowerCase().includes(q) ||
              b.bookingCode.toLowerCase().includes(q))
        );
        return matchesGuest;
      }
      return true;
    });
  }, [rooms, bookings, filters]);

  // Date Navigation
  const handleNavigate = (direction: "prev" | "next" | "today") => {
    const daysStep = parseInt(viewMode, 10);
    if (direction === "today") {
      setStartDate(new Date(2026, 8, 24));
      return;
    }

    setStartDate((prev) => {
      const next = new Date(prev);
      const delta = direction === "next" ? daysStep : -daysStep;
      next.setDate(prev.getDate() + delta);
      return next;
    });
  };

  // Status update micro-action
  const handleStatusUpdate = async (id: string, newStatus: BookingStatus) => {
    try {
      const updated = await calendarService.updateBookingStatus(id, newStatus);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      if (selectedStay && selectedStay.id === id) {
        setSelectedStay(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-normal text-muted-foreground animate-pulse">
        Loading Timeline Booking Calendar...
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Navigation, View Switcher & Filter Toolbar */}
      <CalendarToolbar
        startDate={startDate}
        viewMode={viewMode}
        filters={filters}
        availableFloors={availableFloors}
        availableTypes={availableTypes}
        onNavigate={handleNavigate}
        onViewModeChange={setViewMode}
        onFiltersChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      />

      {/* Main Gantt Timeline Grid */}
      <CalendarGrid
        rooms={filteredRooms}
        bookings={bookings}
        startDate={startDate}
        viewMode={viewMode}
        todayStr={SYSTEM_TODAY}
        onSelectStay={setSelectedStay}
      />

      {/* Quick Stay Slide-out Preview */}
      <StayQuickView
        stay={selectedStay}
        onClose={() => setSelectedStay(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
