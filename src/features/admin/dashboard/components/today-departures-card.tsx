"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { DepartureItem } from "../types";

interface TodayDeparturesCardProps {
  departures: DepartureItem[];
  onCheckOut: (id: string) => void;
}

export function TodayDeparturesCard({
  departures,
  onCheckOut,
}: TodayDeparturesCardProps) {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-white/40 dark:border-white/10 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Today&apos;s Departures
          </CardTitle>
          <p className="text-xs font-normal text-muted-foreground mt-0.5">
            Due check-outs scheduled for departure today
          </p>
        </div>
        <Link
          href="/admin/frontdesk?stream=departures"
          className={buttonVariants({
            variant: "glass",
            size: "icon-xs",
            className: "text-muted-foreground hover:text-foreground",
          })}
          title="View all departures"
        >
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex-1">
        {departures.length > 0 ? (
          <div className="space-y-3">
            {departures.map((dep) => {
              const isCheckedOut = dep.status === "checked_out";
              return (
                <div
                  key={dep.id}
                  className="p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 space-y-2 dark:bg-white/[0.03] dark:border-white/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-normal text-muted-foreground block">
                        {dep.bookingCode}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        {dep.guestName}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-xs text-foreground block">
                        Room {dep.roomNumber}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground truncate max-w-[110px] block">
                        {dep.roomName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/30 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-normal text-muted-foreground">Folio Balance:</span>
                      <span
                        className={`font-bold ${
                          dep.balance === 0 ? "text-foreground" : "text-primary"
                        }`}
                      >
                        ${dep.balance.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      {isCheckedOut ? (
                        <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-muted-foreground" />
                          <span>Departed</span>
                        </span>
                      ) : (
                        <Button
                          variant="glass"
                          size="xs"
                          onClick={() => onCheckOut(dep.id)}
                          className="text-xs font-bold px-3 text-primary"
                        >
                          Check Out
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
            No further departures scheduled for today.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
