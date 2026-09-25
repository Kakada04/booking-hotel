"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrivalItem } from "../types";

interface TodayArrivalsCardProps {
  arrivals: ArrivalItem[];
  onCheckIn: (id: string) => void;
}

export function TodayArrivalsCard({
  arrivals,
  onCheckIn,
}: TodayArrivalsCardProps) {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-white/40 dark:border-white/10 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Today&apos;s Arrivals
          </CardTitle>
          <p className="text-xs font-normal text-muted-foreground mt-0.5">
            Expected check-ins scheduled for today
          </p>
        </div>
        <Link
          href="/admin/frontdesk?stream=arrivals"
          className={buttonVariants({
            variant: "glass",
            size: "icon-xs",
            className: "text-muted-foreground hover:text-foreground",
          })}
          title="View all arrivals"
        >
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex-1">
        {arrivals.length > 0 ? (
          <div className="space-y-3">
            {arrivals.map((arr) => {
              const isCheckedIn = arr.status === "checked_in";
              return (
                <div
                  key={arr.id}
                  className="p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 space-y-2 dark:bg-white/[0.03] dark:border-white/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-normal text-muted-foreground block">
                        {arr.bookingCode} · ETA {arr.arrivalTime}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        {arr.guestName}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-xs text-foreground block">
                        Room {arr.roomNumber}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground truncate max-w-[110px] block">
                        {arr.roomName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/30 dark:border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-normal text-muted-foreground">Payment:</span>
                      <Badge
                        variant={arr.paymentStatus === "paid" ? "available" : "secondary"}
                        className="text-xs font-bold capitalize"
                      >
                        {arr.paymentStatus}
                      </Badge>
                    </div>

                    <div>
                      {isCheckedIn ? (
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" />
                          <span>Checked In</span>
                        </span>
                      ) : (
                        <Button
                          variant="primary-glass"
                          size="xs"
                          onClick={() => onCheckIn(arr.id)}
                          className="text-xs font-bold px-3"
                        >
                          Check In
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-normal text-muted-foreground">
            No further arrivals scheduled for today.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
