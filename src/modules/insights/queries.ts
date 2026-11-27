import { todayBogota } from "@/shared/lib/format";
import { load } from "@/shared/lib/load";
import type {
  BestMonitor,
  DailyRevenueItem,
  MetricsOverview,
  ModelOverview,
  RevenueByModelItem,
  RevenueByPlatformItem,
} from "./types";

export const RANGE_DAYS = 30;

/** Last 30 calendar days in Bogota, inclusive. */
export const defaultRange = () => ({
  date_from: todayBogota(-(RANGE_DAYS - 1)),
  date_to: todayBogota(),
});

export const getOverview = (l: App.Locals) =>
  load<MetricsOverview>(l, "/metrics/overview", { query: defaultRange() });

export const getDailyRevenue = (l: App.Locals) =>
  load<{ items: DailyRevenueItem[] }>(l, "/metrics/daily-revenue", {
    query: defaultRange(),
  });

export const getTopModels = (l: App.Locals, limit = 5) =>
  load<{ items: RevenueByModelItem[]; total: number }>(
    l,
    "/metrics/revenue-by-model",
    { query: { ...defaultRange(), limit } },
  );

export const getRevenueByPlatform = (l: App.Locals) =>
  load<{ items: RevenueByPlatformItem[] }>(l, "/metrics/revenue-by-platform", {
    query: defaultRange(),
  });

export const getModelOverview = (l: App.Locals) =>
  load<ModelOverview>(l, "/metrics/model/overview", { query: defaultRange() });

export const getBestMonitor = (l: App.Locals) =>
  load<BestMonitor | null>(l, "/metrics/model/best-monitor");
