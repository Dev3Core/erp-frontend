import type { NavEntry, Role } from "@/shared/module";
import { MODULES } from "./modules";

/** Sidebar entries from every registered module, in order. */
export const NAV: readonly NavEntry[] = MODULES.flatMap((m) => m.nav).sort(
  (a, b) => a.order - b.order,
);

export const navFor = (role: Role) =>
  NAV.filter((item) => item.roles.includes(role));

const normalize = (pathname: string) => pathname.replace(/\/+$/, "") || "/";

/** Roles allowed on a path (longest matching entry), or null if unlisted. */
export function rolesForPath(pathname: string): readonly Role[] | null {
  const path = normalize(pathname);
  const match = NAV.filter(
    (item) => path === item.href || path.startsWith(`${item.href}/`),
  ).sort((a, b) => b.href.length - a.href.length)[0];
  return match?.roles ?? null;
}

export const isCurrent = (pathname: string, href: string) => {
  const path = normalize(pathname);
  return href === "/app" ? path === "/app" : path.startsWith(href);
};
