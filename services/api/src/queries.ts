import { pool } from "./db.js";
import type { EditorData, InsightsData, User, WorkspaceData } from "./types.js";

export async function getWorkspace(): Promise<WorkspaceData> {
  const [routes, health] = await Promise.all([
    pool.query(
      "SELECT origin, destination, algorithm, distance, eta, status FROM routes ORDER BY origin, destination",
    ),
    pool.query(
      "SELECT label, title, body, intent FROM network_health ORDER BY title",
    ),
  ]);
  return { routes: routes.rows, health: health.rows };
}

export async function getEditor(): Promise<EditorData> {
  const [nodes, templates] = await Promise.all([
    pool.query(
      "SELECT id, name, coordinates, connections, state FROM nodes ORDER BY id",
    ),
    pool.query("SELECT title, body, meta FROM templates ORDER BY title"),
  ]);
  return { nodes: nodes.rows, templates: templates.rows };
}

export async function getInsights(): Promise<InsightsData> {
  const [benchmarks, tutorials] = await Promise.all([
    pool.query(
      "SELECT algorithm, detail, median, accuracy, status FROM benchmarks ORDER BY algorithm",
    ),
    pool.query(
      "SELECT lesson, duration, title, description, icon, image FROM tutorials ORDER BY lesson",
    ),
  ]);
  return { benchmarks: benchmarks.rows, tutorials: tutorials.rows };
}

export async function getCurrentUser(): Promise<User> {
  const result = await pool.query(
    "SELECT name, role, avatar FROM app_user WHERE id = true",
  );
  return result.rows[0] ?? { name: "Unknown", role: "Unknown", avatar: "" };
}
