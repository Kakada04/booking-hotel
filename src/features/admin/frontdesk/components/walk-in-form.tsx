"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Room } from "@/features/admin/rooms/types";
import { roomService } from "@/features/admin/rooms/room.service";
import { frontDeskService, SYSTEM_DATE } from "../frontdesk.service";
import { WalkInInput } from "../types";

export function WalkInForm() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const [checkIn, setCheckIn] = useState(SYSTEM_DATE);
  const [checkOut, setCheckOut] = useState("2026-09-26");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<WalkInInput["paymentMethod"]>("khqr");
  const [paymentStatus, setPaymentStatus] = useState<WalkInInput["paymentStatus"]>("paid");
  const [notes, setNotes] = useState("");

  // Load available rooms
  useEffect(() => {
    async function load() {
      try {
        const allRooms = await roomService.getRooms();
        const available = allRooms.filter(
          (r) => r.status === "available" && r.housekeepingStatus === "clean"
        );
        setRooms(available);
        if (available.length > 0) {
          setSelectedRoomId(available[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRooms(false);
      }
    }
    load();
  }, []);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Calculate nights and total
  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 1
  );

  const pricePerNight = selectedRoom?.pricePerNight || 75;
  const totalPrice = pricePerNight * nights;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim() || !selectedRoomId) {
      alert("Please fill in the guest name, phone number, and select an available room.");
      return;
    }

    setSubmitting(true);
    try {
      await frontDeskService.createWalkIn({
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        guestEmail: guestEmail.trim() || undefined,
        idNumber: idNumber.trim() || undefined,
        roomId: selectedRoomId,
        checkIn,
        checkOut,
        nights,
        adults,
        children,
        pricePerNight,
        totalPrice,
        paymentMethod,
        paymentStatus,
        keycardId: `KC-${selectedRoom?.roomNumber || "101"}-W`,
        notes: notes.trim() || undefined,
      });

      router.push("/admin/frontdesk");
    } catch (err) {
      console.error("Failed to register walk-in:", err);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/admin/frontdesk"
            className={buttonVariants({
              variant: "glass",
              size: "icon",
              className: "size-8.5 rounded-full shrink-0 mt-0.5 sm:mt-0",
            })}
            title="Back to Front Desk"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="space-y-0.5">
            <h1 className="font-heading text-base font-bold text-foreground">
              Walk-In Immediate Check-In
            </h1>
            <p className="text-xs font-normal text-muted-foreground">
              Register direct arrival, assign clean room, and collect payment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/admin/frontdesk"
            className={buttonVariants({
              variant: "glass",
              size: "sm",
              className: "text-xs font-bold text-foreground",
            })}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary-glass"
            size="sm"
            disabled={submitting || loadingRooms || rooms.length === 0}
            className="gap-1.5 text-xs font-bold"
          >
            <CheckCircle2 className="size-3.5" />
            <span>{submitting ? "Processing..." : "Complete & Check In"}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Guest & Stay Details (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Guest Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Guest Information</CardTitle>
              <CardDescription className="text-xs font-normal text-muted-foreground">
                Primary contact and identification record for this stay.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Somnang Sok"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +855 12 345 678"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. guest@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-muted-foreground">
                    Passport / National ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. N12345678"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stay Dates & Occupancy */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Stay Schedule & Guests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Adults</label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Children</label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} Children
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-normal text-muted-foreground">
                  Special Remarks / Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Extra water bottles, late checkout inquiry..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Room Assignment & Folio (1 col) */}
        <div className="space-y-6">
          {/* Room Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Room Assignment</CardTitle>
              <CardDescription className="text-xs font-normal text-muted-foreground">
                Select from verified sanitized units.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {rooms.length > 0 ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Available Room *
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} – {r.typeName} (${r.pricePerNight}/night)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                  No rooms are currently marked available and clean.
                </div>
              )}

              {selectedRoom && (
                <div className="p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 space-y-1.5 text-xs dark:bg-white/[0.03] dark:border-white/10">
                  <div className="flex justify-between">
                    <span className="font-normal text-muted-foreground">Bedding</span>
                    <span className="font-bold text-foreground">{selectedRoom.bedType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-normal text-muted-foreground">Location</span>
                    <span className="font-bold text-foreground">Floor {selectedRoom.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-normal text-muted-foreground">Issued Keycard</span>
                    <span className="font-bold text-primary">KC-{selectedRoom.roomNumber}-W</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing & Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Folio & Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Rate per Night</span>
                <span className="font-bold text-foreground">${pricePerNight}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Nights</span>
                <span className="font-bold text-foreground">{nights}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-white/30 dark:border-white/10">
                <span className="font-bold text-foreground">Total Charge</span>
                <span className="font-bold text-sm text-primary">${totalPrice}</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-foreground">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as WalkInInput["paymentMethod"])}
                  className="w-full px-3 py-1.5 text-xs font-normal rounded-xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 dark:bg-white/[0.06] dark:border-white/15"
                >
                  <option value="khqr">Bakong KHQR</option>
                  <option value="cash">Cash (USD / KHR)</option>
                  <option value="aba">ABA Bank Transfer</option>
                  <option value="credit_card">Credit / Debit Card</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Payment Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus("paid")}
                    className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all border ${
                      paymentStatus === "paid"
                        ? "bg-primary/20 text-primary border-primary/40 shadow-xs"
                        : "bg-white/40 text-muted-foreground border-white/60 hover:text-foreground dark:bg-white/5"
                    }`}
                  >
                    Paid in Full
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus("unpaid")}
                    className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all border ${
                      paymentStatus === "unpaid"
                        ? "bg-primary/20 text-primary border-primary/40 shadow-xs"
                        : "bg-white/40 text-muted-foreground border-white/60 hover:text-foreground dark:bg-white/5"
                    }`}
                  >
                    Pay at Checkout
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary-glass"
                  size="sm"
                  disabled={submitting || rooms.length === 0}
                  className="w-full text-xs font-bold justify-center"
                >
                  {submitting ? "Processing Check-In..." : "Complete Walk-In Check-In"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
