import { STAFF_ROLES, type Role } from "@/shared/module";

export const ROLE_LABEL: Record<Role, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  MONITOR: "Monitor",
  MODEL: "Modelo",
};

export const isStaff = (role: Role) =>
  (STAFF_ROLES as readonly Role[]).includes(role);
