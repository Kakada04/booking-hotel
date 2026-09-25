import initialRoomsData from "./mockdata.json";
import {
  Room,
  RoomFilter,
  RoomStats,
  CreateRoomInput,
  RoomStatus,
  HousekeepingStatus,
} from "./types";

const STORAGE_KEY = "srokhotel_rooms_data_v1";

// In-memory fallback
let inMemoryRooms: Room[] = [...(initialRoomsData as Room[])];

function getStoredRooms(): Room[] {
  if (typeof window === "undefined") {
    return inMemoryRooms;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRoomsData));
      return [...(initialRoomsData as Room[])];
    }
    return JSON.parse(raw) as Room[];
  } catch {
    return inMemoryRooms;
  }
}

function saveRooms(rooms: Room[]): void {
  inMemoryRooms = rooms;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    } catch {
      // ignore
    }
  }
}

export function calculateRoomStats(rooms: Room[]): RoomStats {
  const total = rooms.length;
  const available = rooms.filter((r) => r.status === "available").length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const reserved = rooms.filter((r) => r.status === "reserved").length;
  const dirty = rooms.filter(
    (r) => r.status === "dirty" || r.housekeepingStatus === "dirty"
  ).length;
  const cleaning = rooms.filter(
    (r) => r.status === "cleaning" || r.housekeepingStatus === "cleaning"
  ).length;
  const maintenance = rooms.filter(
    (r) => r.status === "maintenance" || r.status === "out_of_order"
  ).length;

  const occupancyRate =
    total > 0 ? Math.round((occupied / total) * 100) : 0;

  return {
    total,
    available,
    occupied,
    reserved,
    dirty,
    cleaning,
    maintenance,
    occupancyRate,
  };
}

export { initialRoomsData };

export const roomService = {
  async getRooms(filter?: RoomFilter): Promise<Room[]> {
    const rooms = getStoredRooms();
    let result = [...rooms];

    if (!filter) return result;

    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.typeName.toLowerCase().includes(q) ||
          r.bedType.toLowerCase().includes(q) ||
          (r.currentGuest && r.currentGuest.name.toLowerCase().includes(q))
      );
    }

    if (filter.status && filter.status !== "all") {
      result = result.filter((r) => r.status === filter.status);
    }

    if (filter.floor && filter.floor !== "all") {
      const floorNum = Number(filter.floor);
      result = result.filter((r) => r.floor === floorNum);
    }

    if (filter.type && filter.type !== "all") {
      result = result.filter((r) => r.typeId === filter.type);
    }

    return result;
  },

  async getRoomById(id: string): Promise<Room | null> {
    const rooms = getStoredRooms();
    const found = rooms.find((r) => r.id === id || r.roomNumber === id);
    return found || null;
  },

  async getRoomStats(): Promise<RoomStats> {
    const rooms = getStoredRooms();
    return calculateRoomStats(rooms);
  },

  async createRoom(input: CreateRoomInput): Promise<Room> {
    const rooms = getStoredRooms();
    const newId = `room-${input.roomNumber.toLowerCase().replace(/\s+/g, "-")}`;

    const newRoom: Room = {
      ...input,
      id: newId,
      lastCleaned: new Date().toISOString(),
    };

    const updated = [newRoom, ...rooms];
    saveRooms(updated);
    return newRoom;
  },

  async updateRoom(id: string, input: Partial<Room>): Promise<Room> {
    const rooms = getStoredRooms();
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Room with ID "${id}" not found`);
    }

    const updatedRoom: Room = {
      ...rooms[index],
      ...input,
    };

    rooms[index] = updatedRoom;
    saveRooms([...rooms]);
    return updatedRoom;
  },

  async deleteRoom(id: string): Promise<boolean> {
    const rooms = getStoredRooms();
    const filtered = rooms.filter((r) => r.id !== id);
    if (filtered.length === rooms.length) return false;
    saveRooms(filtered);
    return true;
  },

  async updateRoomStatus(id: string, status: RoomStatus): Promise<Room> {
    return this.updateRoom(id, { status });
  },

  async updateHousekeepingStatus(
    id: string,
    housekeepingStatus: HousekeepingStatus
  ): Promise<Room> {
    return this.updateRoom(id, {
      housekeepingStatus,
      lastCleaned:
        housekeepingStatus === "clean"
          ? new Date().toISOString()
          : undefined,
    });
  },

  async resetToDefault(): Promise<Room[]> {
    saveRooms([...(initialRoomsData as Room[])]);
    return [...(initialRoomsData as Room[])];
  },
};
