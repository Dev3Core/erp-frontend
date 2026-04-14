"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const { register } = useAuth();

  const [studioName, setStudioName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({
        studio_name: studioName,
        full_name: fullName,
        email,
        password,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("Error de conexion. Verifica que el servidor este corriendo.");
      }
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
          <h2 className="text-2xl font-bold text-white">
            Todo tu estudio en un solo lugar
          </h2>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-4 shrink-0 text-emerald-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Dashboard con metricas en tiempo real
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-4 shrink-0 text-emerald-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Gestion de monitores, modelos y turnos
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-4 shrink-0 text-emerald-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Liquidaciones automaticas USD a COP
            </li>
            <li className="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-4 shrink-0 text-emerald-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Aislamiento total entre estudios
            </li>
          </ul>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-col">
        <div className="flex justify-end p-6 lg:p-8">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Ya tienes cuenta? Inicia sesion
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
                Registra tu estudio
              </h1>
              <p className="text-sm text-muted-foreground">
                Crea tu cuenta y empieza a gestionar tu estudio
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studio_name">Nombre del estudio</Label>
                <Input
                  id="studio_name"
                  type="text"
                  placeholder="Mi Estudio"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={255}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Tu nombre completo</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Juan Perez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={255}
                />
              </div>

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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contrasena</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Creando estudio..." : "Crear estudio"}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              Al registrarte aceptas nuestros terminos de servicio y politica de
              privacidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
