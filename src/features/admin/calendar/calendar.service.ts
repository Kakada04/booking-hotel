import initialBookingsData from "./mockdata.json";
import { BookingStay, CalendarStatsData, BookingStatus } from "./types";
import { Room } from "@/features/admin/rooms/types";

const BOOKINGS_STORAGE_KEY = "srokhotel_bookings_data_v1";

let inMemoryBookings: BookingStay[] = [...(initialBookingsData as BookingStay[])];

function getStoredBookings(): BookingStay[] {
  if (typeof window === "undefined") {
    return inMemoryBookings;
  }
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(initialBookingsData));
      return [...(initialBookingsData as BookingStay[])];
    }
    return JSON.parse(raw) as BookingStay[];
  } catch {
    return inMemoryBookings;
  }
}

function saveBookings(bookings: BookingStay[]): void {
  inMemoryBookings = bookings;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // ignore storage errors
    }
  }
}

export function calculateCalendarStats(
  bookings: BookingStay[],
  rooms: Room[],
  currentDateStr = "2026-09-25"
): CalendarStatsData {
  const totalRooms = rooms.length || 1;

  // In-house guests today
  const inHouseCount = bookings.filter(
    (b) =>
      b.status === "checked_in" &&
      b.checkIn <= currentDateStr &&
      b.checkOut >= currentDateStr
  ).length;

  // Arrivals today
  const arrivalsToday = bookings.filter(
    (b) =>
      b.checkIn === currentDateStr &&
      (b.status === "confirmed" || b.status === "reserved" || b.status === "checked_in")
  ).length;

  // Departures today
  const departuresToday = bookings.filter(
    (b) => b.checkOut === currentDateStr
  ).length;

  // Occupancy rate calculation for today
  const occupiedRoomsToday = bookings.filter(
    (b) =>
      (b.status === "checked_in" || b.status === "confirmed") &&
      b.checkIn <= currentDateStr &&
      b.checkOut > currentDateStr
  ).length;

  const occupancyRate = Math.min(100, Math.round((occupiedRoomsToday / totalRooms) * 100));

  return {
    occupancyRate,
    inHouseCount,
    arrivalsToday,
    departuresToday,
    totalRooms,
  };
}

export const calendarService = {
  async getBookings(): Promise<BookingStay[]> {
    return getStoredBookings();
  },

  async getBookingById(id: string): Promise<BookingStay | null> {
    const all = getStoredBookings();
    return all.find((b) => b.id === id || b.bookingCode === id) || null;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<BookingStay> {
    const all = getStoredBookings();
    const idx = all.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Booking not found");
    const updated = { ...all[idx], status };
    all[idx] = updated;
    saveBookings(all);
    return updated;
  },

  async deleteBooking(id: string): Promise<boolean> {
    const all = getStoredBookings();
    const filtered = all.filter((b) => b.id !== id);
    saveBookings(filtered);
    return true;
  },
};
