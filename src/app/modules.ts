import { identityModule } from "@/modules/identity";
import { insightsModule } from "@/modules/insights";
import { payrollModule } from "@/modules/payroll";
import { shiftsModule } from "@/modules/shifts";
import { studioModule } from "@/modules/studio";
import type { AppModule } from "@/shared/module";

// Module registry: the only place that knows which modules exist.
// To add a module: create src/modules/<name>/index.ts exporting an
// AppModule descriptor, register it here, add its routes in src/pages.
export const MODULES: readonly AppModule[] = [
  insightsModule,
  shiftsModule,
  studioModule,
  payrollModule,
  identityModule,
];
