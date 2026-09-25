import React from "react";
import { Metadata } from "next";
import { DashboardView } from "@/features/admin/dashboard";
import initialRoomsData from "@/features/admin/rooms/mockdata.json";
import initialBookingsData from "@/features/admin/calendar/mockdata.json";
import { Room } from "@/features/admin/rooms/types";
import { BookingStay } from "@/features/admin/calendar/types";

export const metadata: Metadata = {
  title: "Dashboard | SrokHotel PMS",
  description: "Real-time hotel operations, revenue overview, room status, and arrivals.",
};

export default function DashboardPage() {
  const rooms = initialRoomsData as Room[];
  const bookings = initialBookingsData as BookingStay[];
  const SYSTEM_TODAY = "2026-09-25";

  // Initial SSR Computations
  const available = rooms.filter((r) => r.status === "available").length;
  const reserved = rooms.filter((r) => r.status === "reserved").length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const dirty = rooms.filter((r) => r.status === "dirty" || r.housekeepingStatus === "dirty").length;
  const cleaning = rooms.filter((r) => r.status === "cleaning" || r.housekeepingStatus === "cleaning").length;
  const maintenance = rooms.filter((r) => r.status === "maintenance" || r.status === "out_of_order").length;

  const rawArrivals = bookings.filter(
    (b) => b.checkIn === SYSTEM_TODAY && (b.status === "confirmed" || b.status === "reserved")
  );
  const rawDepartures = bookings.filter(
    (b) => b.checkOut === SYSTEM_TODAY && (b.status === "checked_in" || b.status === "checked_out")
  );

  const arrivalTimes = ["11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];
  const initialArrivals = rawArrivals.map((b, idx) => ({
    id: b.id,
    bookingCode: b.bookingCode,
    guestName: b.guestName,
    guestPhone: b.guestPhone,
    roomId: b.roomId,
    roomNumber: b.roomNumber,
    roomName: b.roomName,
    arrivalTime: arrivalTimes[idx % arrivalTimes.length],
    paymentStatus: b.paymentStatus,
    status: b.status,
  }));

  const initialDepartures = rawDepartures.map((b) => ({
    id: b.id,
    bookingCode: b.bookingCode,
    guestName: b.guestName,
    roomId: b.roomId,
    roomNumber: b.roomNumber,
    roomName: b.roomName,
    balance: b.paymentStatus === "paid" ? 0 : Math.round(b.totalPrice * 0.5),
    status: b.status,
  }));

  const initialSummary = {
    availableRooms: available,
    occupiedRooms: occupied,
    reservedRooms: reserved,
    dirtyRooms: dirty,
    arrivalsToday: initialArrivals.length,
    departuresToday: initialDepartures.filter((d) => d.status === "checked_in").length,
    todayRevenue: 1420,
    outstandingBalance: 210,
  };

  const initialRoomStatus = {
    available,
    reserved,
    occupied,
    dirty,
    cleaning,
    maintenance,
    total: rooms.length,
  };

  const initialRecentBookings = [...bookings].slice(0, 6);

  return (
    <DashboardView
      initialSummary={initialSummary}
      initialArrivals={initialArrivals}
      initialDepartures={initialDepartures}
      initialRoomStatus={initialRoomStatus}
      initialRecentBookings={initialRecentBookings}
    />
  );
}
