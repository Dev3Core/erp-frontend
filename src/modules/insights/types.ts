import type { Decimal } from "@/shared/api/types";

export interface MetricsOverview {
  period_from: string | null;
  period_to: string | null;
  total_shifts: number;
  total_tokens: number;
  total_usd: Decimal;
  total_cop_paid: Decimal;
  liquidations_pending: number;
  liquidations_approved: number;
  liquidations_paid: number;
}

export interface RevenueByModelItem {
  model_id: string;
  email: string;
  full_name: string;
  total_shifts: number;
  total_tokens: number;
  total_usd: Decimal;
}

export interface RevenueByPlatformItem {
  platform: string;
  total_shifts: number;
  total_tokens: number;
  total_usd: Decimal;
}

export interface DailyRevenueItem {
  day: string;
  total_shifts: number;
  total_tokens: number;
  total_usd: Decimal;
}

export interface ModelOverview {
  model_id: string;
  period_from: string | null;
  period_to: string | null;
  total_shifts: number;
  total_tokens: number;
  total_usd: Decimal;
}

export interface BestMonitor {
  monitor_id: string;
  full_name: string;
  total_shifts: number;
  total_usd: Decimal;
}
