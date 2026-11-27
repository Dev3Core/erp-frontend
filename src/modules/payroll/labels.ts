import type { Tone } from "@/shared/fluent/components";
import type { LiquidationStatus } from "./types";

export const LIQUIDATION_STATUS: Record<
  LiquidationStatus,
  { label: string; plural: string; tone: Tone }
> = {
  PENDING: { label: "Pendiente", plural: "Pendientes", tone: "warning" },
  APPROVED: { label: "Aprobada", plural: "Aprobadas", tone: "info" },
  PAID: { label: "Pagada", plural: "Pagadas", tone: "success" },
};

export const isLiquidationStatus = (v: unknown): v is LiquidationStatus =>
  typeof v === "string" && v in LIQUIDATION_STATUS;
