# Arquitectura del frontend

El frontend está organizado por **módulos de dominio** con fronteras estrictas, igual que el backend (monolito modular). Un módulo agrupa todo lo de su dominio: tipos, consultas a la API, acciones, componentes y su entrada en la navegación.

```
src/
  shared/            sin conocimiento de dominio
    api/             cliente HTTP del servidor, cookies de sesión, tipos de paginación
    lib/             formato (es-CO, America/Bogota), formularios, carga tolerante a fallos
    ui/              Icon, TextField, Alert, Badge, KpiCard, Panel, EmptyState, CursorNav, ColumnChart
    styles/          tokens.css (tema), base.css, components.css
    scripts/         mejora progresiva (validación accesible, contraseña, doble envío)
    module.ts        contrato de módulo (AppModule, NavEntry, Role)
  modules/
    identity/        sesión, login/registro/MFA/logout, usuarios, roles
    studio/          salas (más adelante: tags, fichas técnicas, bios, macros)
    shifts/          turnos (más adelante: reportes, chat)
    payroll/         liquidaciones (más adelante: reparto, TRM, sueldos, adelantos)
    insights/        métricas y widgets del dashboard
  app/               shell: layouts, barra lateral, drawer, registro de módulos
    modules.ts       el único sitio que conoce qué módulos existen
    navigation.ts    navegación y permisos por ruta, derivados de los módulos
  pages/             rutas finas: componen módulos, no contienen lógica
  middleware.ts      sesión (identity) + control de rol (navigation)
```

## Reglas

1. **`shared` no conoce el dominio.** No importa de `modules`, `app` ni `pages`.
2. **Cada módulo expone su API pública en `index.ts`.** Desde fuera solo se importa `@/modules/<nombre>`; los archivos internos (`queries.ts`, `components/…`) son privados.
3. **Los módulos no dependen del shell** (`app`) ni de las páginas.
4. **Las dependencias entre módulos son explícitas** y se declaran en el comentario de cabecera de su `index.ts`:
   - `shifts` → `identity` (nombres de personas) y `studio` (nombres de salas)
   - `insights` → `studio` (nombres de plataforma)
5. **Las páginas son finas**: leen parámetros, llaman a una acción del módulo si hay POST, redirigen o renderizan los paneles del módulo.

`tests/architecture.test.ts` comprueba las reglas 1 a 3 en cada `pnpm test` (y en CI): falla si un archivo cruza una frontera.

## Widgets autosuficientes

Los paneles de un módulo (`ShiftsPanel`, `StudioKpis`, `DailyRevenuePanel`…) cargan sus propios datos con `load()` y degradan solos: si la API falla, el panel muestra un aviso y el resto de la página sigue funcionando. Una página nueva es una composición de paneles.

## Cómo añadir un módulo

1. Crea `src/modules/<nombre>/` con `types.ts`, `queries.ts` (y `actions.ts` si hay escritura) y `components/`.
2. En `index.ts`, exporta lo público y un descriptor:
   ```ts
   export const fooModule: AppModule = {
     id: "foo",
     nav: [
       {
         href: "/app/foo",
         label: "Foo",
         icon: "…",
         roles: STAFF_ROLES,
         order: 60,
       },
     ],
   };
   ```
3. Regístralo en `src/app/modules.ts`. La barra lateral y el control de rol de `/app/foo` salen de ahí.
4. Crea la ruta `src/pages/app/foo.astro`, que solo compone los paneles del módulo.

## UI: Fluent UI React v9 renderizado en servidor

Los controles son **Fluent UI v9** (`@fluentui/react-components`): `Field`/`Input`, `Button`, `Select`, `Table`, `Badge`, `MessageBar`, `Persona` y `NavDrawer`. Se renderizan **solo en el servidor**, nunca se hidratan:

- `src/shared/fluent/Fluent.astro` renderiza un componente React a HTML estático y emite justo antes el CSS de Griffel que ha generado (sin repetir reglas ya emitidas en la misma respuesta). Así la página llega con estilos (sin parpadeo) y **sin React en el navegador**: solo se envían `enhance.ts` y `drawer.ts`, unos 7 KB.
- Lo que en Fluent requeriría estado de React (mostrar contraseña, mensajes de validación) lo hace `enhance.ts` mediante atributos `data-*`. Los formularios funcionan sin JavaScript.
- **Tema:** `scripts/build-theme.mjs` genera `src/shared/styles/fluent-tokens.css` con `createDarkTheme`/`createLightTheme` y una rampa de marca champán. Los tokens se definen una vez en `:root` (oscuro por defecto y claro con `prefers-color-scheme`), y el `FluentProvider` no recibe tema propio. Los componentes Fluent y nuestro CSS (`tokens.css` son alias) usan las mismas variables.
- **Grises neutros de Fluent 2** en el modo oscuro: página `#1F1F1F`, tarjetas `#292929`. La serif (Fraunces) se reserva para el título de cada página.
- **CSP:** se mantienen los hashes de Astro para los scripts; `style-src` admite `'unsafe-inline'` porque el CSS de Griffel va en línea (`src/middleware.ts`).
- Para componentes que necesiten interactividad real de React (p. ej. un `Dialog` o un `Combobox` con búsqueda), usa una isla con `client:load` y emite sus estilos con `<Fluent>` en el servidor. Esa página cargará React (~220 KB); hazlo solo donde aporte.

Regenerar el tema tras cambiar la marca:

```bash
node scripts/build-theme.mjs
```
