import { Persona } from "@fluentui/react-components";
import { StatusBadge } from "@/shared/fluent/components";
import { DataTable } from "@/shared/fluent/table";
import { formatDate } from "@/shared/lib/format";
import { ROLE_LABEL } from "../roles";
import type { User } from "../types";

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      label="Personas del estudio"
      rows={users}
      rowKey={(u) => u.id}
      columns={[
        {
          key: "name",
          label: "Nombre",
          render: (u) => (
            <Persona
              name={u.full_name}
              secondaryText={u.email}
              size="medium"
              avatar={{ color: "colorful", "aria-hidden": true }}
            />
          ),
        },
        { key: "role", label: "Rol", render: (u) => ROLE_LABEL[u.role] },
        {
          key: "status",
          label: "Estado",
          render: (u) => (
            <StatusBadge
              label={u.is_active ? "Activo" : "Inactivo"}
              tone={u.is_active ? "success" : "neutral"}
            />
          ),
        },
        {
          key: "mfa",
          label: "Verificación en dos pasos",
          render: (u) => (u.mfa_enabled ? "Activada" : "No"),
        },
        {
          key: "created",
          label: "Alta",
          render: (u) => (
            <span className="num">{formatDate(u.created_at.slice(0, 10))}</span>
          ),
        },
      ]}
    />
  );
}
