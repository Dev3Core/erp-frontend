import { FormField, Notice, SubmitButton } from "@/shared/fluent/components";
import type { FormFailure } from "@/shared/lib/forms";
import type { RegisterValues } from "../auth";

const EMAIL_INPUT = {
  autoComplete: "username",
  spellCheck: false,
  enterKeyHint: "next",
  "data-msg-required": "Escribe tu correo.",
  "data-msg-format":
    "Escribe un correo válido, por ejemplo nombre@estudio.com.",
} as const;
const EMAIL_ERROR = "Escribe un correo válido, por ejemplo nombre@estudio.com.";

export function LoginFormView({
  email = "",
  failure,
  registered = false,
}: {
  email?: string;
  failure?: FormFailure | null;
  registered?: boolean;
}) {
  return (
    <div className="auth-form">
      {registered && !failure && (
        <Notice tone="success">
          Estudio creado. Ya puedes iniciar sesión.
        </Notice>
      )}
      {failure && <Notice>{failure.message}</Notice>}
      <form method="post" className="form" aria-label="Datos de acceso">
        <FormField
          name="email"
          label="Correo"
          type="email"
          value={email}
          required
          autoFocus={!email}
          errorText={EMAIL_ERROR}
          input={EMAIL_INPUT}
        />
        <FormField
          name="password"
          label="Contraseña"
          type="password"
          required
          reveal
          autoFocus={!!email}
          errorText="Escribe tu contraseña."
          input={{
            autoComplete: "current-password",
            enterKeyHint: "done",
            "data-msg-required": "Escribe tu contraseña.",
          }}
        />
        <SubmitButton>Iniciar sesión</SubmitButton>
      </form>
    </div>
  );
}

export function RegisterFormView({
  values = { studio_name: "", full_name: "", email: "" },
  failure,
}: {
  values?: RegisterValues;
  failure?: FormFailure | null;
}) {
  const fieldError = (name: string) =>
    failure?.fields[name] ? "Revisa este dato." : undefined;
  return (
    <div className="auth-form">
      {failure && <Notice>{failure.message}</Notice>}
      <form method="post" className="form" aria-label="Datos del estudio">
        <FormField
          name="studio_name"
          label="Nombre del estudio"
          value={values.studio_name}
          required
          autoFocus
          serverError={fieldError("studio_name")}
          errorText="Escribe el nombre del estudio (mínimo 2 caracteres)."
          input={{
            autoComplete: "organization",
            minLength: 2,
            maxLength: 255,
            enterKeyHint: "next",
            "data-msg-required": "Escribe el nombre del estudio.",
            "data-msg-short": "Usa al menos 2 caracteres.",
          }}
        />
        <FormField
          name="full_name"
          label="Tu nombre"
          value={values.full_name}
          required
          serverError={fieldError("full_name")}
          errorText="Escribe tu nombre (mínimo 2 caracteres)."
          input={{
            autoComplete: "name",
            minLength: 2,
            maxLength: 255,
            enterKeyHint: "next",
            "data-msg-required": "Escribe tu nombre.",
            "data-msg-short": "Usa al menos 2 caracteres.",
          }}
        />
        <FormField
          name="email"
          label="Correo"
          type="email"
          value={values.email}
          required
          serverError={fieldError("email")}
          errorText={EMAIL_ERROR}
          input={EMAIL_INPUT}
        />
        <FormField
          name="password"
          label="Contraseña"
          type="password"
          hint="Mínimo 8 caracteres."
          required
          reveal
          serverError={fieldError("password")}
          errorText="Usa al menos 8 caracteres."
          input={{
            autoComplete: "new-password",
            minLength: 8,
            maxLength: 128,
            enterKeyHint: "done",
            "data-msg-required": "Escribe una contraseña.",
            "data-msg-short": "Usa al menos 8 caracteres.",
          }}
        />
        <SubmitButton>Crear estudio</SubmitButton>
      </form>
    </div>
  );
}

export function MfaFormView({ failure }: { failure?: FormFailure | null }) {
  return (
    <div className="auth-form">
      {failure && <Notice>{failure.message}</Notice>}
      <form method="post" className="form" aria-label="Código de verificación">
        <FormField
          name="code"
          label="Código de verificación"
          hint="6 dígitos. Cambia cada 30 segundos."
          required
          autoFocus
          serverError={
            failure ? "El código no es correcto o ya caducó." : undefined
          }
          errorText="El código tiene exactamente 6 dígitos."
          input={{
            className: "otp-input",
            inputMode: "numeric",
            autoComplete: "one-time-code",
            pattern: "\\d{6}",
            maxLength: 6,
            enterKeyHint: "done",
            spellCheck: false,
            autoCapitalize: "none",
            "data-msg-required": "Escribe el código de 6 dígitos.",
            "data-msg-format": "El código tiene exactamente 6 dígitos.",
          }}
        />
        <SubmitButton>Verificar código</SubmitButton>
      </form>
    </div>
  );
}
