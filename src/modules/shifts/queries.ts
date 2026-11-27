import type { CursorPage } from "@/shared/api/types";
import { load } from "@/shared/lib/load";
import type { Shift, ShiftStatus } from "./types";

export interface ShiftFilters {
  status?: ShiftStatus;
  cursor?: string;
  limit?: number;
}

/**
 * Shifts visible to the current user. MODEL and MONITOR are narrowed to their
 * own shifts here for the UI; the API must enforce the same (ticket ERP-9).
 */
export function listShifts(locals: App.Locals, filters: ShiftFilters = {}) {
  const me = locals.me!;
  const query: Record<string, string | number | undefined> = {
    limit: filters.limit ?? 25,
    status: filters.status,
    cursor: filters.cursor,
  };
  if (me.role === "MODEL") query.model_id = me.user_id;
  if (me.role === "MONITOR") query.monitor_id = me.user_id;
  return load<CursorPage<Shift>>(locals, "/shifts", { query });
}
