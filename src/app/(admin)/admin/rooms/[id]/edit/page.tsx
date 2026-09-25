"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { roomService, Room, RoomForm } from "@/features/admin/rooms";
import { buttonVariants } from "@/components/ui/button";

export default function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const roomId = unwrappedParams.id;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const found = await roomService.getRoomById(roomId);
        setRoom(found);
      } catch (err) {
        console.error("Failed to load room:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
        Loading room editor...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 rounded-[18px] bg-white/40 backdrop-blur-xl border border-white/60 p-8 shadow-sm">
        <h2 className="font-heading text-base font-bold text-foreground">Room not found</h2>
        <p className="text-xs font-normal text-muted-foreground">
          The room unit you are attempting to edit could not be found.
        </p>
        <div>
          <Link
            href="/admin/rooms"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-1.5 font-bold text-sm",
            })}
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Inventory</span>
          </Link>
        </div>
      </div>
    );
  }

  return <RoomForm initialRoom={room} isEdit={true} />;
}
