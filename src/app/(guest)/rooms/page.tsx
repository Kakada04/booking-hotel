import { Suspense } from "react";
import { format, addDays } from "date-fns";
import type { Metadata } from "next";
import { AvailableRoomsList } from "@/features/guest/rooms/available-rooms-list";

export const metadata: Metadata = {
  title: "Available Rooms — SrokHotel",
  description: "Browse available rooms and suites at SrokHotel. Compare prices, amenities, and book your perfect room.",
};

function getDefaultDate(daysOffset: number) {
  return format(addDays(new Date(), daysOffset), "yyyy-MM-dd");
}

export default async function AvailableRoomsPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string; adults?: string; children?: string }>;
}) {
  const params = await searchParams;
  const checkIn = params.checkIn ?? getDefaultDate(0);
  const checkOut = params.checkOut ?? getDefaultDate(1);
  const adults = Number(params.adults ?? 2);
  const children = Number(params.children ?? 0);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Available Rooms</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Showing rooms available for your selected dates.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading rooms…</div>}>
        <AvailableRoomsList
          checkIn={checkIn}
          checkOut={checkOut}
          adults={adults}
          children={children}
        />
      </Suspense>
    </div>
  );
}
