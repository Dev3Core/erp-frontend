import type { AstroCookies } from "astro";
import {
  api,
  clearSession,
  relaySessionCookies,
  sessionCookieHeader,
} from "@/shared/api/client";
import { str, toFailure, type FormFailure } from "@/shared/lib/forms";
import type { LoginResponse } from "./types";

// Server-side auth actions. Each returns a result the page turns into a
// redirect (success) or a re-render with errors (failure).

type Result<T = void> =
  { ok: true; value: T } | { ok: false; failure: FormFailure };

export interface Ctx {
  cookies: AstroCookies;
  clientIp: string;
}

export async function login(
  form: FormData,
  { cookies, clientIp }: Ctx,
): Promise<Result<{ mfaRequired: boolean }> & { email: string }> {
  const email = str(form, "email");
  const password = form.get("password");
  try {
    const { data, res } = await api<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password: typeof password === "string" ? password : "" },
      clientIp,
    });
    relaySessionCookies(res, cookies);
    return { ok: true, value: { mfaRequired: data.mfa_required }, email };
  } catch (error) {
    return {
      ok: false,
      email,
      failure: toFailure(error, {
        401: "Correo o contraseña incorrectos.",
        403: "Tu cuenta está desactivada. Habla con el administrador del estudio.",
        422: "Escribe un correo y una contraseña válidos.",
      }),
    };
  }
}

export interface RegisterValues {
  studio_name: string;
  full_name: string;
  email: string;
}

export async function register(
  form: FormData,
  { clientIp }: Pick<Ctx, "clientIp">,
): Promise<Result & { values: RegisterValues }> {
  const values = {
    studio_name: str(form, "studio_name"),
    full_name: str(form, "full_name"),
    email: str(form, "email"),
  };
  const password = form.get("password");
  try {
    await api("/auth/register", {
      method: "POST",
      body: {
        ...values,
        password: typeof password === "string" ? password : "",
      },
      clientIp,
    });
    return { ok: true, value: undefined, values };
  } catch (error) {
    return {
      ok: false,
      values,
      failure: toFailure(error, {
        409: "Ese correo ya está registrado. Inicia sesión o usa otro.",
      }),
    };
  }
}

export async function verifyMfa(
  form: FormData,
  { cookies, clientIp }: Ctx,
): Promise<Result> {
  const code = str(form, "code").replace(/\s+/g, "");
  try {
    const { res } = await api("/auth/mfa/verify", {
      method: "POST",
      body: { code },
      cookie: sessionCookieHeader(cookies),
      clientIp,
    });
    relaySessionCookies(res, cookies);
    return { ok: true, value: undefined };
  } catch (error) {
    const wrong = "El código no es correcto o ya caducó. Usa el código actual.";
    return { ok: false, failure: toFailure(error, { 400: wrong, 401: wrong }) };
  }
}

export async function logout({ cookies, clientIp }: Ctx) {
  try {
    // Blacklists both tokens in Redis.
    await api("/auth/logout", {
      method: "POST",
      cookie: sessionCookieHeader(cookies),
      clientIp,
    });
  } catch {
    // The local session is cleared anyway.
  }
  clearSession(cookies);
}

export const hasSessionCookies = (cookies: AstroCookies) =>
  cookies.has("access_token") || cookies.has("refresh_token");
