// Transport types shared by every module (erp-backend app/core/pagination.py).

/** Decimal values arrive from the API as strings. */
export type Decimal = string;

export interface OffsetPage<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface CursorPage<T> {
  items: T[];
  next_cursor: string | null;
  prev_cursor: string | null;
  limit: number;
}
