import type { Tone } from "@/shared/fluent/components";
import type { Platform, RoomStatus } from "./types";

export const PLATFORM_LABEL: Record<Platform, string> = {
  CHATURBATE: "Chaturbate",
  STRIPCHAT: "Stripchat",
};

export const ROOM_STATUS: Record<RoomStatus, { label: string; tone: Tone }> = {
  ONLINE: { label: "En línea", tone: "success" },
  OFFLINE: { label: "Desconectada", tone: "neutral" },
  INCIDENT: { label: "Incidencia", tone: "danger" },
};

export const platformLabel = (p: string) => PLATFORM_LABEL[p as Platform] ?? p;
