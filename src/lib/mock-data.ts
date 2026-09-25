// ─── Mock Hotel Data ───────────────────────────────────────────────────────
export const HOTEL_INFO = {
  name: "SrokHotel",
  tagline: "Boutique Hotel & Resort",
  address: "Street 271, Sangkat Phsar Doeum Thkov, Phnom Penh, Cambodia",
  phone: "+855 12 345 678",
  telegram: "https://t.me/srokhotel",
  facebook: "https://m.me/srokhotel",
  checkinTime: "14:00",
  checkoutTime: "12:00",
  lat: 11.5564,
  lng: 104.9282,
};

// ─── Room Types ────────────────────────────────────────────────────────────
export type RoomType = {
  id: string;
  name: string;
  pricePerNight: number;
  maxGuests: number;
  bedType: string;
  roomSize: number; // sqm
  amenities: string[];
  description: string;
  image: string;
  availableRooms: number;
};

export const ROOM_TYPES: RoomType[] = [
  {
    id: "standard-double",
    name: "Standard Double Room",
    pricePerNight: 20,
    maxGuests: 2,
    bedType: "1 Queen Bed",
    roomSize: 22,
    amenities: ["Air Conditioner", "Wi-Fi", "Private Bathroom", "Hot Water", "TV"],
    description:
      "A cozy and comfortable standard room featuring a queen-size bed, modern amenities, and a lush garden view. Perfect for couples or solo travelers seeking a restful retreat.",
    image: "/room-standard.jpg",
    availableRooms: 3,
  },
  {
    id: "deluxe-king",
    name: "Deluxe King Room",
    pricePerNight: 40,
    maxGuests: 3,
    bedType: "1 King Bed",
    roomSize: 35,
    amenities: ["Air Conditioner", "Wi-Fi", "Private Bathroom", "Hot Water", "TV", "Mini Bar", "Balcony", "Safe Box"],
    description:
      "An elevated stay in our spacious Deluxe King room. Featuring premium bedding, a private balcony with panoramic views, and a marble-clad bathroom with luxury toiletries.",
    image: "/room-deluxe.jpg",
    availableRooms: 2,
  },
  {
    id: "grand-suite",
    name: "Grand Suite",
    pricePerNight: 85,
    maxGuests: 4,
    bedType: "1 King Bed + Sofa Bed",
    roomSize: 65,
    amenities: [
      "Air Conditioner",
      "Wi-Fi",
      "Private Bathroom",
      "Hot Water",
      "Smart TV",
      "Mini Bar",
      "Private Balcony",
      "Safe Box",
      "Bathtub",
      "Living Area",
      "Kitchenette",
    ],
    description:
      "The pinnacle of luxury at SrokHotel. Our Grand Suite offers an expansive living area, a separate bedroom with a king bed, and floor-to-ceiling windows overlooking the tropical landscape. An unforgettable experience.",
    image: "/room-suite.jpg",
    availableRooms: 1,
  },
];

// ─── Payment Policies ──────────────────────────────────────────────────────
export type PaymentPolicy = {
  type: "pay_on_arrival" | "partial" | "full";
  label: string;
  description: string;
  depositPercent: number; // 0 = pay on arrival, 50 = 50%, 100 = full
};

export const PAYMENT_POLICY: PaymentPolicy = {
  type: "partial",
  label: "50% Deposit Required",
  description: "50% of the total amount is required to confirm your booking. The remaining balance is due at the property.",
  depositPercent: 50,
};

// ─── Payment Methods ───────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { id: "khqr", label: "KHQR", icon: "qr_code" },
  { id: "aba", label: "ABA Pay", icon: "aba" },
  { id: "bank_transfer", label: "Bank Transfer", icon: "bank" },
];

// ─── Mock Booking (for confirmation & my-booking pages) ───────────────────
export type BookingStatus = "confirmed" | "pending" | "checked_in" | "checked_out" | "cancelled";
export type PaymentStatus = "paid" | "partial" | "unpaid";

export type Booking = {
  code: string;
  guestName: string;
  phone: string;
  email?: string;
  nationality?: string;
  specialRequest?: string;
  roomTypeId: string;
  roomTypeName: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  nights: number;
  adults: number;
  children: number;
  pricePerNight: number;
  total: number;
  paid: number;
  remaining: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  createdAt: string;
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    code: "BK-2026-00125",
    guestName: "Kakada",
    phone: "+85512345678",
    email: "kakada@example.com",
    nationality: "Cambodian",
    specialRequest: "Late check-in around 10 PM",
    roomTypeId: "standard-double",
    roomTypeName: "Standard Double Room",
    checkIn: "2026-09-25",
    checkOut: "2026-09-27",
    nights: 2,
    adults: 2,
    children: 0,
    pricePerNight: 20,
    total: 40,
    paid: 20,
    remaining: 20,
    status: "confirmed",
    paymentStatus: "partial",
    paymentMethod: "aba",
    createdAt: "2026-09-20T10:30:00Z",
  },
  {
    code: "BK-2026-00089",
    guestName: "Sophea",
    phone: "+85598765432",
    roomTypeId: "deluxe-king",
    roomTypeName: "Deluxe King Room",
    checkIn: "2026-10-05",
    checkOut: "2026-10-08",
    nights: 3,
    adults: 2,
    children: 1,
    pricePerNight: 40,
    total: 120,
    paid: 120,
    remaining: 0,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "khqr",
    createdAt: "2026-09-18T14:00:00Z",
  },
];
