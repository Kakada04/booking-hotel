"use client";

import React, { useState, useEffect } from "react";
import {
  roomService,
  Room,
  RoomStats,
  RoomFilter,
  RoomStatus,
  HousekeepingStatus,
  RoomFilters,
  RoomGrid,
  RoomTable,
  initialRoomsData,
  calculateRoomStats,
} from "@/features/admin/rooms";

const initialRooms = initialRoomsData as Room[];
const initialStats = calculateRoomStats(initialRooms);

export default function RoomsListPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [stats, setStats] = useState<RoomStats>(initialStats);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [filter, setFilter] = useState<RoomFilter>({
    search: "",
    status: "all",
    floor: "all",
    viewMode: "grid",
  });

  const loadData = async () => {
    try {
      const [allRooms, roomStats] = await Promise.all([
        roomService.getRooms(filter),
        roomService.getRoomStats(),
      ]);
      setRooms(allRooms);
      setStats(roomStats);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter.search, filter.status, filter.floor]);

  const handleFilterChange = (updated: Partial<RoomFilter>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateStatus = async (roomId: string, status: RoomStatus) => {
    try {
      await roomService.updateRoomStatus(roomId, status);
      await loadData();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleUpdateHousekeeping = async (
    roomId: string,
    hkStatus: HousekeepingStatus
  ) => {
    try {
      await roomService.updateHousekeepingStatus(roomId, hkStatus);
      await loadData();
    } catch (err) {
      console.error("Failed to update housekeeping status:", err);
    }
  };

  const handleResetFilters = () => {
    setFilter({
      search: "",
      status: "all",
      floor: "all",
      viewMode: "grid",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Filter Bar with Search, Status Pills, Floor Dropdown, View Switcher & Add Room */}
      <RoomFilters
        filter={filter}
        onFilterChange={handleFilterChange}
        totalFilteredCount={rooms.length}
        availableFloors={Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b)}
      />

      {/* Main Content: Grid vs Table */}
      {loading ? (
        <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
          Loading hotel room inventory...
        </div>
      ) : filter.viewMode === "table" ? (
        <RoomTable
          rooms={rooms}
          onUpdateStatus={handleUpdateStatus}
          onUpdateHousekeeping={handleUpdateHousekeeping}
        />
      ) : (
        <RoomGrid
          rooms={rooms}
          onUpdateStatus={handleUpdateStatus}
          onUpdateHousekeeping={handleUpdateHousekeeping}
          onResetFilters={handleResetFilters}
        />
      )}
    </div>
  );
}
