.PHONY: dev dev-down prod prod-down lint test build format

COMPOSE_DEV  = docker compose -f .docker/compose.yml
COMPOSE_PROD = docker compose -f .docker/compose.prod.yml

# --- Development ---
dev:
	$(COMPOSE_DEV) up --build

dev-down:
	$(COMPOSE_DEV) down

dev-logs:
	$(COMPOSE_DEV) logs -f web

dev-local:
	pnpm dev

# --- Production ---
prod:
	$(COMPOSE_PROD) up -d --build

prod-down:
	$(COMPOSE_PROD) down

prod-logs:
	$(COMPOSE_PROD) logs -f web

# --- Quality ---
lint:
	pnpm lint
	pnpm format:check

lint-fix:
	pnpm lint --fix
	pnpm format

type-check:
	pnpm tsc --noEmit

test:
	pnpm test

test-watch:
	pnpm test:watch

# --- Build ---
build:
	pnpm build

# --- Utilities ---
install:
	pnpm install

format:
	pnpm format
