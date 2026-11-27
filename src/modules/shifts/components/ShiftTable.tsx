import { StatusBadge } from "@/shared/fluent/components";
import { DataTable, type Column } from "@/shared/fluent/table";
import { formatDateTime, formatInt, formatUsd } from "@/shared/lib/format";
import { SHIFT_STATUS } from "../labels";
import type { Shift } from "../types";

export function ShiftTable({
  label,
  shifts,
  rooms,
  people,
  hideModel = false,
}: {
  label: string;
  shifts: Shift[];
  /** id -> name (plain objects: props must be serialisable). */
  rooms: Record<string, string>;
  people: Record<string, string>;
  hideModel?: boolean;
}) {
  const name = (map: Record<string, string>, id: string | null) =>
    id ? (map[id] ?? "—") : "Sin asignar";

  const columns: Column<Shift>[] = [
    {
      key: "start",
      label: "Inicio",
      render: (s) => (
        <>
          <span className="num">{formatDateTime(s.start_time)}</span>
          {s.end_time && (
            <span className="cell-sub">Fin {formatDateTime(s.end_time)}</span>
          )}
        </>
      ),
    },
    ...(hideModel
      ? []
      : [
          {
            key: "model",
            label: "Modelo",
            render: (s: Shift) => name(people, s.model_id),
          },
        ]),
    { key: "room", label: "Sala", render: (s) => name(rooms, s.room_id) },
    {
      key: "monitor",
      label: "Monitor",
      render: (s) => name(people, s.monitor_id),
    },
    {
      key: "status",
      label: "Estado",
      render: (s) => {
        const st = SHIFT_STATUS[s.status];
        return <StatusBadge label={st.label} tone={st.tone} />;
      },
    },
    {
      key: "tokens",
      label: "Tokens",
      align: "end",
      render: (s) => formatInt(s.tokens_earned),
    },
    {
      key: "usd",
      label: "USD",
      align: "end",
      render: (s) => formatUsd(s.usd_earned),
    },
  ];

  return (
    <DataTable
      label={label}
      rows={shifts}
      rowKey={(s) => s.id}
      columns={columns}
    />
  );
}
