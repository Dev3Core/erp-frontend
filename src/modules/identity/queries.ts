import type { OffsetPage } from "@/shared/api/types";
import { load } from "@/shared/lib/load";
import type { User } from "./types";

/** Studio members (OWNER/ADMIN only on the API side). */
export const listUsers = (locals: App.Locals) =>
  load<OffsetPage<User>>(locals, "/users", { query: { limit: 200 } });

/** id -> full name, for modules that only hold user ids. Empty for non-staff. */
export async function userDirectory(locals: App.Locals) {
  const names = new Map<string, string>();
  const me = locals.me;
  if (me) names.set(me.user_id, me.full_name);
  if (me && (me.role === "OWNER" || me.role === "ADMIN")) {
    const users = await listUsers(locals);
    if (users.ok)
      for (const u of users.data.items) names.set(u.id, u.full_name);
  }
  return names;
}
