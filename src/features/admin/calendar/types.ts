export type BookingStatus =
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "reserved"
  | "cancelled";

export type PaymentStatus = "paid" | "partial" | "unpaid";

export type BookingSource = "direct" | "walk_in" | "ota" | "website";

export interface BookingStay {
  id: string;
  bookingCode: string;
  roomId: string;
  roomNumber: string;
  roomName: string;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  status: BookingStatus;
  totalPrice: number;
  nights: number;
  adults: number;
  children: number;
  paymentStatus: PaymentStatus;
  source: BookingSource;
  notes?: string;
}

export type CalendarViewMode = "7" | "14" | "30";

export interface CalendarFilters {
  floor: string;
  roomType: string;
  search: string;
}

export interface CalendarStatsData {
  occupancyRate: number;
  inHouseCount: number;
  arrivalsToday: number;
  departuresToday: number;
  totalRooms: number;
}
