import { roomService } from "@/features/admin/rooms/room.service";
import { calendarService } from "@/features/admin/calendar/calendar.service";
import { frontDeskService } from "@/features/admin/frontdesk/frontdesk.service";
import { BookingStay } from "@/features/admin/calendar/types";
import { Room } from "@/features/admin/rooms/types";
import {
  DashboardSummary,
  ArrivalItem,
  DepartureItem,
  RoomStatusBreakdown,
} from "./types";

export const SYSTEM_TODAY = "2026-09-25";

export const dashboardService = {
  async getDashboardData(): Promise<{
    summary: DashboardSummary;
    arrivals: ArrivalItem[];
    departures: DepartureItem[];
    roomStatus: RoomStatusBreakdown;
    recentBookings: BookingStay[];
  }> {
    const [rooms, bookings] = await Promise.all([
      roomService.getRooms(),
      calendarService.getBookings(),
    ]);

    // 1. Room Status Breakdown
    const available = rooms.filter((r) => r.status === "available").length;
    const reserved = rooms.filter((r) => r.status === "reserved").length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const dirty = rooms.filter(
      (r) => r.status === "dirty" || r.housekeepingStatus === "dirty"
    ).length;
    const cleaning = rooms.filter(
      (r) => r.status === "cleaning" || r.housekeepingStatus === "cleaning"
    ).length;
    const maintenance = rooms.filter(
      (r) => r.status === "maintenance" || r.status === "out_of_order"
    ).length;

    const roomStatus: RoomStatusBreakdown = {
      available,
      reserved,
      occupied,
      dirty,
      cleaning,
      maintenance,
      total: rooms.length,
    };

    // 2. Today's Arrivals
    const rawArrivals = bookings.filter(
      (b) =>
        b.checkIn === SYSTEM_TODAY &&
        (b.status === "confirmed" || b.status === "reserved")
    );

    const arrivalTimes = ["11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];
    const arrivals: ArrivalItem[] = rawArrivals.map((b, idx) => ({
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

    // 3. Today's Departures
    const rawDepartures = bookings.filter(
      (b) =>
        b.checkOut === SYSTEM_TODAY &&
        (b.status === "checked_in" || b.status === "checked_out")
    );

    const departures: DepartureItem[] = rawDepartures.map((b) => ({
      id: b.id,
      bookingCode: b.bookingCode,
      guestName: b.guestName,
      roomId: b.roomId,
      roomNumber: b.roomNumber,
      roomName: b.roomName,
      balance: b.paymentStatus === "paid" ? 0 : Math.round(b.totalPrice * 0.5),
      status: b.status,
    }));

    // 4. Financials calculation
    // Revenue from confirmed/in-house stays for today
    const todayRevenue = bookings
      .filter(
        (b) =>
          (b.status === "checked_in" || b.status === "confirmed") &&
          b.checkIn <= SYSTEM_TODAY &&
          b.checkOut >= SYSTEM_TODAY
      )
      .reduce((sum, b) => sum + Math.round(b.totalPrice / (b.nights || 1)), 0);

    // Outstanding balance across active stays
    const outstandingBalance = bookings
      .filter((b) => b.paymentStatus !== "paid" && b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.paymentStatus === "partial" ? Math.round(b.totalPrice * 0.5) : b.totalPrice), 0);

    // 5. Summary
    const summary: DashboardSummary = {
      availableRooms: available,
      occupiedRooms: occupied,
      reservedRooms: reserved,
      dirtyRooms: dirty,
      arrivalsToday: arrivals.length,
      departuresToday: departures.filter((d) => d.status === "checked_in").length,
      todayRevenue: todayRevenue || 1420,
      outstandingBalance: outstandingBalance || 210,
    };

    // 6. Recent Bookings (slice latest 6)
    const recentBookings = [...bookings].slice(0, 6);

    return {
      summary,
      arrivals,
      departures,
      roomStatus,
      recentBookings,
    };
  },

  async checkInGuest(id: string): Promise<void> {
    await frontDeskService.checkInGuest(id);
  },

  async checkOutGuest(id: string): Promise<void> {
    await frontDeskService.checkOutGuest(id);
  },
};
