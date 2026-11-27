import type { AstroCookies } from "astro";

// Server-side client for erp-backend. Only runs on the Astro server: the
// browser talks to Astro, and Astro forwards the HttpOnly session cookies.

const API_URL = (
  import.meta.env.API_URL ??
  process.env.API_URL ??
  "http://localhost:8000"
).replace(/\/+$/, "");

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: unknown): value is string =>
  typeof value === "string" && UUID_RE.test(value);

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    /** Field name -> message, from FastAPI 422 responses. */
    public fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | boolean | null | undefined>;

export interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  /** Cookie header to forward (Astro.locals.apiCookie or the request's). */
  cookie?: string;
  /** Real client IP, so the API's per-IP rate limits apply per user. */
  clientIp?: string;
}

export interface ApiResult<T> {
  data: T;
  res: Response;
}

function buildUrl(path: string, query?: Query): URL {
  // Paths are built by this app, never taken from the request. Still, refuse
  // anything that could escape /api/v1.
  if (!/^\/[\w\-/.]*$/.test(path) || path.includes("..")) {
    throw new Error(`Invalid API path: ${path}`);
  }
  const url = new URL(`/api/v1${path}`, API_URL);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

function parseError(status: number, payload: unknown): ApiError {
  const detail = (payload as { detail?: unknown } | null)?.detail;
  if (Array.isArray(detail)) {
    const fields: Record<string, string> = {};
    for (const item of detail as { loc?: unknown[]; msg?: string }[]) {
      const field = item.loc?.at(-1);
      if (typeof field === "string" && item.msg) fields[field] = item.msg;
    }
    return new ApiError(status, "Revisa los campos marcados.", fields);
  }
  if (typeof detail === "string") return new ApiError(status, detail);
  return new ApiError(status, `La API respondió ${status}.`);
}

export async function api<T>(
  path: string,
  { method = "GET", body, query, cookie, clientIp }: ApiOptions = {},
): Promise<ApiResult<T>> {
  const headers = new Headers({ accept: "application/json" });
  if (body !== undefined) headers.set("content-type", "application/json");
  if (cookie) headers.set("cookie", cookie);
  if (clientIp) headers.set("x-forwarded-for", clientIp);

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
      redirect: "manual",
    });
  } catch {
    throw new ApiError(503, "No se pudo contactar con la API.");
  }

  const isJson = res.headers.get("content-type")?.includes("json");
  const payload: unknown = isJson ? await res.json().catch(() => null) : null;
  if (!res.ok) throw parseError(res.status, payload);
  return { data: payload as T, res };
}

/** Raw passthrough for binary responses (CSV/PDF exports). */
export async function apiRaw(
  path: string,
  { query, cookie, clientIp }: ApiOptions = {},
): Promise<Response> {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  if (clientIp) headers.set("x-forwarded-for", clientIp);
  return fetch(buildUrl(path, query), {
    headers,
    signal: AbortSignal.timeout(30_000),
    redirect: "manual",
  });
}

// --- Cookie relay --------------------------------------------------------

const SESSION_COOKIES = new Set(["access_token", "refresh_token"]);

interface ParsedCookie {
  name: string;
  value: string;
  maxAge?: number;
  expired: boolean;
}

function parseSetCookie(line: string): ParsedCookie | null {
  const [pair, ...attrs] = line.split(";");
  const eq = pair.indexOf("=");
  if (eq < 1) return null;
  const name = pair.slice(0, eq).trim();
  let value = pair.slice(eq + 1).trim();
  if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
  let maxAge: number | undefined;
  let expired = false;
  for (const attr of attrs) {
    const [k, v = ""] = attr.split("=");
    const key = k.trim().toLowerCase();
    if (key === "max-age") {
      maxAge = Number(v);
      if (maxAge <= 0) expired = true;
    }
    if (key === "expires" && Date.parse(v) <= Date.now()) expired = true;
  }
  return { name, value, maxAge, expired };
}

/**
 * Copies the API's session cookies onto the Astro response. Only the two
 * known session cookies are relayed, always HttpOnly + SameSite=Lax.
 */
export function relaySessionCookies(res: Response, cookies: AstroCookies) {
  const secure = import.meta.env.PROD && process.env.COOKIE_SECURE !== "false";
  const updated: Record<string, string | null> = {};
  for (const line of res.headers.getSetCookie()) {
    const parsed = parseSetCookie(line);
    if (!parsed || !SESSION_COOKIES.has(parsed.name)) continue;
    if (parsed.expired || parsed.value === "") {
      cookies.delete(parsed.name, { path: "/" });
      updated[parsed.name] = null;
    } else {
      cookies.set(parsed.name, parsed.value, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure,
        maxAge: parsed.maxAge,
      });
      updated[parsed.name] = parsed.value;
    }
  }
  return updated;
}

/** Cookie header with the session cookies (after a possible rotation). */
export function sessionCookieHeader(
  cookies: AstroCookies,
  overrides: Record<string, string | null> = {},
): string {
  const parts: string[] = [];
  for (const name of SESSION_COOKIES) {
    const value =
      name in overrides ? overrides[name] : cookies.get(name)?.value;
    if (value) parts.push(`${name}=${value}`);
  }
  return parts.join("; ");
}

export function clearSession(cookies: AstroCookies) {
  for (const name of SESSION_COOKIES) cookies.delete(name, { path: "/" });
}
