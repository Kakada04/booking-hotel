import { BookingStatus, PaymentStatus, BookingSource, BookingStay } from "@/features/admin/calendar/types";
import { Room } from "@/features/admin/rooms/types";

export interface DashboardSummary {
  availableRooms: number;
  occupiedRooms: number;
  reservedRooms: number;
  dirtyRooms: number;
  arrivalsToday: number;
  departuresToday: number;
  todayRevenue: number;
  outstandingBalance: number;
}

export interface ArrivalItem {
  id: string;
  bookingCode: string;
  guestName: string;
  guestPhone?: string;
  roomId: string;
  roomNumber: string;
  roomName: string;
  arrivalTime: string;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
}

export interface DepartureItem {
  id: string;
  bookingCode: string;
  guestName: string;
  roomId: string;
  roomNumber: string;
  roomName: string;
  balance: number;
  status: BookingStatus;
}

export interface RoomStatusBreakdown {
  available: number;
  reserved: number;
  occupied: number;
  dirty: number;
  cleaning: number;
  maintenance: number;
  total: number;
}
