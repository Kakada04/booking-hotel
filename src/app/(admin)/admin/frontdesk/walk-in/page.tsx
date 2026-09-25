import React from "react";
import { Metadata } from "next";
import { WalkInForm } from "@/features/admin/frontdesk";

export const metadata: Metadata = {
  title: "Walk-In Immediate Check-In | SrokHotel PMS",
  description: "Direct walk-in guest registration, room assignment, and keycard issue.",
};

export default function WalkInPage() {
  return <WalkInForm />;
}
