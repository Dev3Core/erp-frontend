import { ApiError } from "@/shared/api/client";

export const str = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
};

/** Only same-site paths inside /app are valid post-login destinations. */
export function safeNext(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/app") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/app";
  }
  try {
    const url = new URL(value, "http://local");
    return url.origin === "http://local"
      ? `${url.pathname}${url.search}`
      : "/app";
  } catch {
    return "/app";
  }
}

export interface FormFailure {
  message: string;
  fields: Record<string, string>;
}

/** Turns an API error into a message for the user. */
export function toFailure(
  error: unknown,
  messages: Partial<Record<number, string>> = {},
): FormFailure {
  if (error instanceof ApiError) {
    const fallback: Record<number, string> = {
      401: "Tu sesión terminó. Vuelve a iniciar sesión.",
      403: "No tienes permiso para hacer esto.",
      404: "El registro ya no existe.",
      409: "Ya existe un registro con esos datos.",
      429: "Demasiados intentos. Espera un minuto y vuelve a probar.",
      503: "El servicio no está disponible. Inténtalo de nuevo en un momento.",
    };
    return {
      message:
        messages[error.status] ?? fallback[error.status] ?? error.message,
      fields: error.fields,
    };
  }
  return { message: "Algo salió mal. Inténtalo de nuevo.", fields: {} };
}
