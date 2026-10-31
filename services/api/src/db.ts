import pg from "pg";

const { Pool, Client } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? {
          rejectUnauthorized:
            process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
        }
      : undefined,
  max: Number(process.env.DB_POOL_SIZE ?? 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export async function listenForChanges(onChange: (channel: string) => void) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? {
            rejectUnauthorized:
              process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
          }
        : undefined,
  });
  await client.connect();
  await client.query("LISTEN stans_changes");
  client.on("notification", (message) =>
    onChange(message.payload ?? "unknown"),
  );
  client.on("error", (error) =>
    console.error("PostgreSQL listener error", error),
  );
  return client;
}
