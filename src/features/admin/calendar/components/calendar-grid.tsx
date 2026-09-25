"use client";

import React from "react";
import Link from "next/link";
import { Room } from "@/features/admin/rooms/types";
import { BookingStay, CalendarViewMode } from "../types";
import { Badge } from "@/components/ui/badge";

interface CalendarGridProps {
  rooms: Room[];
  bookings: BookingStay[];
  startDate: Date;
  viewMode: CalendarViewMode;
  todayStr?: string;
  onSelectStay: (stay: BookingStay) => void;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysDiff(d1: Date, d2: Date): number {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

function parseDateStr(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function CalendarGrid({
  rooms,
  bookings,
  startDate,
  viewMode,
  todayStr = "2026-09-25",
  onSelectStay,
}: CalendarGridProps) {
  const totalDays = parseInt(viewMode, 10);

  // Generate date array
  const dateColumns: { date: Date; dateStr: string; dayName: string; dayNum: number; isToday: boolean; isWeekend: boolean }[] = [];
  for (let i = 0; i < totalDays; i++) {
    const cur = new Date(startDate);
    cur.setDate(startDate.getDate() + i);
    const dateStr = formatDate(cur);
    const isToday = dateStr === todayStr;
    const dayOfWeek = cur.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    dateColumns.push({
      date: cur,
      dateStr,
      dayName: cur.toLocaleString("en-US", { weekday: "short" }),
      dayNum: cur.getDate(),
      isToday,
      isWeekend,
    });
  }

  const rangeEndDate = new Date(startDate);
  rangeEndDate.setDate(startDate.getDate() + totalDays);
  const rangeEndDateStr = formatDate(rangeEndDate);
  const rangeStartDateStr = formatDate(startDate);

  // Column width config
  const colMinWidth = totalDays === 7 ? "min-w-[120px]" : totalDays === 14 ? "min-w-[80px]" : "min-w-[42px]";

  return (
    <div className="relative rounded-[18px] bg-white/45 backdrop-blur-xl border border-white/65 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] overflow-hidden dark:bg-white/[0.05] dark:border-white/15">
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row: Room Label & Dates */}
          <div className="flex border-b border-white/50 bg-white/30 backdrop-blur-md sticky top-0 z-40 dark:border-white/10 dark:bg-white/[0.04]">
            {/* Sticky Rooms Column Header */}
            <div className="w-44 sm:w-52 shrink-0 p-3 sticky left-0 z-50 bg-white/80 backdrop-blur-xl border-r border-white/50 flex items-center justify-between dark:bg-slate-950/85 dark:border-white/10">
              <span className="font-heading text-xs font-bold text-foreground">
                Room Inventory
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {rooms.length} units
              </span>
            </div>

            {/* Date Headers */}
            <div className="flex flex-1">
              {dateColumns.map((col) => (
                <div
                  key={col.dateStr}
                  className={`flex-1 ${colMinWidth} p-2 text-center border-r border-white/30 dark:border-white/10 transition-colors ${
                    col.isToday
                      ? "bg-primary/15 font-bold text-primary dark:bg-primary/20"
                      : col.isWeekend
                      ? "bg-black/[0.02] dark:bg-white/[0.02]"
                      : ""
                  }`}
                >
                  <span className={`block text-xs uppercase tracking-wider ${col.isToday ? "font-bold text-primary" : "font-normal text-muted-foreground"}`}>
                    {col.dayName}
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span
                      className={`text-sm ${
                        col.isToday
                          ? "size-6 rounded-full bg-primary text-white font-bold flex items-center justify-center shadow-xs dark:text-sky-950"
                          : "font-bold text-foreground"
                      }`}
                    >
                      {col.dayNum}
                    </span>
                  </div>
                  {col.isToday && (
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest block -mt-0.5">
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Room Rows */}
          <div className="divide-y divide-white/40 dark:divide-white/10">
            {rooms.map((room) => {
              // Find matching bookings for this room that overlap the current date window
              const roomStays = bookings.filter((b) => {
                if (b.roomId !== room.id && b.roomNumber !== room.roomNumber) return false;
                return b.checkIn < rangeEndDateStr && b.checkOut > rangeStartDateStr;
              });

              return (
                <div
                  key={room.id}
                  className="flex items-stretch group/row hover:bg-white/20 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {/* Sticky Room Identification Column */}
                  <div className="w-44 sm:w-52 shrink-0 p-3 sticky left-0 z-30 bg-white/70 backdrop-blur-xl border-r border-white/50 flex flex-col justify-center dark:bg-slate-950/80 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/admin/rooms/${room.id}`}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        <span>Room {room.roomNumber}</span>
                      </Link>
                      <span className="text-xs font-normal text-muted-foreground">
                        Floor {room.floor}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="font-normal text-muted-foreground truncate max-w-[110px]">
                        {room.typeName}
                      </span>
                      <span
                        className={`size-2 rounded-full ${
                          room.housekeepingStatus === "clean"
                            ? "bg-emerald-500"
                            : room.housekeepingStatus === "dirty"
                            ? "bg-amber-500"
                            : "bg-cyan-500"
                        }`}
                        title={`Housekeeping: ${room.housekeepingStatus}`}
                      />
                    </div>
                  </div>

                  {/* Date Grid Cell Area with Overlaid Booking Bars */}
                  <div className="relative flex flex-1 h-14">
                    {/* Background Column Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {dateColumns.map((col) => (
                        <div
                          key={col.dateStr}
                          className={`flex-1 ${colMinWidth} border-r border-white/30 dark:border-white/10 ${
                            col.isToday
                              ? "bg-primary/[0.07] dark:bg-primary/10"
                              : col.isWeekend
                              ? "bg-black/[0.01] dark:bg-white/[0.01]"
                              : ""
                          }`}
                        />
                      ))}
                    </div>

                    {/* Empty Slot Click Targets (Link to Create Booking) */}
                    <div className="absolute inset-0 flex z-10">
                      {dateColumns.map((col) => (
                        <Link
                          key={col.dateStr}
                          href={`/admin/bookings/create?roomId=${room.id}&date=${col.dateStr}`}
                          className={`flex-1 ${colMinWidth} group/cell hover:bg-primary/10 transition-colors flex items-center justify-center`}
                          title={`Create booking for Room ${room.roomNumber} on ${col.dateStr}`}
                        >
                          <span className="opacity-0 group-hover/cell:opacity-100 text-xs font-bold text-primary transition-opacity select-none">
                            +
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Booking Stays Overlaid on top of cells */}
                    {roomStays.map((stay) => {
                      const stayCheckInDate = parseDateStr(stay.checkIn);
                      const stayCheckOutDate = parseDateStr(stay.checkOut);

                      const rawStart = daysDiff(startDate, stayCheckInDate);
                      const rawEnd = daysDiff(startDate, stayCheckOutDate);

                      const isCutLeft = rawStart < 0;
                      const isCutRight = rawEnd > totalDays;

                      const startIndex = Math.max(0, rawStart);
                      const endIndex = Math.min(totalDays, rawEnd);
                      const colSpan = Math.max(1, endIndex - startIndex);

                      const leftPercent = (startIndex / totalDays) * 100;
                      const widthPercent = (colSpan / totalDays) * 100;

                      // Frosted glass stay badge variant
                      const isCheckedIn = stay.status === "checked_in";
                      const isReserved = stay.status === "reserved";
                      const isCheckedOut = stay.status === "checked_out";

                      return (
                        <div
                          key={stay.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectStay(stay);
                          }}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          className={`absolute top-2 bottom-2 z-20 mx-1 px-2.5 flex items-center justify-between cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-md select-none backdrop-blur-xl border ${
                            isCutLeft ? "rounded-l-none" : "rounded-xl"
                          } ${isCutRight ? "rounded-r-none" : "rounded-xl"} ${
                            isCheckedIn
                              ? "bg-primary/30 border-primary/50 text-sky-950 dark:bg-primary/30 dark:text-sky-100 dark:border-primary/50 shadow-xs"
                              : isReserved
                              ? "bg-amber-400/25 border-amber-400/40 text-amber-950 dark:bg-amber-400/20 dark:text-amber-100"
                              : isCheckedOut
                              ? "bg-slate-200/60 border-slate-300/60 text-slate-800 dark:bg-white/10 dark:border-white/15 dark:text-slate-300"
                              : "bg-white/75 border-white/90 text-foreground dark:bg-white/15 dark:border-white/30 shadow-xs"
                          }`}
                          title={`${stay.guestName} (${stay.checkIn} to ${stay.checkOut})`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {isCheckedIn && (
                              <span className="size-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                            )}
                            <span className="text-xs font-bold truncate">
                              {stay.guestName}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-1 text-xs font-normal opacity-75">
                            <span>{stay.nights}n</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
