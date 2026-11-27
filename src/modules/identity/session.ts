import type { AstroCookies } from "astro";
import {
  ApiError,
  api,
  clearSession,
  relaySessionCookies,
  sessionCookieHeader,
} from "@/shared/api/client";
import type { Me } from "./types";

// The JWT carries no role or tenant, so each protected request asks the API
// who the user is. An expired access token is rotated once with the refresh
// token; the new cookies go back to the browser.

export type SessionResult =
  | { status: "authenticated"; me: Me; apiCookie: string }
  | { status: "anonymous" };

export async function resolveSession(
  cookies: AstroCookies,
  clientIp: string,
): Promise<SessionResult> {
  const hasAccess = cookies.has("access_token");
  const hasRefresh = cookies.has("refresh_token");
  if (!hasAccess && !hasRefresh) return { status: "anonymous" };

  let cookie = sessionCookieHeader(cookies);
  try {
    const { data } = await api<Me>("/auth/me", { cookie, clientIp });
    return { status: "authenticated", me: data, apiCookie: cookie };
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
  }

  if (!hasRefresh) {
    clearSession(cookies);
    return { status: "anonymous" };
  }
  try {
    const { res } = await api("/auth/refresh", {
      method: "POST",
      cookie,
      clientIp,
    });
    cookie = sessionCookieHeader(cookies, relaySessionCookies(res, cookies));
    const { data } = await api<Me>("/auth/me", { cookie, clientIp });
    return { status: "authenticated", me: data, apiCookie: cookie };
  } catch {
    clearSession(cookies);
    return { status: "anonymous" };
  }
}
