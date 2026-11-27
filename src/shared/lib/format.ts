// Presentation helpers. es-CO locale, America/Bogota time zone.

const TZ = "America/Bogota";

const usd = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});
const int = new Intl.NumberFormat("es-CO");
const dateTime = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: TZ,
});
const dateOnly = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeZone: "UTC",
});
const dayShort = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const num = (value: string | number | null | undefined) => {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

export const formatUsd = (v: string | number | null | undefined) =>
  usd.format(num(v));
export const formatCop = (v: string | number | null | undefined) =>
  cop.format(num(v));
export const formatInt = (v: string | number | null | undefined) =>
  int.format(num(v));

/** ISO timestamp -> local date and time in Bogota. */
export const formatDateTime = (iso: string | null | undefined) =>
  iso ? dateTime.format(new Date(iso)) : "—";

/** YYYY-MM-DD (a calendar date, no time zone) -> readable date. */
export const formatDate = (ymd: string | null | undefined) =>
  ymd ? dateOnly.format(new Date(`${ymd}T00:00:00Z`)) : "—";

export const formatDay = (ymd: string) =>
  dayShort.format(new Date(`${ymd}T00:00:00Z`));

/** Today's calendar date in Bogota as YYYY-MM-DD. */
export function todayBogota(offsetDays = 0): string {
  const now = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);
}

export const toNumber = num;

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("es"))
    .join("");
