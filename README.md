# ERP Frontend - Webcam Studio Management

Multi-tenant ERP SaaS frontend for webcam studio management. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript 5 (strict mode)
- Tailwind CSS v4
- shadcn/ui (New York style, neutral base)
- ESLint + Prettier
- pnpm (package manager)
- Docker (multi-stage production build)

## Prerequisites

- Node.js 22
- pnpm (latest)

## Local Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `pnpm dev`           | Start development server             |
| `pnpm build`         | Create production build              |
| `pnpm start`         | Start production server              |
| `pnpm lint`          | Run ESLint                           |
| `pnpm type-check`    | Run TypeScript type checking         |
| `pnpm format`        | Format code with Prettier            |
| `pnpm format:check`  | Check code formatting                |

## Project Structure

```
src/
  app/
    layout.tsx              Root layout
    page.tsx                Landing / dev navigation
    globals.css             Tailwind globals and theme
    (admin)/                Admin route group
      layout.tsx
      dashboard/page.tsx
    (monitor)/              Monitor route group
      layout.tsx
      dashboard/page.tsx
    (modelo)/               Model route group
      layout.tsx
      dashboard/page.tsx
    auth/
      login/page.tsx        Login page
  components/
    ui/                     shadcn/ui components
  lib/
    utils.ts                Utility functions (cn helper)
```

## Environment Variables

Copy `.env.example` to `.env.local` and adjust values as needed:

| Variable               | Description              | Default                    |
| ---------------------- | ------------------------ | -------------------------- |
| `NEXT_PUBLIC_API_URL`  | Backend API base URL     | `http://localhost:8000`    |
| `NEXT_PUBLIC_WS_URL`  | WebSocket server URL     | `ws://localhost:8000`      |

## Docker

Build and run the production image:

```bash
docker build -t erp-frontend .
docker run -p 3000:3000 erp-frontend
```

## CI/CD

GitHub Actions runs on every pull request to `main`:

1. Install dependencies
2. Lint (ESLint)
3. Type check (tsc --noEmit)
4. Build

## Contributing

1. Create a feature branch from `main`.
2. Follow existing code conventions and project structure.
3. Ensure `pnpm lint`, `pnpm type-check`, and `pnpm build` pass before opening a PR.
4. Write clear commit messages following conventional commits format.
