import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingCheckoutForm } from "@/features/guest/booking/booking-checkout-form";

export const metadata: Metadata = {
  title: "Complete Your Booking — SrokHotel",
  description: "Enter your details to complete your hotel booking at SrokHotel.",
};

export default function BookingCheckoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Complete Your Booking</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in your details to confirm your reservation.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <BookingCheckoutForm />
      </Suspense>
    </div>
  );
}
