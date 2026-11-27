import type { Decimal } from "@/shared/api/types";

export type ShiftStatus = "SCHEDULED" | "ACTIVE" | "FINISHED" | "CANCELLED";

export interface Shift {
  id: string;
  model_id: string;
  room_id: string;
  monitor_id: string | null;
  status: ShiftStatus;
  start_time: string;
  end_time: string | null;
  tokens_earned: number;
  usd_earned: Decimal;
  created_at: string;
}
