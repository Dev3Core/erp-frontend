import type { Tone } from "@/shared/fluent/components";
import type { ShiftStatus } from "./types";

export const SHIFT_STATUS: Record<
  ShiftStatus,
  { label: string; plural: string; tone: Tone }
> = {
  SCHEDULED: { label: "Programado", plural: "Programados", tone: "warning" },
  ACTIVE: { label: "En curso", plural: "En curso", tone: "info" },
  FINISHED: { label: "Finalizado", plural: "Finalizados", tone: "success" },
  CANCELLED: { label: "Cancelado", plural: "Cancelados", tone: "neutral" },
};

export const isShiftStatus = (v: unknown): v is ShiftStatus =>
  typeof v === "string" && v in SHIFT_STATUS;
