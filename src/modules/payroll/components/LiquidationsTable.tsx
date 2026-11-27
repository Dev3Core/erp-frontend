import { StatusBadge } from "@/shared/fluent/components";
import { DataTable } from "@/shared/fluent/table";
import { formatCop, formatDate, formatUsd } from "@/shared/lib/format";
import { LIQUIDATION_STATUS } from "../labels";
import type { Liquidation } from "../types";

export function LiquidationsTable({ rows }: { rows: Liquidation[] }) {
  return (
    <DataTable
      label="Liquidaciones"
      rows={rows}
      rowKey={(l) => l.id}
      columns={[
        {
          key: "period",
          label: "Periodo",
          render: (l) => (
            <>
              <span className="num">{formatDate(l.period_date)}</span>
              {l.notes && <span className="cell-sub">{l.notes}</span>}
            </>
          ),
        },
        {
          key: "status",
          label: "Estado",
          render: (l) => {
            const s = LIQUIDATION_STATUS[l.status];
            return <StatusBadge label={s.label} tone={s.tone} />;
          },
        },
        {
          key: "gross",
          label: "Bruto USD",
          align: "end",
          render: (l) => formatUsd(l.gross_usd),
        },
        {
          key: "net",
          label: "Neto USD",
          align: "end",
          render: (l) => formatUsd(l.net_usd),
        },
        {
          key: "trm",
          label: "TRM",
          align: "end",
          render: (l) => formatCop(l.trm_used),
        },
        {
          key: "cop",
          label: "A pagar COP",
          align: "end",
          render: (l) => <strong>{formatCop(l.cop_amount)}</strong>,
        },
      ]}
    />
  );
}
