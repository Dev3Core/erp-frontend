import {
  Badge,
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Select,
  type InputProps,
} from "@fluentui/react-components";
import { Eye20Regular, EyeOff20Regular } from "@fluentui/react-icons";
import type { ReactNode } from "react";

// Shared Fluent UI building blocks, rendered on the server (see render.ts).
// Interactivity that would normally need React state (show password,
// validation messages) is driven by src/shared/scripts/enhance.ts through
// data-* attributes, so it works without hydrating React.

export type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const BADGE_COLOR = {
  neutral: "subtle",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "informative",
} as const;

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: Tone;
}) {
  return (
    <Badge appearance="tint" shape="rounded" color={BADGE_COLOR[tone]}>
      {label}
    </Badge>
  );
}

export function Notice({
  tone = "error",
  children,
}: {
  tone?: "error" | "success";
  children: ReactNode;
}) {
  return (
    <MessageBar
      intent={tone}
      layout="multiline"
      role={tone === "error" ? "alert" : "status"}
    >
      <MessageBarBody>{children}</MessageBarBody>
    </MessageBar>
  );
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: InputProps["type"];
  id?: string;
  value?: string;
  hint?: string;
  required?: boolean;
  autoFocus?: boolean;
  /** Shown when the browser rejects the value (:user-invalid). */
  errorText?: string;
  /** Error returned by the API for this field. */
  serverError?: string;
  /** Adds a show/hide toggle (type must be password). */
  reveal?: boolean;
  /** Extra attributes for the native <input> (autocomplete, minlength, data-*…). */
  input?: Record<string, string | number | boolean | undefined>;
}

export function FormField({
  name,
  label,
  type = "text",
  id = name,
  value,
  hint,
  required,
  autoFocus,
  errorText = "Revisa este campo.",
  serverError,
  reveal = false,
  input = {},
}: FormFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <Field
        // Keep label[for] = input[id]: our own id is needed by the password
        // toggle (aria-controls) and by autofill heuristics.
        label={{ children: label, htmlFor: id }}
        required={required}
        hint={hint}
        size="large"
        validationState={serverError ? "error" : "none"}
        validationMessage={serverError}
      >
        <Input
          id={id}
          name={name}
          type={type}
          defaultValue={value}
          required={required}
          autoFocus={autoFocus}
          size="large"
          appearance="outline"
          input={
            {
              ...input,
              "data-error": serverError ? undefined : errorId,
              "aria-invalid": serverError ? "true" : "false",
            } as InputProps["input"]
          }
          contentAfter={
            reveal ? (
              <Button
                type="button"
                appearance="transparent"
                size="small"
                aria-label="Mostrar contraseña"
                aria-pressed="false"
                aria-controls={id}
                data-password-toggle=""
                icon={
                  <span className="reveal-icons">
                    <span data-icon="eye">
                      <Eye20Regular />
                    </span>
                    <span data-icon="eye-off">
                      <EyeOff20Regular />
                    </span>
                  </span>
                }
              />
            ) : undefined
          }
        />
      </Field>
      {!serverError && (
        <p id={errorId} className="field-error">
          {errorText}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <Button
      type="submit"
      appearance="primary"
      size="large"
      className="btn-block"
    >
      {children}
    </Button>
  );
}

export function LinkButton({
  href,
  children,
  appearance = "secondary",
  size = "medium",
}: {
  href: string;
  children: ReactNode;
  appearance?: "primary" | "secondary" | "subtle" | "transparent";
  size?: "small" | "medium" | "large";
}) {
  return (
    <Button as="a" href={href} appearance={appearance} size={size}>
      {children}
    </Button>
  );
}

/** GET filter form with a single select (works without JavaScript). */
export function SelectFilter({
  name,
  label,
  value,
  allLabel,
  options,
}: {
  name: string;
  label: string;
  value?: string;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  return (
    <search>
      <form method="get" className="filters">
        <label htmlFor={`filter-${name}`} className="visually-hidden">
          {label}
        </label>
        <Select
          id={`filter-${name}`}
          name={name}
          defaultValue={value ?? ""}
          size="small"
        >
          <option value="">{allLabel}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Button type="submit" size="small" appearance="secondary">
          Filtrar
        </Button>
      </form>
    </search>
  );
}
