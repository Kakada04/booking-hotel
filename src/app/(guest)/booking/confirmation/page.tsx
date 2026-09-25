import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingConfirmationView } from "@/features/guest/booking/booking-confirmation-view";

export const metadata: Metadata = {
  title: "Booking Confirmed — SrokHotel",
  description: "Your booking at SrokHotel is confirmed. View your booking details.",
};

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading confirmation…</div>}>
      <BookingConfirmationView />
    </Suspense>
  );
}
