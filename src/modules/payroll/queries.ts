import type { CursorPage } from "@/shared/api/types";
import { load } from "@/shared/lib/load";
import type { Liquidation, LiquidationStatus } from "./types";

export const listLiquidations = (
  locals: App.Locals,
  filters: { status?: LiquidationStatus; cursor?: string } = {},
) =>
  load<CursorPage<Liquidation>>(locals, "/liquidations", {
    query: { limit: 25, ...filters },
  });
