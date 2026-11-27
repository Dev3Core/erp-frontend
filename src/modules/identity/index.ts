// Public API of the identity module: sessions, auth actions, users, roles.
// Other modules and the app shell import only from "@/modules/identity".
import type { AppModule } from "@/shared/module";

export type { Me, Role, User } from "./types";
export { ROLE_LABEL, isStaff } from "./roles";
export { resolveSession, type SessionResult } from "./session";
export {
  hasSessionCookies,
  login,
  logout,
  register,
  verifyMfa,
  type RegisterValues,
} from "./auth";
export { listUsers, userDirectory } from "./queries";

export { default as LoginForm } from "./components/LoginForm.astro";
export { default as RegisterForm } from "./components/RegisterForm.astro";
export { default as MfaForm } from "./components/MfaForm.astro";
export { default as UsersPanel } from "./components/UsersPanel.astro";

export const identityModule: AppModule = {
  id: "identity",
  nav: [
    {
      href: "/app/users",
      label: "Equipo",
      icon: "users",
      roles: ["OWNER", "ADMIN"],
      order: 50,
    },
  ],
};
