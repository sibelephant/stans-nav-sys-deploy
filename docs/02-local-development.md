# 2. Local Development

## Prerequisites

Install:

- Node.js 22 or newer.
- npm, included with Node.js.
- Git.
- Docker, if you want to test the production image.

Check versions:

```bash
node --version
npm --version
docker --version
```

For live API development, PostgreSQL is provided by Compose:

```bash
docker compose -f docker-compose.prod.yml up --build postgres api
```

Copy `.env.example` to `.env` and set matching local credentials before starting Compose. Set `SEED_DATABASE=true` only when you want the demo records loaded.

## Install Dependencies

The package lives under `services/web`, not at the repository root:

```bash
cd services/web
npm ci
```

Use `npm ci` for a clean, lockfile-based install. Use `npm install` only when intentionally changing dependencies and the lockfile.

## Start the Development Server

```bash
cd services/web
npm run dev
```

Vite normally opens the application at `http://localhost:5173`.

Vite proxies `/api` to the API at `http://localhost:3000`.

Stop the server with `Ctrl+C`.

## Build the Application

```bash
cd services/web
npm run build
```

This runs TypeScript checking and then creates the Vite output in `services/web/dist`.

A successful build may still show a warning about a JavaScript chunk larger than 500 kB. That warning does not fail the build, but it is a useful optimization task for later.

## Available Scripts

```bash
npm run dev       # Start Vite in development mode
npm run build     # Type-check and create production assets
npm test          # Run Vitest
npm run test:watch # Run Vitest in watch mode
```

The repository currently has no test files, so `npm test` reports that no tests were found. Add tests before treating the test command as a release gate.

## Common Local Problems

### Running npm from the wrong directory

This fails because the root does not contain the frontend `package.json`:

```bash
npm run build
```

Run the command from `services/web`, or use:

```bash
npm --prefix services/web run build
```

### Module not found after installing dependencies

Run this from `services/web`:

```bash
rm -rf node_modules
npm ci
```

Then restart the TypeScript server in VS Code if diagnostics remain stale.

### Port already in use

Choose another Vite port:

```bash
npm run dev -- --port 5174
```
