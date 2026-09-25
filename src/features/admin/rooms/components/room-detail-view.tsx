"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Room, RoomStatus, HousekeepingStatus } from "../types";
import { roomService } from "../room.service";

const DEFAULT_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";

function formatRoomTitle(roomNumber: string, name: string): string {
  const num = (roomNumber || "").trim();
  const rawName = (name || "").trim();

  if (
    !rawName ||
    rawName.toLowerCase() === `room ${num.toLowerCase()}` ||
    rawName.toLowerCase() === num.toLowerCase()
  ) {
    return num ? `Room ${num}` : "Room Details";
  }

  if (rawName.toLowerCase().startsWith("room ") || rawName.toLowerCase().includes(num.toLowerCase())) {
    return rawName;
  }

  return num ? `Room ${num} · ${rawName}` : rawName;
}

interface RoomDetailViewProps {
  initialRoom: Room;
}

export function RoomDetailView({ initialRoom }: RoomDetailViewProps) {
  const router = useRouter();
  const [room, setRoom] = useState<Room>(initialRoom);
  const [activePhoto, setActivePhoto] = useState(room.images?.[0] || "");
  const [imgFailed, setImgFailed] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const displayPhoto =
    imgFailed || (!activePhoto && (!room.images || room.images.length === 0))
      ? DEFAULT_ROOM_IMAGE
      : activePhoto || room.images[0];

  const handleUpdateHousekeeping = async (newHk: HousekeepingStatus) => {
    try {
      const updated = await roomService.updateHousekeepingStatus(room.id, newHk);
      setRoom(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await roomService.deleteRoom(room.id);
      router.push("/admin/rooms");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  const getStatusVariant = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "available";
      case "occupied":
        return "occupied";
      case "dirty":
        return "dirty";
      case "cleaning":
        return "cleaning";
      case "reserved":
        return "default";
      case "maintenance":
      case "out_of_order":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            href="/admin/rooms"
            className={buttonVariants({
              variant: "glass",
              size: "icon",
              className: "size-8.5 rounded-full shrink-0 mt-0.5 sm:mt-0",
            })}
            title="Back to Rooms"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-normal text-muted-foreground">
                Floor {room.floor} · {room.typeName}
              </span>
              <Badge variant={getStatusVariant(room.status)} className="capitalize text-xs font-bold">
                {room.status.replace("_", " ")}
              </Badge>
            </div>
            <h1 className="font-heading text-base font-bold text-foreground">
              {formatRoomTitle(room.roomNumber, room.name)}
            </h1>
          </div>
        </div>

        {/* Action Buttons: Full-Page Edit Link & Quick Toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Quick Housekeeping Action */}
          <Button
            variant="glass"
            size="sm"
            onClick={() => handleUpdateHousekeeping(room.housekeepingStatus === "dirty" ? "clean" : "dirty")}
            className="text-xs font-bold text-foreground"
          >
            {room.housekeepingStatus === "dirty" ? "Mark Clean" : "Mark Dirty"}
          </Button>

          {/* Edit Full Page Link - STRICTLY FULL PAGE ROUTE */}
          <Link
            href={`/admin/rooms/${room.id}/edit`}
            className={buttonVariants({
              variant: "primary-glass",
              size: "sm",
              className: "gap-1.5 text-xs font-bold",
            })}
          >
            <Edit2 className="size-3.5" />
            <span>Edit Room</span>
          </Link>

          {/* Delete Dialog Confirmation */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="glass"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground"
                  title="Delete Room"
                />
              }
            >
              <Trash2 className="size-3.5" />
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-bold text-base text-foreground">
                  Delete Room {room.roomNumber}?
                </DialogTitle>
                <DialogDescription className="text-xs font-normal text-muted-foreground">
                  Are you sure you want to remove Room {room.roomNumber} ({room.name}) from the active hotel inventory? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 gap-2">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setDeleteOpen(false)}
                  className="text-xs font-bold text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="text-xs font-bold"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Detail Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo Gallery + Description + Amenities (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Hero Photo Card */}
          <Card className="overflow-hidden p-0">
            <div className="relative aspect-[16/9] w-full bg-black/5 overflow-hidden">
              <img
                src={displayPhoto}
                onError={() => setImgFailed(true)}
                alt={room.name || `Room ${room.roomNumber}`}
                className="h-full w-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/80 shadow-sm dark:bg-black/60 dark:border-white/20">
                <span className="text-base font-bold text-primary">${room.pricePerNight}</span>
                <span className="text-xs font-normal text-muted-foreground"> / night</span>
              </div>
            </div>

            {/* Thumbnail selector if multiple images exist */}
            {room.images && room.images.length > 1 && (
              <div className="flex items-center gap-2 p-3 border-t border-white/40 bg-white/20 dark:border-white/10 dark:bg-white/[0.02]">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActivePhoto(img);
                      setImgFailed(false);
                    }}
                    className={`relative size-14 rounded-xl overflow-hidden border-2 transition-all ${
                      displayPhoto === img
                        ? "border-primary scale-105 shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumb" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Room Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-normal text-foreground/80 leading-relaxed">
                {room.description || "No specific marketing description has been entered for this physical unit yet."}
              </p>
            </CardContent>
          </Card>

          {/* Amenities & Features Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Included Features & Amenities</CardTitle>
              <CardDescription className="text-xs font-normal text-muted-foreground">
                Comfort items, connectivity, and fixtures available in this unit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {room.amenities && room.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 rounded-full bg-white/50 text-xs font-normal text-foreground backdrop-blur-md border border-white/70 shadow-xs dark:bg-white/10 dark:border-white/15"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-normal text-muted-foreground">
                  Standard room amenities and hospitality fixtures included.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Specs & Operational State (1 col) */}
        <div className="space-y-6">
          {/* Key Specifications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-base text-foreground">Room Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Room Number</span>
                <span className="font-bold text-foreground">{room.roomNumber}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Category</span>
                <span className="font-bold text-foreground">{room.typeName}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Floor</span>
                <span className="font-bold text-foreground">Floor {room.floor}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Bedding</span>
                <span className="font-bold text-foreground">{room.bedType}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Max Capacity</span>
                <span className="font-bold text-foreground">
                  {room.capacity.adults} Adults{room.capacity.children > 0 ? `, ${room.capacity.children} Children` : ""}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-white/30 dark:border-white/10">
                <span className="font-normal text-muted-foreground">Nightly Rate</span>
                <span className="font-bold text-sm text-primary">${room.pricePerNight}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-normal text-muted-foreground">Keycard ID</span>
                <span className="font-bold text-foreground">
                  {room.keycardId || "Unassigned"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Current In-House Guest Card */}
          {room.currentGuest ? (
            <Card className="border-primary/30 bg-primary/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-bold text-base text-primary">
                    In-House Guest
                  </CardTitle>
                  <Badge variant="default" className="text-xs font-bold">
                    {room.currentGuest.bookingCode}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-sm text-foreground block">
                    {room.currentGuest.name}
                  </span>
                  {room.currentGuest.phone && (
                    <span className="text-xs font-normal text-muted-foreground">
                      {room.currentGuest.phone}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/20 text-xs">
                  <div>
                    <span className="text-xs font-normal text-muted-foreground block">Check-In</span>
                    <span className="font-bold text-foreground">{room.currentGuest.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-xs font-normal text-muted-foreground block">Check-Out</span>
                    <span className="font-bold text-foreground">{room.currentGuest.checkOut}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/admin/frontdesk"
                    className={buttonVariants({
                      variant: "glass",
                      size: "sm",
                      className: "w-full text-xs font-bold justify-center",
                    })}
                  >
                    Manage Front Desk Stay
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-bold text-base text-foreground">Reservation Status</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-3">
                <p className="font-normal">No guest is currently occupying this unit.</p>
                <div>
                  <Link
                    href="/admin/frontdesk/walk-in"
                    className={buttonVariants({
                      variant: "glass",
                      size: "sm",
                      className: "w-full text-xs font-bold justify-center",
                    })}
                  >
                    Check In Walk-In Guest
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Housekeeping Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-bold text-base text-foreground">
                Housekeeping Dispatch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-normal text-muted-foreground">Cleanliness State</span>
                <Badge
                  variant={room.housekeepingStatus === "clean" ? "available" : "dirty"}
                  className="capitalize font-bold text-xs"
                >
                  {room.housekeepingStatus}
                </Badge>
              </div>

              {room.lastCleaned && (
                <div className="flex items-center justify-between text-xs font-normal text-muted-foreground">
                  <span>Last Sanitized</span>
                  <span>{new Date(room.lastCleaned).toLocaleDateString()}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  type="button"
                  variant={room.housekeepingStatus === "clean" ? "primary-glass" : "glass"}
                  size="sm"
                  onClick={() => handleUpdateHousekeeping("clean")}
                  className="text-xs font-bold"
                >
                  Mark Clean
                </Button>
                <Button
                  type="button"
                  variant={room.housekeepingStatus === "dirty" ? "primary-glass" : "glass"}
                  size="sm"
                  onClick={() => handleUpdateHousekeeping("dirty")}
                  className="text-xs font-bold"
                >
                  Mark Dirty
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
