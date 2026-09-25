import { calendarService } from "@/features/admin/calendar/calendar.service";
import { roomService } from "@/features/admin/rooms/room.service";
import { BookingStay } from "@/features/admin/calendar/types";
import { Room } from "@/features/admin/rooms/types";
import { FrontDeskStatsData, WalkInInput } from "./types";

export const SYSTEM_DATE = "2026-09-25";

export const frontDeskService = {
  async getFrontDeskStays(): Promise<{
    bookings: BookingStay[];
    rooms: Room[];
    stats: FrontDeskStatsData;
  }> {
    const [bookings, rooms] = await Promise.all([
      calendarService.getBookings(),
      roomService.getRooms(),
    ]);

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

    const stats: FrontDeskStatsData = {
      arrivalsToday: arrivals.length,
      inHouseCount: inHouse.length,
      departuresToday: departures.length,
      availableCleanRooms,
    };

    return { bookings, rooms, stats };
  },

  async checkInGuest(bookingId: string): Promise<BookingStay> {
    const updatedStay = await calendarService.updateBookingStatus(
      bookingId,
      "checked_in"
    );

    // Update corresponding room to occupied
    try {
      const rooms = await roomService.getRooms();
      const targetRoom = rooms.find(
        (r) => r.id === updatedStay.roomId || r.roomNumber === updatedStay.roomNumber
      );
      if (targetRoom) {
        await roomService.updateRoomStatus(targetRoom.id, "occupied");
      }
    } catch (err) {
      console.error("Failed to sync room status upon check-in:", err);
    }

    return updatedStay;
  },

  async checkOutGuest(bookingId: string): Promise<BookingStay> {
    const updatedStay = await calendarService.updateBookingStatus(
      bookingId,
      "checked_out"
    );

    // Update corresponding room to dirty & housekeeping status to dirty
    try {
      const rooms = await roomService.getRooms();
      const targetRoom = rooms.find(
        (r) => r.id === updatedStay.roomId || r.roomNumber === updatedStay.roomNumber
      );
      if (targetRoom) {
        await roomService.updateRoomStatus(targetRoom.id, "dirty");
        await roomService.updateHousekeepingStatus(targetRoom.id, "dirty");
      }
    } catch (err) {
      console.error("Failed to sync room status upon check-out:", err);
    }

    return updatedStay;
  },

  async createWalkIn(input: WalkInInput): Promise<BookingStay> {
    const bookings = await calendarService.getBookings();
    const rooms = await roomService.getRooms();
    const room = rooms.find((r) => r.id === input.roomId);

    if (!room) throw new Error("Selected room not found");

    const id = `bk-${Date.now()}`;
    const bookingCode = `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStay: BookingStay = {
      id,
      bookingCode,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomName: room.name,
      guestName: input.guestName,
      guestPhone: input.guestPhone,
      guestEmail: input.guestEmail,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      status: "checked_in",
      totalPrice: input.totalPrice,
      nights: input.nights,
      adults: input.adults,
      children: input.children,
      paymentStatus: input.paymentStatus,
      source: "walk_in",
      notes: input.notes,
    };

    const updatedBookings = [newStay, ...bookings];
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "srokhotel_bookings_data_v1",
        JSON.stringify(updatedBookings)
      );
    }

    // Set room to occupied
    await roomService.updateRoomStatus(room.id, "occupied");

    return newStay;
  },
};
