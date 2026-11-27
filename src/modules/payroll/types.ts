import type { Decimal } from "@/shared/api/types";

export type LiquidationStatus = "PENDING" | "APPROVED" | "PAID";

export interface Liquidation {
  id: string;
  shift_id: string;
  period_date: string;
  gross_usd: Decimal;
  net_usd: Decimal;
  cop_amount: Decimal;
  trm_used: Decimal;
  status: LiquidationStatus;
  notes: string | null;
  created_at: string;
}
