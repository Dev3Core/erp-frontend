import { Button } from "@fluentui/react-components";
import { Open16Regular } from "@fluentui/react-icons";
import { StatusBadge } from "@/shared/fluent/components";
import { DataTable } from "@/shared/fluent/table";
import { formatDate } from "@/shared/lib/format";
import { PLATFORM_LABEL, ROOM_STATUS } from "../labels";
import type { Room } from "../types";

export function RoomsTable({ rooms }: { rooms: Room[] }) {
  return (
    <DataTable
      label="Salas activas"
      rows={rooms}
      rowKey={(r) => r.id}
      columns={[
        {
          key: "name",
          label: "Sala",
          render: (r) => <strong>{r.name}</strong>,
        },
        {
          key: "platform",
          label: "Plataforma",
          render: (r) => PLATFORM_LABEL[r.platform],
        },
        {
          key: "status",
          label: "Estado",
          render: (r) => <StatusBadge {...ROOM_STATUS[r.status]} />,
        },
        {
          key: "created",
          label: "Alta",
          render: (r) => (
            <span className="num">{formatDate(r.created_at.slice(0, 10))}</span>
          ),
        },
        {
          key: "open",
          label: "Enlace",
          hiddenLabel: true,
          align: "end",
          render: (r) => (
            <Button
              as="a"
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              appearance="subtle"
              size="small"
              icon={<Open16Regular />}
              iconPosition="after"
            >
              Abrir
              <span className="visually-hidden">
                {` ${r.name} en ${PLATFORM_LABEL[r.platform]} (nueva pestaña)`}
              </span>
            </Button>
          ),
        },
      ]}
    />
  );
}
