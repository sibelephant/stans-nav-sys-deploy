export type ViewState = "loading" | "error" | "empty" | "data";
export type RouteStatus = "Recommended" | "Compared" | "Traffic delay";
export type NodeState = "Active" | "Review";
export type TutorialIcon = "chart" | "route" | "document";
export interface RouteRecord {
  origin: string;
  destination: string;
  algorithm: string;
  distance: string;
  eta: string;
  status: RouteStatus;
}
export interface NodeRecord {
  id: string;
  name: string;
  coordinates: string;
  connections: string;
  state: NodeState;
}
export interface Benchmark {
  algorithm: string;
  detail: string;
  median: string;
  accuracy: string;
  status: string;
}
export interface Tutorial {
  lesson: string;
  duration: string;
  title: string;
  description: string;
  icon: TutorialIcon;
  image: string;
}
export interface User {
  name: string;
  role: string;
  avatar: string;
}
export interface WorkspaceData {
  routes: RouteRecord[];
  health: {
    label: string;
    title: string;
    body: string;
    intent: "success" | "warning";
  }[];
}
export interface EditorData {
  nodes: NodeRecord[];
  templates: { title: string; body: string; meta: string }[];
}
export interface InsightsData {
  benchmarks: Benchmark[];
  tutorials: Tutorial[];
}

export interface ApiClient {
  getWorkspace(): Promise<WorkspaceData>;
  getEditor(): Promise<EditorData>;
  getInsights(): Promise<InsightsData>;
  getCurrentUser(): Promise<User>;
  getHealth(): Promise<{ status: "ok"; services: string[] }>;
}
