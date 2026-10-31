import type { ApiClient } from "./types";
import type { EditorData, InsightsData, User, WorkspaceData } from "./types";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const api: ApiClient = {
  getWorkspace: () => get<WorkspaceData>("/api/workspace"),
  getEditor: () => get<EditorData>("/api/editor"),
  getInsights: () => get<InsightsData>("/api/insights"),
  getCurrentUser: () => get<User>("/api/me"),
  getHealth: () => get<{ status: "ok"; services: string[] }>("/api/health"),
  subscribeToChanges: (onChange) => {
    const events = new EventSource("/api/events");
    const handleChange = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as { table: string };
      onChange(payload.table);
    };
    events.addEventListener("data-change", handleChange);
    return () => events.close();
  },
};

export type {
  ApiClient,
  EditorData,
  InsightsData,
  ViewState,
  WorkspaceData,
} from "./types";
