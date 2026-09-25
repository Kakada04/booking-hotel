"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, differenceInCalendarDays } from "date-fns";
import {
  User,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  ArrowRight,
  BedDouble,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  Building2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROOM_TYPES, PAYMENT_POLICY, PAYMENT_METHODS } from "@/lib/mock-data";

// ─── Helpers ───────────────────────────────────────────────────────────────
function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDisplay(s: string) {
  return format(parseDate(s), "dd MMM yyyy");
}
function calcNights(a: string, b: string) {
  return Math.max(1, differenceInCalendarDays(parseDate(b), parseDate(a)));
}

function getPaymentIcon(id: string) {
  if (id === "khqr") return <QrCode className="size-4" />;
  if (id === "aba") return <CreditCard className="size-4" />;
  return <Building2 className="size-4" />;
}

// ─── Field Component ──────────────────────────────────────────────────────
function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-foreground/80">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
        {!required && <span className="text-muted-foreground font-normal ml-1">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full glass-card rounded-srok-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/40 bg-transparent transition-shadow";

// ─── Main Form ────────────────────────────────────────────────────────────
export function BookingCheckoutForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const checkIn = sp.get("checkIn") ?? format(new Date(), "yyyy-MM-dd");
  const checkOut = sp.get("checkOut") ?? format(new Date(Date.now() + 86400000), "yyyy-MM-dd");
  const adults = Number(sp.get("adults") ?? 2);
  const children = Number(sp.get("children") ?? 0);
  const roomId = sp.get("roomId") ?? "standard-double";

  const room = ROOM_TYPES.find((r) => r.id === roomId) ?? ROOM_TYPES[0];
  const nights = calcNights(checkIn, checkOut);
  const subtotal = room.pricePerNight * nights;
  const total = subtotal;
  const depositAmount = Math.round((total * PAYMENT_POLICY.depositPercent) / 100);
  const remaining = total - depositAmount;
  const needsPayment = depositAmount > 0;

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nationality, setNationality] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    if (!agreed) e.agreed = "You must agree to the policy";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    // Simulate booking submission → navigate to confirmation
    const params = new URLSearchParams({
      code: "BK-2026-00125",
      name: fullName,
      roomId: room.id,
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString(),
      total: total.toString(),
      paid: depositAmount.toString(),
      remaining: remaining.toString(),
      paymentMethod,
    });
    startTransition(() => {
      router.push(`/booking/confirmation?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-16">
      {/* ── LEFT: Guest Info ─────────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-5">
        {/* Guest Information */}
        <div className="glass-panel rounded-srok-xl p-6 space-y-5">
          <h2 className="text-base font-bold flex items-center gap-2">
            <User className="size-4 text-primary" />
            Guest Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field id="booking-fullname" label="Full Name" required>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="booking-fullname"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`${inputClass} pl-10 ${errors.fullName ? "ring-2 ring-destructive/50" : ""}`}
                    autoComplete="name"
                  />
                </div>
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
              </Field>
            </div>

            <Field id="booking-phone" label="Phone Number" required>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="booking-phone"
                  type="tel"
                  placeholder="+855 12 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClass} pl-10 ${errors.phone ? "ring-2 ring-destructive/50" : ""}`}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </Field>

            <Field id="booking-email" label="Email">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="booking-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} pl-10`}
                  autoComplete="email"
                />
              </div>
            </Field>

            <Field id="booking-nationality" label="Nationality">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="booking-nationality"
                  type="text"
                  placeholder="e.g. Cambodian"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <div className="sm:col-span-2">
              <Field id="booking-special-request" label="Special Request">
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <textarea
                    id="booking-special-request"
                    placeholder="e.g. Late check-in, extra pillow, baby cot…"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    rows={3}
                    className={`${inputClass} pl-10 resize-none`}
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Payment Method (if deposit required) */}
        {needsPayment && (
          <div className="glass-panel rounded-srok-xl p-6 space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <CreditCard className="size-4 text-primary" />
              Payment Method
            </h2>
            <p className="text-xs text-muted-foreground">
              Select how you'd like to pay the deposit of <strong>${depositAmount}</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  id={`payment-method-${pm.id}`}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`flex items-center gap-2.5 p-3.5 rounded-srok-lg border text-sm font-medium transition-all ${
                    paymentMethod === pm.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border glass-card hover:bg-muted"
                  }`}
                >
                  {paymentMethod === pm.id ? (
                    <Check className="size-4" />
                  ) : (
                    getPaymentIcon(pm.id)
                  )}
                  {pm.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Policy Agreement */}
        <div className="glass-panel rounded-srok-xl p-5">
          <label
            htmlFor="booking-policy-agree"
            className={`flex items-start gap-3 cursor-pointer ${errors.agreed ? "text-destructive" : ""}`}
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                id="booking-policy-agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`size-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  agreed
                    ? "bg-primary border-primary"
                    : errors.agreed
                    ? "border-destructive"
                    : "border-border"
                }`}
              >
                {agreed && <Check className="size-3 text-white" />}
              </div>
            </div>
            <span className="text-sm leading-snug">
              I agree to the{" "}
              <span className="text-primary font-medium">booking and cancellation policy</span>.
              I understand that my booking is subject to availability confirmation.
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-destructive mt-2 ml-8">{errors.agreed}</p>}
        </div>
      </div>

      {/* ── RIGHT: Summary ────────────────────────────────────────────── */}
      <div className="space-y-4 lg:sticky lg:top-20">
        <div className="glass-panel rounded-srok-xl p-5 space-y-4">
          <h2 className="text-sm font-bold">Booking Summary</h2>

          {/* Room */}
          <div className="glass-card rounded-srok-lg p-3 flex items-start gap-3">
            <BedDouble className="size-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">{room.name}</p>
              <p className="text-xs text-muted-foreground">{room.bedType}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5" /> Check-in
              </span>
              <span className="font-bold">{formatDisplay(checkIn)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5" /> Check-out
              </span>
              <span className="font-bold">{formatDisplay(checkOut)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-3.5" /> Guests
              </span>
              <span className="font-bold">
                {adults} adult{adults > 1 ? "s" : ""}
                {children > 0 ? ` + ${children}` : ""}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                ${room.pricePerNight} × {nights} night{nights > 1 ? "s" : ""}
              </span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-2">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          {/* Payment Policy */}
          <div className="glass-card rounded-srok-lg p-3 space-y-2 text-xs">
            <p className="font-bold">{PAYMENT_POLICY.label}</p>
            {PAYMENT_POLICY.depositPercent === 0 ? (
              <p className="text-muted-foreground">No payment required now. Pay at property.</p>
            ) : PAYMENT_POLICY.depositPercent === 100 ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required now</span>
                <span className="font-bold text-primary">${total}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required now</span>
                  <span className="font-bold text-primary">${depositAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pay at property</span>
                  <span className="font-bold">${remaining}</span>
                </div>
              </>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 font-bold"
            disabled={isPending}
            id="submit-booking-btn"
          >
            {isPending ? "Submitting…" : "Submit Booking Request"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
