import Fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import type { ServerResponse } from "node:http";
import { listenForChanges, pool } from "./db.js";
import {
  getCurrentUser,
  getEditor,
  getInsights,
  getWorkspace,
} from "./queries.js";

const port = Number(process.env.PORT ?? 3000);
const clients = new Set<ServerResponse>();

function broadcast(table: string) {
  const payload = `event: data-change\ndata: ${JSON.stringify({ table })}\n\n`;
  for (const client of clients) {
    if (!client.destroyed) client.write(payload);
  }
}

async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL ?? "info" },
    trustProxy: true,
    bodyLimit: 1_048_576,
  });
  await app.register(helmet);
  await app.register(rateLimit, { max: 300, timeWindow: "1 minute" });

  app.get("/api/health", async (_request, reply) => {
    try {
      await pool.query("SELECT 1");
      return { status: "ok", services: ["stans-api", "postgres"] };
    } catch (error) {
      app.log.error(error, "Database health check failed");
      return reply
        .code(503)
        .send({ status: "unavailable", services: ["stans-api"] });
    }
  });

  app.get(
    "/api/events",
    { config: { rateLimit: false } },
    async (request, reply) => {
      reply.hijack();
      const response = reply.raw;
      response.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-store, must-revalidate",
        connection: "keep-alive",
        "x-accel-buffering": "no",
      });
      response.write(": connected\n\n");
      clients.add(response);
      request.raw.on("close", () => clients.delete(response));
    },
  );

  app.get("/api/workspace", getWorkspace);
  app.get("/api/editor", getEditor);
  app.get("/api/insights", getInsights);
  app.get("/api/me", getCurrentUser);

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error, "Unhandled API error");
    void reply
      .code(500)
      .send({ error: "The STANS data service is unavailable" });
  });
  return app;
}

const app = await buildApp();
const listener = await listenForChanges(broadcast);
const keepalive = setInterval(() => {
  for (const client of clients) {
    if (!client.destroyed) client.write(": keepalive\n\n");
  }
}, 25_000);

await app.listen({ port, host: "0.0.0.0" });
app.log.info({ port }, "STANS API listening");

async function shutdown(signal: string) {
  app.log.info({ signal }, "Shutting down");
  clearInterval(keepalive);
  for (const client of clients) client.end();
  await app.close();
  await listener.end();
  await pool.end();
}

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));
