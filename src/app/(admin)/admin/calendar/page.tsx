import React from "react";
import { Metadata } from "next";
import { CalendarView } from "@/features/admin/calendar";
import initialRoomsData from "@/features/admin/rooms/mockdata.json";
import initialBookingsData from "@/features/admin/calendar/mockdata.json";
import { Room } from "@/features/admin/rooms/types";
import { BookingStay } from "@/features/admin/calendar/types";

export const metadata: Metadata = {
  title: "Timeline Booking Calendar | SrokHotel PMS",
  description: "Real-time room availability, timeline calendar, and reservation management.",
};

export default function CalendarPage() {
  return (
    <CalendarView
      initialRooms={initialRoomsData as Room[]}
      initialBookings={initialBookingsData as BookingStay[]}
    />
  );
}
