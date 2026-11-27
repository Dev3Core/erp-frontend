import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import type { ReactNode } from "react";

// Thin, declarative wrapper over Fluent's Table for read-only lists.
// The first column is the row header; every other cell carries its column
// label (data-label) so the table can stack on narrow containers.

export interface Column<T> {
  key: string;
  label: string;
  align?: "start" | "end";
  /** Visually hidden header (e.g. an actions column). */
  hiddenLabel?: boolean;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({
  label,
  columns,
  rows,
  rowKey,
}: {
  label: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}) {
  return (
    <div
      className="table-wrapper"
      tabIndex={0}
      role="region"
      aria-label={label}
    >
      <Table aria-label={label} size="medium">
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHeaderCell
                key={c.key}
                className={c.align === "end" ? "align-end" : undefined}
              >
                {c.hiddenLabel ? (
                  <span className="visually-hidden">{c.label}</span>
                ) : (
                  c.label
                )}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((c, i) => (
                <TableCell
                  key={c.key}
                  className={c.align === "end" ? "align-end num" : undefined}
                  data-label={i === 0 || c.hiddenLabel ? undefined : c.label}
                >
                  {c.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
