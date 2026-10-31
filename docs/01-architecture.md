# 1. Architecture and Repository Tour

## System Overview

STANS is a React application served as static files in production, backed by a Node API and PostgreSQL:

```text
Browser
  |
  | HTTPS
  v
Host Nginx
  |
  | HTTP on 127.0.0.1:8080
  v
STANS container
  |
  | /api and /api/events
  v
API container -> PostgreSQL
```

During development, Vite serves the application directly. The production frontend calls a same-origin API client:

```text
React page -> api facade -> HTTP API -> PostgreSQL

Workspace and editor pages subscribe to `/api/events`. PostgreSQL `LISTEN/NOTIFY` is an invalidation signal; clients refetch authoritative rows through REST.
```

## Repository Map

- `services/web/src/app/App.tsx`: theme provider, routes, and page transitions.
- `services/web/src/components/Shell.tsx`: shared header, navigation, footer, and theme button.
- `services/web/src/features/navigation/WorkspacePage.tsx`: route workspace and network health.
- `services/web/src/features/graph-editor/EditorPage.tsx`: graph node editing UI.
- `services/web/src/features/insights/InsightsPage.tsx`: algorithm benchmarks and tutorials.
- `services/web/src/api/index.ts`: public API facade used by React pages.
- `services/web/src/api/mockClient.ts`: retained preview/test implementation.
- `services/web/src/mocks/data.ts`: sample users, routes, nodes, and benchmarks.
- `services/api/src/server.ts`: HTTP and SSE API server.
- `services/api/package.json`: Fastify service dependencies and operational scripts.
- `services/api/src/schema.ts`: PostgreSQL tables and change triggers.
- `services/api/src/seed.ts`: idempotent development seed data.
- `services/web/src/styles/`: application styles.
- `Dockerfile`: build stage plus Nginx runtime stage.
- `nginx/default.conf`: container Nginx configuration.
- `.github/workflows/deploy.yml`: build validation and GHCR publishing.
- `docker-compose.prod.yml`: production container definition.
- `deploy/`: host Nginx and server setup instructions.

## Request Flow in the UI
