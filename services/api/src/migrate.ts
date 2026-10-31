import { pool } from "./db.js";
import { schema } from "./schema.js";

try {
  await pool.query(schema);
  console.log("Database schema is ready");
} finally {
  await pool.end();
}
