import Link from "next/link";
import Image from "next/image";
import { PhoneCall, Send, MessageCircle, Clock, MapPin, Wifi, Dumbbell, Utensils, Wind, ShieldCheck, Star } from "lucide-react";
import { SearchBox } from "@/features/guest/search/search-box";
import { HOTEL_INFO } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SrokHotel — Boutique Hotel & Resort | Book Direct",
  description:
    "Experience the finest boutique hotel in Phnom Penh. Book your stay directly for the best rates. Comfortable rooms, warm hospitality.",
};

const amenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Wind, label: "Air Conditioned" },
  { icon: Utensils, label: "Restaurant" },
  { icon: Dumbbell, label: "Fitness Center" },
  { icon: ShieldCheck, label: "24/7 Security" },
  { icon: Star, label: "Concierge" },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-b-srok-2xl">
        <div className="relative h-[520px] sm:h-[600px] lg:h-[680px] w-full">
          <Image
            src="/hotel-hero.jpg"
            alt="SrokHotel exterior at dusk"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

          {/* Hero content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
            <div className="max-w-3xl space-y-3 mb-6">
              <div className="glass-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                Boutique Hotel & Resort · Phnom Penh
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Your Perfect Stay
                <br />
                <span className="text-primary">Awaits You</span>
              </h1>
              <p className="text-white/75 text-sm sm:text-base max-w-xl">
                Discover our handcrafted rooms blending modern comfort with warm Cambodian hospitality.
                Book direct for the best rates.
              </p>
            </div>

            {/* Search Box overlaid on hero */}
            <SearchBox />
          </div>
        </div>
      </section>

      {/* ── STAY INFO STRIP ───────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="glass-card rounded-srok-lg p-4 flex items-center gap-3">
          <div className="size-9 rounded-srok-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
            <Clock className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Check-in / Check-out</p>
            <p className="text-sm font-bold">{HOTEL_INFO.checkinTime} / {HOTEL_INFO.checkoutTime}</p>
          </div>
        </div>
        <div className="glass-card rounded-srok-lg p-4 flex items-center gap-3">
          <div className="size-9 rounded-srok-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
            <MapPin className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-bold leading-snug">Phnom Penh, Cambodia</p>
          </div>
        </div>
        <div className="glass-card rounded-srok-lg p-4 flex items-center gap-3">
          <div className="size-9 rounded-srok-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <PhoneCall className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Need Help?</p>
            <a href={`tel:${HOTEL_INFO.phone}`} className="text-sm font-bold hover:text-primary transition-colors">
              {HOTEL_INFO.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── AMENITIES ────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Hotel Amenities</h2>
          <p className="text-sm text-muted-foreground">Everything you need for a comfortable stay</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {amenities.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="glass-card rounded-srok-lg p-4 flex flex-col items-center gap-2 text-center"
            >
              <Icon className="size-5 text-primary" />
              <span className="text-xs text-muted-foreground leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT SECTION ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto">
        <div className="glass-panel rounded-srok-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-bold">Need Assistance?</h2>
            <p className="text-sm text-muted-foreground">Our team is available 24/7 to help you.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`tel:${HOTEL_INFO.phone}`}
              id="contact-call-btn"
              className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-srok-full text-sm font-medium hover:bg-white/70 dark:hover:bg-white/15 transition-colors"
            >
              <PhoneCall className="size-4 text-emerald-500" />
              Call Us
            </a>
            <a
              href={HOTEL_INFO.telegram}
              target="_blank"
              rel="noreferrer"
              id="contact-telegram-btn"
              className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-srok-full text-sm font-medium hover:bg-white/70 dark:hover:bg-white/15 transition-colors"
            >
              <Send className="size-4 text-sky-500" />
              Telegram
            </a>
            <a
              href={HOTEL_INFO.facebook}
              target="_blank"
              rel="noreferrer"
              id="contact-facebook-btn"
              className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-srok-full text-sm font-medium hover:bg-white/70 dark:hover:bg-white/15 transition-colors"
            >
              <MessageCircle className="size-4 text-blue-500" />
              Messenger
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
