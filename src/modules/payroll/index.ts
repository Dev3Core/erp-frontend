// Public API of the payroll module: liquidations (and later split configs,
// TRM, monitor salaries, salary advances).
import { STAFF_ROLES, type AppModule } from "@/shared/module";

export type { Liquidation, LiquidationStatus } from "./types";
export { LIQUIDATION_STATUS } from "./labels";
export { listLiquidations } from "./queries";
export { default as LiquidationsPanel } from "./components/LiquidationsPanel.astro";

export const payrollModule: AppModule = {
  id: "payroll",
  nav: [
    {
      href: "/app/liquidations",
      label: "Liquidaciones",
      icon: "liquidations",
      roles: STAFF_ROLES,
      order: 40,
    },
  ],
};
