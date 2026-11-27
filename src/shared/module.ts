import type { IconName } from "@/shared/ui/Icon.astro";

// Contract every feature module fulfils. The app shell discovers modules
// through `src/app/modules.ts`; adding a module = writing its descriptor
// and registering it there. No other file changes.

/** Access roles of the platform (erp-backend app/models/user.py). */
export type Role = "OWNER" | "ADMIN" | "MONITOR" | "MODEL";

export const STAFF_ROLES = ["OWNER", "ADMIN"] as const satisfies Role[];
export const ALL_ROLES = [
  "OWNER",
  "ADMIN",
  "MONITOR",
  "MODEL",
] as const satisfies Role[];

export interface NavEntry {
  href: string;
  label: string;
  icon: IconName;
  /** Roles that see the entry. The API still enforces permissions. */
  roles: readonly Role[];
  /** Position in the sidebar (lower first). */
  order: number;
}

export interface AppModule {
  id: string;
  nav: readonly NavEntry[];
}
