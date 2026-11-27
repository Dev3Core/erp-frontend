export type Platform = "CHATURBATE" | "STRIPCHAT";
export type RoomStatus = "ONLINE" | "OFFLINE" | "INCIDENT";

export interface Room {
  id: string;
  name: string;
  platform: Platform;
  url: string;
  status: RoomStatus;
  is_active: boolean;
  created_at: string;
}
