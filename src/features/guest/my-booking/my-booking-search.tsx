"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Ticket, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_BOOKINGS } from "@/lib/mock-data";

const inputClass =
  "w-full glass-card rounded-srok-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/40 bg-transparent transition-shadow";

export function MyBookingSearch() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleFind(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!code.trim() || !phone.trim()) {
      setError("Please enter both your booking code and phone number.");
      return;
    }

    // Look up mock booking
    const booking = MOCK_BOOKINGS.find(
      (b) =>
        b.code.toLowerCase() === code.trim().toLowerCase() &&
        b.phone.replace(/\s+/g, "") === phone.trim().replace(/\s+/g, "")
    );

    if (!booking) {
      setError("No booking found with that code and phone number. Please check and try again.");
      return;
    }

    startTransition(() => {
      router.push(`/my-booking/${booking.code}`);
    });
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="size-14 rounded-srok-xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto">
          <Ticket className="size-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Find Your Booking</h1>
        <p className="text-sm text-muted-foreground">
          Enter your booking code and phone number to manage your reservation.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleFind} className="glass-panel rounded-srok-2xl p-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="mybooking-code" className="text-xs font-bold text-foreground/80">
            Booking Code <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="mybooking-code"
              type="text"
              placeholder="e.g. BK-2026-00125"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`${inputClass} pl-10 font-mono tracking-wider uppercase`}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="mybooking-phone" className="text-xs font-bold text-foreground/80">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="mybooking-phone"
              type="tel"
              placeholder="+855 12 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${inputClass} pl-10`}
              autoComplete="tel"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-srok-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full gap-2 font-bold"
          disabled={isPending}
          id="find-booking-submit-btn"
        >
          <Search className="size-4" />
          {isPending ? "Searching…" : "Find My Booking"}
        </Button>
      </form>

      {/* Hint */}
      <div className="glass-card rounded-srok-xl p-4 text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          <strong>Demo:</strong> Use code <code className="font-mono bg-muted px-1 py-0.5 rounded">BK-2026-00125</code> with phone <code className="font-mono bg-muted px-1 py-0.5 rounded">+85512345678</code>
        </p>
      </div>
    </div>
  );
}
