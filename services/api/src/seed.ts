import { pool } from "./db.js";
import { schema } from "./schema.js";

await pool.query(schema);
await pool.query(`
  INSERT INTO app_user (id, name, role, avatar) VALUES (true, 'Avery Morgan', 'Network operator', 'https://i.pravatar.cc/80?u=avery-morgan')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO routes (origin, destination, algorithm, distance, eta, status) VALUES
    ('Central Station', 'North Harbor', 'A* with traffic weights', '8.4 km', '18 min', 'Recommended'),
    ('Civic Center', 'East Market', 'Dijkstra baseline', '6.1 km', '16 min', 'Compared'),
    ('West Yard', 'University Loop', 'Bidirectional A*', '11.7 km', '24 min', 'Traffic delay')
  ON CONFLICT DO NOTHING;
  INSERT INTO network_health (label, title, body, intent) VALUES
    ('Healthy graph', 'All route partitions reachable', 'No disconnected components detected across the active road graph.', 'success'),
    ('2 congestion zones', 'Harbor approach is slowing', 'A* is weighting the North Harbor approach above its free-flow estimate.', 'warning')
  ON CONFLICT DO NOTHING;
  INSERT INTO nodes (id, name, coordinates, connections, state) VALUES
    ('node_001', 'Central Station', '51.5074\\n-0.1278', '6 edges', 'Active'),
    ('node_002', 'North Harbor', '51.5186\\n-0.0877', '4 edges', 'Active'),
    ('node_003', 'University Loop', '51.4988\\n-0.1749', '3 edges', 'Review')
  ON CONFLICT DO NOTHING;
  INSERT INTO templates (title, body, meta) VALUES
    ('London core · peak hours', '14 nodes · 27 edges · traffic-aware weights', 'Edited today'),
    ('University shuttle loop', '8 nodes · 12 edges · campus access rules', 'Edited 3 days ago'),
    ('Low-traffic baseline', '14 nodes · 27 edges · neutral weights', 'Edited Oct 21')
  ON CONFLICT DO NOTHING;
  INSERT INTO benchmarks (algorithm, detail, median, accuracy, status) VALUES
    ('A* traffic-aware', 'Dynamic edge costs', '42 ms', '98.6%', 'Best balance'),
    ('Bidirectional A*', 'Meet-in-the-middle search', '31 ms', '97.9%', 'Fastest'),
    ('Dijkstra baseline', 'Uniform-cost reference', '118 ms', '98.1%', 'Reference')
  ON CONFLICT DO NOTHING;
  INSERT INTO tutorials (lesson, duration, title, description, icon, image) VALUES
    ('Lesson 01', '8 min', 'Traffic weights', 'See how speed, congestion, and incident penalties reshape each edge before the solver begins.', 'chart', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'),
    ('Lesson 02', '11 min', 'Heuristic tuning', 'Balance speed and accuracy by comparing straight-line distance with the live traffic signal.', 'route', 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80'),
    ('Lesson 03', '6 min', 'Graph templates', 'Start with reusable city, campus, and warehouse graphs designed for repeatable experiments.', 'document', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80')
  ON CONFLICT DO NOTHING;
`);
console.log("Database seed is ready");
await pool.end();
