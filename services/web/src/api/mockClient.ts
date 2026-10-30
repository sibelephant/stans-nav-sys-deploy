import {
  currentUser,
  editorData,
  insightsData,
  workspaceData,
} from "../mocks/data";
import { getPreviewState } from "./previewState";
import type {
  ApiClient,
  EditorData,
  InsightsData,
  WorkspaceData,
} from "./types";

async function resolve<T>(data: T, empty: T): Promise<T> {
  const state = getPreviewState();
  if (state === "loading") return new Promise<T>(() => undefined);
  if (state === "error")
    throw new Error("The STANS data stream is temporarily unavailable.");
  if (state === "empty") return empty;
  await new Promise((resolvePromise) => window.setTimeout(resolvePromise, 180));
  return data;
}

export const mockClient: ApiClient = {
  getWorkspace: (): Promise<WorkspaceData> =>
    resolve(workspaceData, { routes: [], health: [] }),
  getEditor: (): Promise<EditorData> =>
    resolve(editorData, { nodes: [], templates: [] }),
  getInsights: (): Promise<InsightsData> =>
    resolve(insightsData, { benchmarks: [], tutorials: [] }),
  getCurrentUser: () => resolve(currentUser, currentUser),
  getHealth: () =>
    resolve(
      { status: "ok", services: ["stans-web"] },
      { status: "ok", services: [] },
    ),
};
