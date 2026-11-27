// Public API of the shifts module: shifts (and later shift reports, chat).
// Depends on: identity (user names), studio (room names).
import { ALL_ROLES, type AppModule } from "@/shared/module";

export type { Shift, ShiftStatus } from "./types";
export { SHIFT_STATUS } from "./labels";
export { listShifts, type ShiftFilters } from "./queries";
export { default as ShiftsPanel } from "./components/ShiftsPanel.astro";

export const shiftsModule: AppModule = {
  id: "shifts",
  nav: [
    {
      href: "/app/shifts",
      label: "Turnos",
      icon: "shifts",
      roles: ALL_ROLES,
      order: 20,
    },
  ],
};
