import type {
  EditorData,
  InsightsData,
  User,
  WorkspaceData,
} from "../api/types";

export const currentUser: User = {
  name: "Avery Morgan",
  role: "Network operator",
  avatar: "https://i.pravatar.cc/80?u=avery-morgan",
};

export const workspaceData: WorkspaceData = {
  routes: [
    {
      origin: "Central Station",
      destination: "North Harbor",
      algorithm: "A* with traffic weights",
      distance: "8.4 km",
      eta: "18 min",
      status: "Recommended",
    },
    {
      origin: "Civic Center",
      destination: "East Market",
      algorithm: "Dijkstra baseline",
      distance: "6.1 km",
      eta: "16 min",
      status: "Compared",
    },
    {
      origin: "West Yard",
      destination: "University Loop",
      algorithm: "Bidirectional A*",
      distance: "11.7 km",
      eta: "24 min",
      status: "Traffic delay",
    },
  ],
  health: [
    {
      label: "Healthy graph",
      title: "All route partitions reachable",
      body: "No disconnected components detected across the active road graph.",
      intent: "success",
    },
    {
      label: "2 congestion zones",
      title: "Harbor approach is slowing",
      body: "A* is weighting the North Harbor approach above its free-flow estimate.",
      intent: "warning",
    },
  ],
};

export const editorData: EditorData = {
  nodes: [
    {
      id: "node_001",
      name: "Central Station",
      coordinates: "51.5074\n-0.1278",
      connections: "6 edges",
      state: "Active",
    },
    {
      id: "node_002",
      name: "North Harbor",
      coordinates: "51.5186\n-0.0877",
      connections: "4 edges",
      state: "Active",
    },
    {
      id: "node_003",
      name: "University Loop",
      coordinates: "51.4988\n-0.1749",
      connections: "3 edges",
      state: "Review",
    },
  ],
  templates: [
    {
      title: "London core · peak hours",
      body: "14 nodes · 27 edges · traffic-aware weights",
      meta: "Edited today",
    },
    {
      title: "University shuttle loop",
      body: "8 nodes · 12 edges · campus access rules",
      meta: "Edited 3 days ago",
    },
    {
      title: "Low-traffic baseline",
      body: "14 nodes · 27 edges · neutral weights",
      meta: "Edited Oct 21",
    },
  ],
};

export const insightsData: InsightsData = {
  benchmarks: [
    {
      algorithm: "A* traffic-aware",
      detail: "Dynamic edge costs",
      median: "42 ms",
      accuracy: "98.6%",
      status: "Best balance",
    },
    {
      algorithm: "Bidirectional A*",
      detail: "Meet-in-the-middle search",
      median: "31 ms",
      accuracy: "97.9%",
      status: "Fastest",
    },
    {
      algorithm: "Dijkstra baseline",
      detail: "Uniform-cost reference",
      median: "118 ms",
      accuracy: "98.1%",
      status: "Reference",
    },
  ],
  tutorials: [
    {
      lesson: "Lesson 01",
      duration: "8 min",
      title: "Traffic weights",
      description:
        "See how speed, congestion, and incident penalties reshape each edge before the solver begins.",
      icon: "chart",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    },
    {
      lesson: "Lesson 02",
      duration: "11 min",
      title: "Heuristic tuning",
      description:
        "Balance speed and accuracy by comparing straight-line distance with the live traffic signal.",
      icon: "route",
      image:
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80",
    },
    {
      lesson: "Lesson 03",
      duration: "6 min",
      title: "Graph templates",
      description:
        "Start with reusable city, campus, and warehouse graphs designed for repeatable experiments.",
      icon: "document",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
    },
  ],
};
