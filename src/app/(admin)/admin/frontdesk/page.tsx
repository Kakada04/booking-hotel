import React from "react";
import { Metadata } from "next";
import { FrontDeskView } from "@/features/admin/frontdesk";
import initialRoomsData from "@/features/admin/rooms/mockdata.json";
import initialBookingsData from "@/features/admin/calendar/mockdata.json";
import { Room } from "@/features/admin/rooms/types";
import { BookingStay } from "@/features/admin/calendar/types";

export const metadata: Metadata = {
  title: "Front Desk Operations | SrokHotel PMS",
  description: "Live hotel arrivals, in-house guest stays, due departures, and walk-in check-in.",
};

export default function FrontDeskPage() {
  const rooms = initialRoomsData as Room[];
  const bookings = initialBookingsData as BookingStay[];

  const SYSTEM_DATE = "2026-09-25";

  const arrivals = bookings.filter(
    (b) =>
      b.checkIn === SYSTEM_DATE &&
      (b.status === "confirmed" || b.status === "reserved")
  );
  const inHouse = bookings.filter((b) => b.status === "checked_in");
  const departures = bookings.filter(
    (b) => b.checkOut === SYSTEM_DATE && b.status === "checked_in"
  );
  const availableCleanRooms = rooms.filter(
    (r) => r.status === "available" && r.housekeepingStatus === "clean"
  ).length;

  const initialStats = {
    arrivalsToday: arrivals.length,
    inHouseCount: inHouse.length,
    departuresToday: departures.length,
    availableCleanRooms,
  };

  return (
    <FrontDeskView
      initialBookings={bookings}
      initialRooms={rooms}
      initialStats={initialStats}
    />
  );
}
