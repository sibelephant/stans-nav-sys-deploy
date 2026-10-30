# 1. Architecture and Repository Tour

## System Overview

STANS is a single-page React application served as static files in production:

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
  v
Nginx serving Vite output
```

During development, Vite serves the application directly. In the current implementation, the frontend calls a local mock API client rather than a remote backend:

```text
React page -> api facade -> mockClient -> mock data
```

## Repository Map

- `services/web/src/app/App.tsx`: theme provider, routes, and page transitions.
- `services/web/src/components/Shell.tsx`: shared header, navigation, footer, and theme button.
- `services/web/src/features/navigation/WorkspacePage.tsx`: route workspace and network health.
- `services/web/src/features/graph-editor/EditorPage.tsx`: graph node editing UI.
- `services/web/src/features/insights/InsightsPage.tsx`: algorithm benchmarks and tutorials.
- `services/web/src/api/index.ts`: public API facade used by React pages.
- `services/web/src/api/mockClient.ts`: current mock implementation.
- `services/web/src/mocks/data.ts`: sample users, routes, nodes, and benchmarks.
- `services/web/src/styles/`: application styles.
- `Dockerfile`: build stage plus Nginx runtime stage.
- `nginx/default.conf`: container Nginx configuration.
- `.github/workflows/deploy.yml`: build validation and GHCR publishing.
- `docker-compose.prod.yml`: production container definition.
- `deploy/`: host Nginx and server setup instructions.

## Request Flow in the UI

1. `main.tsx` mounts the React application inside `BrowserRouter`.
2. `App.tsx` selects the light or dark Fluent UI theme.
3. `Shell.tsx` renders navigation around the active route.
4. React Router selects one of `/`, `/editor`, or `/insights`.
5. The selected page calls `api.getWorkspace()`, `api.getEditor()`, or `api.getInsights()`.
6. The mock client returns data after a small simulated delay.
7. `DataState` renders data, loading, empty, or error states.

## Why This Architecture Works for a Static Deployment

The browser receives HTML, JavaScript, and CSS only. Nginx does not need Node.js at runtime. That gives the final image a smaller attack surface, faster startup, and no development dependencies. The tradeoff is that live route calculations require a separate backend or a future client-side graph engine.
