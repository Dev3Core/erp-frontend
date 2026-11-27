import { ApiError, api, type ApiOptions } from "@/shared/api/client";

export type Loaded<T> = { ok: true; data: T } | { ok: false; message: string };

/**
 * Loads one section of a page. A failure degrades that section instead of
 * the whole page.
 */
export async function load<T>(
  locals: App.Locals,
  path: string,
  opts: Omit<ApiOptions, "cookie"> = {},
): Promise<Loaded<T>> {
  try {
    const { data } = await api<T>(path, { ...opts, cookie: locals.apiCookie });
    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof ApiError && error.status === 403
        ? "No tienes acceso a esta información."
        : "No se pudo cargar esta sección.";
    return { ok: false, message };
  }
}
