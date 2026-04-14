"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

const ROLE_HOME: Record<string, string> = {
  OWNER: "/admin/dashboard",
  ADMIN: "/admin/dashboard",
  MONITOR: "/monitor/dashboard",
  MODEL: "/modelo/dashboard",
};

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await login({ email, password });

      if (res.mfa_required) {
        router.push("/auth/mfa");
        return;
      }

      router.push(ROLE_HOME[res.role] ?? "/admin/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("Error de conexion. Verifica que el servidor este corriendo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left panel - branding */}
      <div className="relative hidden bg-zinc-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-2 text-white">
          <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            StudioCore
          </span>
        </div>

        <div className="space-y-4">
          <blockquote className="text-lg font-medium leading-relaxed text-white/90">
            &ldquo;StudioCore transformo la forma en que manejamos nuestro
            estudio. Todo en un solo lugar, sin hojas de Excel ni WhatsApp.&rdquo;
          </blockquote>
          <p className="text-sm text-white/60">
            — Manager de estudio, Bogota
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-col">
        <div className="flex justify-end p-6 lg:p-8">
          <Link
            href="/auth/register"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Crear cuenta
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm space-y-6">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 text-primary-foreground"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                StudioCore
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Iniciar sesion
              </h1>
              <p className="text-sm text-muted-foreground">
                Ingresa tus credenciales para acceder a tu estudio
              </p>
            </div>

            {justRegistered && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                Registro exitoso. Ahora puedes iniciar sesion.
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contrasena</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Ingresando..." : "Iniciar sesion"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              No tienes cuenta?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Registra tu estudio
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
