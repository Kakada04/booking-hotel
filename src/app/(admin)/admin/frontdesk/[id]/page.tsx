"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { calendarService, BookingStay } from "@/features/admin/calendar";
import { StayDetailView } from "@/features/admin/frontdesk";

export default function StayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const stayId = unwrappedParams.id;
  const [stay, setStay] = useState<BookingStay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStay() {
      try {
        const found = await calendarService.getBookingById(stayId);
        setStay(found);
      } catch (err) {
        console.error("Failed to load stay record:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStay();
  }, [stayId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-normal text-muted-foreground animate-pulse">
        Loading guest stay & folio #{stayId}...
      </div>
    );
  }

  if (!stay) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 rounded-[18px] bg-white/45 backdrop-blur-xl border border-white/65 p-8 shadow-sm">
        <h2 className="font-heading text-base font-bold text-foreground">Stay not found</h2>
        <p className="text-xs font-normal text-muted-foreground">
          The requested stay record (&quot;{stayId}&quot;) could not be located at the Front Desk.
        </p>
        <div>
          <Link
            href="/admin/frontdesk"
            className={buttonVariants({
              variant: "glass",
              size: "sm",
              className: "gap-1.5 font-bold text-xs",
            })}
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Front Desk</span>
          </Link>
        </div>
      </div>
    );
  }

  return <StayDetailView initialStay={stay} />;
}
