"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Edit2,
  Users,
  BedDouble,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Room, RoomStatus, HousekeepingStatus } from "../types";

interface RoomTableProps {
  rooms: Room[];
  onUpdateStatus?: (roomId: string, status: RoomStatus) => void;
  onUpdateHousekeeping?: (roomId: string, status: HousekeepingStatus) => void;
}

export function RoomTable({
  rooms,
  onUpdateStatus,
  onUpdateHousekeeping,
}: RoomTableProps) {
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

  const getHousekeepingVariant = (hk: HousekeepingStatus) => {
    switch (hk) {
      case "clean":
        return "available";
      case "dirty":
        return "dirty";
      case "cleaning":
        return "cleaning";
      case "inspecting":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="overflow-hidden rounded-[18px] bg-white/45 backdrop-blur-xl border border-white/65 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:bg-white/[0.05] dark:border-white/15">
      <div className="w-full overflow-x-auto touch-pan-x [scrollbar-width:thin]">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="border-b border-white/40 dark:border-white/10">
            <TableHead className="w-24 font-bold text-xs">Room #</TableHead>
            <TableHead className="font-bold text-xs">Name & Type</TableHead>
            <TableHead className="w-20 font-bold text-xs">Floor</TableHead>
            <TableHead className="font-bold text-xs">Capacity</TableHead>
            <TableHead className="w-28 font-bold text-xs">Rate</TableHead>
            <TableHead className="w-32 font-bold text-xs">Status</TableHead>
            <TableHead className="w-32 font-bold text-xs">Housekeeping</TableHead>
            <TableHead className="font-bold text-xs">In-House Guest</TableHead>
            <TableHead className="w-24 text-right font-bold text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rooms.map((room) => (
            <TableRow
              key={room.id}
              className="border-b border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              {/* Room # */}
              <TableCell className="font-bold text-sm text-foreground">
                <Link
                  href={`/admin/rooms/${room.id}`}
                  className="px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25 transition-colors inline-block"
                >
                  {room.roomNumber}
                </Link>
              </TableCell>

              {/* Name & Type */}
              <TableCell>
                <div className="flex flex-col">
                  <Link
                    href={`/admin/rooms/${room.id}`}
                    className="font-semibold text-xs text-foreground hover:text-primary transition-colors"
                  >
                    {room.name}
                  </Link>
                  <span className="text-[11px] text-muted-foreground">
                    {room.typeName}
                  </span>
                </div>
              </TableCell>

              {/* Floor */}
              <TableCell className="text-xs font-medium text-muted-foreground">
                Floor {room.floor}
              </TableCell>

              {/* Capacity */}
              <TableCell>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3 text-primary" />
                    {room.capacity.adults}A
                    {room.capacity.children > 0 && `, ${room.capacity.children}C`}
                  </span>
                  <span>•</span>
                  <span>{room.bedType}</span>
                </div>
              </TableCell>

              {/* Rate */}
              <TableCell>
                <div className="text-xs">
                  <span className="font-bold text-foreground">${room.pricePerNight}</span>
                  <span className="text-[10px] text-muted-foreground"> / night</span>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant={getStatusVariant(room.status)}
                  className="capitalize font-semibold text-[11px]"
                >
                  {room.status.replace("_", " ")}
                </Badge>
              </TableCell>

              {/* Housekeeping */}
              <TableCell>
                <Badge
                  variant={getHousekeepingVariant(room.housekeepingStatus)}
                  className="capitalize font-semibold text-[11px]"
                >
                  {room.housekeepingStatus}
                </Badge>
              </TableCell>

              {/* Current Guest info */}
              <TableCell>
                {room.currentGuest ? (
                  <div className="text-xs">
                    <span className="font-semibold text-foreground block">
                      {room.currentGuest.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Out: {room.currentGuest.checkOut}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">None</span>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/rooms/${room.id}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon",
                      className: "size-7 rounded-full hover:bg-white/40",
                    })}
                    title="View Room Details"
                  >
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                  </Link>

                  <Link
                    href={`/admin/rooms/${room.id}/edit`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon",
                      className: "size-7 rounded-full hover:bg-white/40",
                    })}
                    title="Edit Room"
                  >
                    <Edit2 className="size-3.5 text-muted-foreground" />
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-full hover:bg-white/40"
                          aria-label="More"
                        />
                      }
                    >
                      <MoreVertical className="size-3.5 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-xs">Quick Action</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus?.(room.id, "available")}
                        className="text-xs cursor-pointer text-emerald-600 dark:text-emerald-400"
                      >
                        <CheckCircle2 className="size-3.5 mr-2" />
                        Set Available
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateHousekeeping?.(room.id, "dirty")}
                        className="text-xs cursor-pointer text-amber-600 dark:text-amber-400"
                      >
                        <Sparkles className="size-3.5 mr-2" />
                        Mark Dirty
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus?.(room.id, "maintenance")}
                        className="text-xs cursor-pointer text-destructive"
                      >
                        <AlertTriangle className="size-3.5 mr-2" />
                        Set Maintenance
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        render={<Link href={`/admin/rooms/${room.id}/edit`} />}
                        className="text-xs cursor-pointer"
                      >
                        Edit Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
