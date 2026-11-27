// Public API of the insights module: dashboard metrics and widgets.
// Depends on: studio (platform labels).
import { ALL_ROLES, type AppModule } from "@/shared/module";

export type * from "./types";
export { defaultRange } from "./queries";
export { default as StudioKpis } from "./components/StudioKpis.astro";
export { default as ModelKpis } from "./components/ModelKpis.astro";
export { default as DailyRevenuePanel } from "./components/DailyRevenuePanel.astro";
export { default as TopModelsPanel } from "./components/TopModelsPanel.astro";
export { default as PlatformSharePanel } from "./components/PlatformSharePanel.astro";

export const insightsModule: AppModule = {
  id: "insights",
  nav: [
    {
      href: "/app",
      label: "Resumen",
      icon: "dashboard",
      roles: ALL_ROLES,
      order: 10,
    },
  ],
};
