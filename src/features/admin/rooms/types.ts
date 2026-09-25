export type RoomStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "dirty"
  | "cleaning"
  | "maintenance"
  | "out_of_order";

export type HousekeepingStatus =
  | "clean"
  | "dirty"
  | "cleaning"
  | "inspecting";

export interface RoomCapacity {
  adults: number;
  children: number;
}

export interface CurrentGuest {
  name: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  bookingCode: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  typeId: string;
  typeName: string;
  floor: number;
  capacity: RoomCapacity;
  bedType: string;
  pricePerNight: number;
  status: RoomStatus;
  housekeepingStatus: HousekeepingStatus;
  amenities: string[];
  description: string;
  images: string[];
  currentGuest?: CurrentGuest;
  keycardId?: string;
  lastCleaned?: string;
}

export interface RoomFilter {
  search?: string;
  status?: string;
  floor?: string;
  type?: string;
  viewMode?: "grid" | "table";
}

export interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  dirty: number;
  cleaning: number;
  maintenance: number;
  occupancyRate: number;
}

export interface CreateRoomInput {
  roomNumber: string;
  name: string;
  typeId: string;
  typeName: string;
  floor: number;
  capacity: RoomCapacity;
  bedType: string;
  pricePerNight: number;
  status: RoomStatus;
  housekeepingStatus: HousekeepingStatus;
  amenities: string[];
  description: string;
  images: string[];
  keycardId?: string;
}
