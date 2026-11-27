// Public API of the studio module: rooms (and later tags, technical sheets,
// bio templates, macros).
import type { AppModule } from "@/shared/module";

export type { Platform, Room, RoomStatus } from "./types";
export { PLATFORM_LABEL, ROOM_STATUS, platformLabel } from "./labels";
export { listRooms, roomDirectory } from "./queries";
export { default as RoomsPanel } from "./components/RoomsPanel.astro";

export const studioModule: AppModule = {
  id: "studio",
  nav: [
    {
      href: "/app/rooms",
      label: "Salas",
      icon: "rooms",
      roles: ["OWNER", "ADMIN", "MONITOR"],
      order: 30,
    },
  ],
};
