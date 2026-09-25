"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { BookingStay, BookingStatus } from "@/features/admin/calendar/types";

interface RecentBookingsCardProps {
  bookings: BookingStay[];
}

export function RecentBookingsCard({ bookings }: RecentBookingsCardProps) {
  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case "checked_in":
        return "occupied";
      case "confirmed":
        return "available";
      case "reserved":
        return "gold";
      case "checked_out":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-white/40 dark:border-white/10 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Recent Bookings
          </CardTitle>
          <p className="text-xs font-normal text-muted-foreground mt-0.5">
            Latest incoming reservations and guest stay folios
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className={buttonVariants({
            variant: "glass",
            size: "icon-xs",
            className: "text-muted-foreground hover:text-foreground",
          })}
          title="View all bookings"
        >
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-white/40 dark:border-white/10">
              <tr>
                <th className="py-2.5 px-4 font-normal text-muted-foreground">Booking Code</th>
                <th className="py-2.5 px-4 font-normal text-muted-foreground">Guest</th>
                <th className="py-2.5 px-4 font-normal text-muted-foreground">Dates</th>
                <th className="py-2.5 px-4 font-normal text-muted-foreground">Room</th>
                <th className="py-2.5 px-4 font-normal text-muted-foreground">Source</th>
                <th className="py-2.5 px-4 font-normal text-muted-foreground text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30 dark:divide-white/10">
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-white/40 dark:hover:bg-white/[0.04] transition-colors group/row cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-primary">
                    <Link href={`/admin/bookings/${b.id}`} className="hover:underline">
                      {b.bookingCode}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-bold text-foreground">
                    <Link href={`/admin/bookings/${b.id}`}>
                      {b.guestName}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-normal text-muted-foreground whitespace-nowrap">
                    {b.checkIn} → {b.checkOut} ({b.nights}n)
                  </td>
                  <td className="py-3 px-4 font-bold text-foreground whitespace-nowrap">
                    Room {b.roomNumber}
                  </td>
                  <td className="py-3 px-4 font-normal text-muted-foreground capitalize">
                    {b.source}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge
                      variant={getStatusBadgeVariant(b.status)}
                      className="text-xs font-bold capitalize"
                    >
                      {b.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
