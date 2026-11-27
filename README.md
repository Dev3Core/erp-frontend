# ERP Frontend: gestión de estudios webcam

Frontend del SaaS multi-tenant para estudios webcam, hecho con **Astro 7 en modo SSR**. Consume la API de [`erp-backend`](https://github.com/Dev3Core/erp-backend).

## Cómo funciona

- **El servidor de Astro habla con la API; el navegador nunca la llama directamente.** Las cookies de sesión (`access_token` y `refresh_token`, ambas HttpOnly) llegan a Astro, que las reenvía a la API y retransmite las rotaciones. No hace falta configurar CORS ni cookies cross-site.
- **Middleware** (`src/middleware.ts`): en `/app/*` llama a `GET /auth/me`. Si recibe 401, renueva el token con el refresh; si eso falla, redirige a `/login?next=…`. El rol solo da forma a la interfaz: los permisos los aplica la API.
- **Formularios HTML** con POST y redirección (PRG): funcionan sin JavaScript. `security.checkOrigin` protege de CSRF y `security.csp` genera la CSP con hashes.
- **JavaScript mínimo de mejora progresiva** (`src/scripts`): validación accesible (`aria-invalid` sincronizado con `:user-invalid`), mostrar u ocultar la contraseña, prevención del doble envío y drawer móvil.
- **Fluent UI React v9 renderizado en servidor**: los controles son Fluent, pero React no llega al navegador. El tema (grises neutros de Fluent 2 y acento champán, con modo claro y oscuro) se genera con `node scripts/build-theme.mjs`. Las tablas se apilan en pantallas estrechas mediante container queries.

El código está organizado por módulos de dominio (`identity`, `studio`, `shifts`, `payroll`, `insights`) con fronteras comprobadas en los tests. Consulta [docs/architecture.md](docs/architecture.md).

## Desarrollo local

Requisitos: Node 22.23+ (o 24) y pnpm.

1. Levanta el backend (`make dev` en `erp-backend`).
2. Instala dependencias y configura el entorno:

   ```bash
   pnpm install
   ```

   ```bash
   cp .env.example .env
   ```

3. Opcional: carga datos de prueba (un estudio, equipo, salas, 30 días de turnos y liquidaciones). Las credenciales de prueba están al principio de `scripts/seed-dev.mjs`.

   ```bash
   node scripts/seed-dev.mjs
   ```

4. Arranca el front en http://localhost:3000:

   ```bash
   pnpm dev
   ```

## Scripts

| Comando                        | Qué hace                                      |
| ------------------------------ | --------------------------------------------- |
| `pnpm dev`                     | Servidor de desarrollo en el puerto 3000      |
| `pnpm build`                   | Build de producción en `dist/`                |
| `pnpm start`                   | Sirve el build (`node dist/server/entry.mjs`) |
| `pnpm check`                   | Comprobación de tipos de Astro y TypeScript   |
| `pnpm test`                    | Tests unitarios (Vitest)                      |
| `pnpm format` / `format:check` | Prettier                                      |

## Variables de entorno

| Variable        | Descripción                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------- |
| `API_URL`       | URL de `erp-backend` vista desde el servidor de Astro (por defecto `http://localhost:8000`) |
| `COOKIE_SECURE` | `false` solo para probar el build sin HTTPS; en producción las cookies salen con `Secure`   |
| `HOST`, `PORT`  | Dirección y puerto del servidor Node en producción                                          |

## Producción

`.docker/Dockerfile` construye una imagen multi-stage que ejecuta Node como usuario no-root. El front y la API deben servirse con HTTPS y desde el mismo sitio registrable. La planificación y las tareas abiertas están en Linear (proyecto _ERP Webcam — MVP funcional_).
