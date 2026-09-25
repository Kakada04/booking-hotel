import type { Metadata } from "next";
import { MyBookingSearch } from "@/features/guest/my-booking/my-booking-search";

export const metadata: Metadata = {
  title: "My Booking — SrokHotel",
  description: "Find and manage your hotel reservation at SrokHotel.",
};

export default function MyBookingSearchPage() {
  return <MyBookingSearch />;
}
