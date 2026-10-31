# STANS Navigation System

STANS (Smart Traffic-Aware Navigation System) is a React and TypeScript traffic-aware navigation interface. It presents route calculations, graph editing tools, algorithm benchmarks, and tutorial content through a PostgreSQL-backed API with live graph refresh events.

This repository also contains the deployment setup for running the frontend as a containerized static application behind Nginx.

## Tutorial

See the [extensive deployment tutorial](docs/README.md) for a guided learning path covering the architecture, local development, frontend workflow, Docker, GitHub Actions, production HTTPS deployment, operations, troubleshooting, and stretch goals.

## Project Structure

```text
.
├── services/web/          React, TypeScript, and Vite application
├── services/api/          Node, TypeScript, PostgreSQL, and SSE API
├── nginx/                 Nginx configuration for the container
├── deploy/                Production server and TLS instructions
├── Dockerfile             Multi-stage production image
├── docker-compose.prod.yml Production Compose service
└── .github/workflows/     GitHub Actions CI/CD workflow
```

## Requirements

- Node.js 22 or newer
- npm
- Docker and Docker Compose for container workflows

## Local Development

Install dependencies and start the Vite development server from the frontend directory:

```bash
cd services/web
npm ci
npm run dev
```

The development server prints its local URL, normally `http://localhost:5173`.

Available scripts:

```bash
npm run dev       # Start the development server
npm run build     # Type-check and create a production build
npm test          # Run Vitest
npm run test:watch
```

## Production Build

The frontend build is written to `services/web/dist`:

```bash
cd services/web
npm run build
```

## Docker

Build the production image from the repository root:

```bash
docker build -t stans-app .
```

Run it on port 8080:

```bash
docker run --rm -p 8080:80 stans-app
```

Open `http://localhost:8080`. Nginx serves the compiled frontend, supports client-side route fallback through `index.html`, and exposes `GET /health` for container health checks.

Run the complete live stack with PostgreSQL:

```bash
docker compose -f docker-compose.prod.yml up --build
```

The API is available through the frontend origin at `/api/*`. The API publishes `/api/events` as an SSE stream, and PostgreSQL data is stored in the `stans-postgres-data` volume.

## CI/CD

The workflow at `.github/workflows/deploy.yml`:

1. Installs frontend dependencies.
2. Runs the production build on pull requests and pushes.
3. Builds the Docker image on pushes to `main`.
4. Publishes `latest` and commit-tagged images to GitHub Container Registry.

The workflow uses the built-in `GITHUB_TOKEN`. The published package must be public, or the production server needs a GitHub token with read-only package access.

## Production Deployment

Production Compose binds the container to `127.0.0.1:8080` and enables automatic restart and health checks:

```bash
export STANS_IMAGE=ghcr.io/YOUR_GITHUB_USER/YOUR_REPOSITORY:latest
docker compose -f docker-compose.prod.yml up -d
```

The host Nginx server terminates HTTPS and proxies requests to the container. See [deploy/README.md](deploy/README.md) for server setup, firewall rules, GHCR authentication, Nginx configuration, and Let's Encrypt commands.

## Configuration Notes

- The production frontend uses the Fastify API through `services/web/src/api/index.ts`. The mock client remains available for isolated preview tests.
- API startup applies the schema. Demo seed data is opt-in with `SEED_DATABASE=true`; set `POSTGRES_PASSWORD` and `DATABASE_URL` through the deployment environment instead of using defaults in production.
- The first live milestone is read-only persistence plus graph/editor refresh. Authentication, write endpoints, and collaborative presence are not included yet.
- The API enables structured logging, Helmet security headers, request rate limiting, a 1 MiB request limit, database TLS configuration, and non-root read-only container execution.
- Do not commit registry tokens, SSH private keys, or other credentials.
- Keep only ports 22, 80, and 443 open on a production server.

## License

No license has been specified for this deployment project.
