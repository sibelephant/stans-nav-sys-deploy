# 3. Frontend Workflow and Mock Data

## What the UI Demonstrates

The app has three views:

- **Workspace**: recent route records and network health.
- **Graph editor**: nodes, coordinates, traffic weights, and graph editing controls.
- **Benchmarks and tutorials**: algorithm comparison data and learning cards.

The header includes navigation, graph status, and a light/dark theme toggle. Theme selection is stored in browser local storage under `app-theme`.

## API Boundary

Pages do not import mock arrays directly. They use the API facade:

```ts
import { api } from "../../api";

const data = await api.getWorkspace();
```

The facade currently points to `mockClient`:

```ts
export const api: ApiClient = mockClient;
```

This boundary makes it possible to replace the mock implementation later without rewriting every page.

## Preview States

The mock client supports four states:

- `data`: returns normal sample data.
- `loading`: never resolves, allowing loading UI to be inspected.
- `empty`: returns empty arrays.
- `error`: rejects with an error.

In development, the shell displays a preview switcher. You can also use query parameters such as:

```text
http://localhost:5173/?state=empty
http://localhost:5173/?state=error
```

The state is read by `services/web/src/api/previewState.ts`.

## Adding Mock Data

Edit `services/web/src/mocks/data.ts` and preserve the TypeScript interfaces in `services/web/src/api/types.ts`.

For a new route record, provide:

```ts
{
  origin: "Central Station",
  destination: "North Harbor",
  algorithm: "A* with traffic weights",
  distance: "8.4 km",
  eta: "18 min",
  status: "Recommended"
}
```

After editing data, run:

```bash
npm --prefix services/web run build
```

## Replacing the Mock Client

A live integration would normally introduce a client such as:

```ts
const apiClient: ApiClient = {
  getWorkspace: () => fetchJson("/api/workspace"),
  getEditor: () => fetchJson("/api/editor"),
  getInsights: () => fetchJson("/api/insights"),
  getCurrentUser: () => fetchJson("/api/me"),
  getHealth: () => fetchJson("/api/health"),
};
```

Important production concerns include request timeouts, authentication, CORS, error mapping, schema validation, and a backend health endpoint. Do not expose database credentials or private service tokens in browser code.
