"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Room, CreateRoomInput, RoomStatus, HousekeepingStatus } from "../types";
import { roomService } from "../room.service";

interface RoomFormProps {
  initialRoom?: Room;
  isEdit?: boolean;
}

const standardAmenitiesList = [
  "High-speed Wi-Fi",
  "Garden View Balcony",
  "Private Sun Balcony",
  "Panoramic Sea View Balcony",
  "Rain Shower",
  "Deep Soaking Bathtub",
  "Smart TV 55\"",
  "Smart TV 65\"",
  "Mini Bar",
  "Espresso Machine",
  "Air Conditioning",
  "Safety Deposit Box",
  "Work Desk",
  "Private Rooftop Plunge Pool",
  "Jacuzzi Spa Tub",
  "Kitchenette & Microwave",
];

const roomTypesList = [
  { id: "type-deluxe-king", name: "Deluxe King Room", defaultPrice: 75 },
  { id: "type-deluxe-twin", name: "Deluxe Twin Room", defaultPrice: 70 },
  { id: "type-standard-queen", name: "Standard Queen Room", defaultPrice: 55 },
  { id: "type-executive-suite", name: "Executive Suite", defaultPrice: 140 },
  { id: "type-family-suite", name: "Family Studio", defaultPrice: 125 },
  { id: "type-penthouse", name: "Presidential Penthouse", defaultPrice: 280 },
];

export function RoomForm({ initialRoom, isEdit = false }: RoomFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [roomNumber, setRoomNumber] = useState(initialRoom?.roomNumber || "");
  const [name, setName] = useState(initialRoom?.name || "");
  const [typeId, setTypeId] = useState(initialRoom?.typeId || "type-deluxe-king");
  const [floor, setFloor] = useState<number>(initialRoom?.floor || 1);
  const [bedType, setBedType] = useState(initialRoom?.bedType || "1 King Bed");
  const [pricePerNight, setPricePerNight] = useState<number>(
    initialRoom?.pricePerNight || 75
  );
  const [adults, setAdults] = useState<number>(initialRoom?.capacity.adults || 2);
  const [children, setChildren] = useState<number>(
    initialRoom?.capacity.children || 0
  );
  const [status, setStatus] = useState<RoomStatus>(
    initialRoom?.status || "available"
  );
  const [housekeepingStatus, setHousekeepingStatus] =
    useState<HousekeepingStatus>(initialRoom?.housekeepingStatus || "clean");
  const [keycardId, setKeycardId] = useState(initialRoom?.keycardId || "");
  const [description, setDescription] = useState(
    initialRoom?.description || ""
  );
  const [imageUrl, setImageUrl] = useState(
    initialRoom?.images?.[0] ||
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialRoom?.amenities || [
      "High-speed Wi-Fi",
      "Air Conditioning",
      "Rain Shower",
      "Smart TV 55\"",
      "Mini Bar",
    ]
  );

  const handleTypeChange = (selectedTypeId: string) => {
    setTypeId(selectedTypeId);
    const matched = roomTypesList.find((t) => t.id === selectedTypeId);
    if (matched && !isEdit) {
      if (!name) setName(matched.name);
      setPricePerNight(matched.defaultPrice);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!roomNumber.trim()) {
      setErrorMsg("Room number is required (e.g. 101, 204)");
      return;
    }

    const matchedType = roomTypesList.find((t) => t.id === typeId);
    const typeName = matchedType ? matchedType.name : "Custom Room Type";

    const payload: CreateRoomInput = {
      roomNumber: roomNumber.trim(),
      name: name.trim() || `Room ${roomNumber.trim()} (${typeName})`,
      typeId,
      typeName,
      floor: Number(floor) || 1,
      capacity: {
        adults: Number(adults) || 1,
        children: Number(children) || 0,
      },
      bedType,
      pricePerNight: Number(pricePerNight) || 50,
      status,
      housekeepingStatus,
      amenities: selectedAmenities,
      description: description.trim(),
      images: [imageUrl.trim()],
      keycardId: keycardId.trim() || undefined,
    };

    setSubmitting(true);
    try {
      if (isEdit && initialRoom) {
        await roomService.updateRoom(initialRoom.id, payload);
        router.push(`/admin/rooms/${initialRoom.id}`);
      } else {
        const created = await roomService.createRoom(payload);
        router.push(`/admin/rooms/${created.id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save room details.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/rooms"
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "size-9 rounded-full",
            })}
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="font-heading text-base font-bold tracking-tight text-foreground">
              {isEdit ? `Edit Room ${initialRoom?.roomNumber}` : "Create Physical Room"}
            </h1>
            <p className="text-xs font-normal text-muted-foreground">
              Dedicated full-page inventory editor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={isEdit && initialRoom ? `/admin/rooms/${initialRoom.id}` : "/admin/rooms"}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-sm font-normal text-muted-foreground hover:text-foreground",
            })}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            size="sm"
            className="gap-1.5 font-bold text-sm"
          >
            <Save className="size-3.5" />
            <span>{submitting ? "Saving..." : isEdit ? "Update Room" : "Create Room"}</span>
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs font-normal">
          {errorMsg}
        </div>
      )}

      {/* Section 1: Basic Identifiers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            1. Room Identification & Classification
          </CardTitle>
          <CardDescription className="text-xs font-normal text-muted-foreground">
            Specify the physical door number, tier classification, and floor location.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Room Number <span className="text-primary">*</span>
            </label>
            <Input
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. 101, 204"
              className="text-sm font-normal"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Display Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deluxe King Garden View"
              className="text-sm font-normal"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Floor Level
            </label>
            <select
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="h-10 w-full rounded-[14px] border border-white/60 bg-white/40 px-3 py-2 text-sm font-normal backdrop-blur-md outline-none dark:bg-white/[0.06] dark:border-white/15 dark:text-foreground"
            >
              <option value={1} className="dark:bg-zinc-900">Floor 1 (Ground)</option>
              <option value={2} className="dark:bg-zinc-900">Floor 2</option>
              <option value={3} className="dark:bg-zinc-900">Floor 3 (Penthouse)</option>
              <option value={4} className="dark:bg-zinc-900">Floor 4</option>
              <option value={5} className="dark:bg-zinc-900">Floor 5</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Room Type Tier
            </label>
            <select
              value={typeId}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="h-10 w-full rounded-[14px] border border-white/60 bg-white/40 px-3 py-2 text-sm font-normal backdrop-blur-md outline-none dark:bg-white/[0.06] dark:border-white/15 dark:text-foreground"
            >
              {roomTypesList.map((t) => (
                <option key={t.id} value={t.id} className="dark:bg-zinc-900">
                  {t.name} (Std: ${t.defaultPrice}/night)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Electronic Keycard Lock ID
            </label>
            <Input
              value={keycardId}
              onChange={(e) => setKeycardId(e.target.value)}
              placeholder="e.g. KC-101-A"
              className="text-sm font-normal"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Pricing & Occupancy Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            2. Capacity & Nightly Pricing
          </CardTitle>
          <CardDescription className="text-xs font-normal text-muted-foreground">
            Configure bed arrangement, guest thresholds, and baseline rate in USD.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Price per Night (USD $)
            </label>
            <Input
              type="number"
              min={1}
              value={pricePerNight}
              onChange={(e) => setPricePerNight(Number(e.target.value))}
              className="text-sm font-normal"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Bed Configuration
            </label>
            <Input
              value={bedType}
              onChange={(e) => setBedType(e.target.value)}
              placeholder="e.g. 1 King Bed, 2 Twin Beds"
              className="text-sm font-normal"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Max Adults
            </label>
            <Input
              type="number"
              min={1}
              max={10}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="text-sm font-normal"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Max Children
            </label>
            <Input
              type="number"
              min={0}
              max={10}
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="text-sm font-normal"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Operational Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            3. Operational & Housekeeping States
          </CardTitle>
          <CardDescription className="text-xs font-normal text-muted-foreground">
            Current availability and cleanliness stage for front desk PMS dispatch.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Availability Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RoomStatus)}
              className="h-10 w-full rounded-[14px] border border-white/60 bg-white/40 px-3 py-2 text-sm font-normal backdrop-blur-md outline-none dark:bg-white/[0.06] dark:border-white/15 dark:text-foreground capitalize"
            >
              <option value="available" className="dark:bg-zinc-900">Available (Vacant)</option>
              <option value="occupied" className="dark:bg-zinc-900">Occupied (Guest In-House)</option>
              <option value="reserved" className="dark:bg-zinc-900">Reserved (Arrival Scheduled)</option>
              <option value="dirty" className="dark:bg-zinc-900">Dirty (Needs Turn-down)</option>
              <option value="cleaning" className="dark:bg-zinc-900">Cleaning (In Progress)</option>
              <option value="maintenance" className="dark:bg-zinc-900">Maintenance (Out of Service)</option>
              <option value="out_of_order" className="dark:bg-zinc-900">Out of Order</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Housekeeping State
            </label>
            <select
              value={housekeepingStatus}
              onChange={(e) => setHousekeepingStatus(e.target.value as HousekeepingStatus)}
              className="h-10 w-full rounded-[14px] border border-white/60 bg-white/40 px-3 py-2 text-sm font-normal backdrop-blur-md outline-none dark:bg-white/[0.06] dark:border-white/15 dark:text-foreground capitalize"
            >
              <option value="clean" className="dark:bg-zinc-900">Clean (Inspected & Ready)</option>
              <option value="dirty" className="dark:bg-zinc-900">Dirty (Awaiting Cleaning)</option>
              <option value="cleaning" className="dark:bg-zinc-900">Cleaning (Staff Active)</option>
              <option value="inspecting" className="dark:bg-zinc-900">Inspecting (Manager Check)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Amenities Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            4. Room Amenities & Features
          </CardTitle>
          <CardDescription className="text-xs font-normal text-muted-foreground">
            Select luxury features displayed on the guest booking portal and PMS card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {standardAmenitiesList.map((amenity) => {
              const isChecked = selectedAmenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-2 p-2.5 rounded-[12px] text-xs font-normal text-left transition-all border ${
                    isChecked
                      ? "bg-primary/15 text-primary border-primary/35 shadow-xs"
                      : "bg-white/30 text-foreground border-white/60 hover:bg-white/50 dark:bg-white/[0.04] dark:border-white/10"
                  }`}
                >
                  <div
                    className={`size-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                      isChecked
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/40 bg-white/50 dark:bg-white/10"
                    }`}
                  >
                    {isChecked && <Check className="size-3 stroke-[3]" />}
                  </div>
                  <span className="line-clamp-1">{amenity}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Media & Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground">
            5. Description & Photography
          </CardTitle>
          <CardDescription className="text-xs font-normal text-muted-foreground">
            Provide marketing copy and featured photo URL for the guest-facing portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Featured Image URL
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="text-sm font-normal"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1.5">
              Room Description
            </label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the room ambiance, balcony orientation, furnishings, and unique luxury features..."
              className="text-sm font-normal"
            />
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 border-t border-white/50 bg-white/20 dark:border-white/10 dark:bg-white/[0.02]">
          <Link
            href="/admin/rooms"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-sm font-normal text-muted-foreground hover:text-foreground",
            })}
          >
            Cancel and Discard
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            size="sm"
            className="gap-1.5 font-bold text-sm"
          >
            <Save className="size-3.5" />
            <span>{submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Room"}</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
