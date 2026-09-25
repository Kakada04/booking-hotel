"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarStatsData } from "../types";

interface CalendarStatsProps {
  stats: CalendarStatsData;
}

export function CalendarStats({ stats }: CalendarStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* Occupancy Rate */}
      <Card className="py-3 px-4">
        <CardContent className="p-0 space-y-1">
          <p className="text-xs font-normal text-muted-foreground">Occupancy Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground">
              {stats.occupancyRate}%
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              of {stats.totalRooms} rooms
            </span>
          </div>
        </CardContent>
      </Card>

      {/* In-House Stays */}
      <Card className="py-3 px-4">
        <CardContent className="p-0 space-y-1">
          <p className="text-xs font-normal text-muted-foreground">In-House Stays</p>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-primary">
              {stats.inHouseCount}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              active units
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Arrivals Today */}
      <Card className="py-3 px-4">
        <CardContent className="p-0 space-y-1">
          <p className="text-xs font-normal text-muted-foreground">Arrivals Today</p>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground">
              {stats.arrivalsToday}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              expected check-ins
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Departures Today */}
      <Card className="py-3 px-4">
        <CardContent className="p-0 space-y-1">
          <p className="text-xs font-normal text-muted-foreground">Departures Today</p>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground">
              {stats.departuresToday}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              due check-outs
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
