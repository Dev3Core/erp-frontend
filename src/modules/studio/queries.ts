import type { OffsetPage } from "@/shared/api/types";
import { load } from "@/shared/lib/load";
import type { Room } from "./types";

export const listRooms = (
  locals: App.Locals,
  filters: { is_active?: boolean } = {},
) =>
  load<OffsetPage<Room>>(locals, "/rooms", {
    query: { limit: 200, ...filters },
  });

/** id -> room name, for modules that only hold room ids. */
export async function roomDirectory(locals: App.Locals) {
  const rooms = await listRooms(locals);
  return new Map(rooms.ok ? rooms.data.items.map((r) => [r.id, r.name]) : []);
}
