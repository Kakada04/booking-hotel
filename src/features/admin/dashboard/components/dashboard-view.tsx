"use client";

import React, { useState, useEffect } from "react";
import {
  DashboardSummary,
  ArrivalItem,
  DepartureItem,
  RoomStatusBreakdown,
} from "../types";
import { BookingStay } from "@/features/admin/calendar/types";
import { dashboardService } from "../dashboard.service";
import { DashboardKPIs } from "./dashboard-kpis";
import { DashboardQuickActions } from "./dashboard-quick-actions";
import { TodayArrivalsCard } from "./today-arrivals-card";
import { TodayDeparturesCard } from "./today-departures-card";
import { RoomStatusOverview } from "./room-status-overview";
import { RecentBookingsCard } from "./recent-bookings-card";

interface DashboardViewProps {
  initialSummary?: DashboardSummary;
  initialArrivals?: ArrivalItem[];
  initialDepartures?: DepartureItem[];
  initialRoomStatus?: RoomStatusBreakdown;
  initialRecentBookings?: BookingStay[];
}

export function DashboardView({
  initialSummary,
  initialArrivals = [],
  initialDepartures = [],
  initialRoomStatus,
  initialRecentBookings = [],
}: DashboardViewProps) {
  const [summary, setSummary] = useState<DashboardSummary>(
    initialSummary || {
      availableRooms: 0,
      occupiedRooms: 0,
      reservedRooms: 0,
      dirtyRooms: 0,
      arrivalsToday: 0,
      departuresToday: 0,
      todayRevenue: 0,
      outstandingBalance: 0,
    }
  );
  const [arrivals, setArrivals] = useState<ArrivalItem[]>(initialArrivals);
  const [departures, setDepartures] = useState<DepartureItem[]>(initialDepartures);
  const [roomStatus, setRoomStatus] = useState<RoomStatusBreakdown>(
    initialRoomStatus || {
      available: 0,
      reserved: 0,
      occupied: 0,
      dirty: 0,
      cleaning: 0,
      maintenance: 0,
      total: 0,
    }
  );
  const [recentBookings, setRecentBookings] = useState<BookingStay[]>(
    initialRecentBookings
  );
  const [loading, setLoading] = useState(!initialSummary);

  const loadData = async () => {
    try {
      const data = await dashboardService.getDashboardData();
      setSummary(data.summary);
      setArrivals(data.arrivals);
      setDepartures(data.departures);
      setRoomStatus(data.roomStatus);
      setRecentBookings(data.recentBookings);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async (id: string) => {
    try {
      await dashboardService.checkInGuest(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      await dashboardService.checkOutGuest(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm font-normal text-muted-foreground animate-pulse">
        Loading Operations Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* 1. Quick Actions Bar */}
      <DashboardQuickActions />

      {/* 2. 8 Summary KPI Cards */}
      <DashboardKPIs summary={summary} />

      {/* 3. Today's Operations: Arrivals & Departures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodayArrivalsCard arrivals={arrivals} onCheckIn={handleCheckIn} />
        <TodayDeparturesCard departures={departures} onCheckOut={handleCheckOut} />
      </div>

      {/* 4. Room Status Overview Breakdown */}
      <RoomStatusOverview roomStatus={roomStatus} />

      {/* 5. Recent Bookings Table */}
      <RecentBookingsCard bookings={recentBookings} />
    </div>
  );
}
