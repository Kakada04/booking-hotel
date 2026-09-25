import { BookingStay, BookingStatus, PaymentStatus } from "@/features/admin/calendar/types";

export type FrontDeskStream = "all" | "arrivals" | "in_house" | "departures";

export interface FrontDeskStatsData {
  arrivalsToday: number;
  inHouseCount: number;
  departuresToday: number;
  availableCleanRooms: number;
}

export interface FrontDeskFilters {
  stream: FrontDeskStream;
  search: string;
  floor: string;
}

export interface WalkInInput {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  idNumber?: string;
  roomId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  pricePerNight: number;
  totalPrice: number;
  paymentMethod: "cash" | "khqr" | "aba" | "credit_card";
  paymentStatus: PaymentStatus;
  keycardId: string;
  notes?: string;
}

export interface FolioChargeItem {
  id: string;
  date: string;
  description: string;
  category: "room" | "minibar" | "dining" | "laundry" | "other";
  amount: number;
}
