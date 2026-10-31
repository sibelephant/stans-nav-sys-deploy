# 4. Docker and Nginx

## Why Use a Multi-Stage Build

The Dockerfile has two stages:

1. `build`: uses Node.js to install dependencies and run `npm run build`.
2. `runtime`: uses Nginx Alpine to serve only the compiled `dist` directory.

The final image does not contain the Node.js toolchain or development dependencies.

The Compose deployment adds a separate Node API container and a private PostgreSQL container with a persistent named volume. Frontend Nginx proxies `/api/` and `/api/events` to the API; SSE buffering is disabled for the event stream.

The API container runs as the non-root `node` user with a read-only filesystem. Compose requires explicit `DATABASE_URL` and `POSTGRES_PASSWORD` values; use `.env.example` as the starting point for local configuration.

## Build the Image

Run this from the repository root because the Docker build context needs both `services/web` and `nginx`:

```bash
docker build -t stans-app .
```

Inspect the image:

```bash
docker image ls stans-app
```

## Run the Image

```bash
docker run --rm --name stans-app -p 8080:80 stans-app
```

Open `http://localhost:8080`.

Test the health endpoint in another terminal:

```bash
curl --fail http://localhost:8080/health
```

Run the full stack with:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Expected output:

```text
ok
```

Stop the container with `Ctrl+C` if it is running in the foreground.

## React Routing and Nginx

React Router handles routes such as `/editor` in the browser. If a browser requests `/editor` directly, Nginx must serve `index.html` rather than return a 404. The important rule is:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

The container also defines `/health` separately so monitoring gets a small, predictable response.

## Inspect the Container

```bash
docker ps
docker logs stans-app
docker inspect --format='{{json .State.Health}}' stans-app
```

Run a shell only for debugging:

```bash
docker exec -it stans-app /bin/sh
```

## Image Security Practices

- Use small Alpine runtime images.
- Keep build tools out of the runtime stage.
- Pin major image versions and update them regularly.
- Do not copy `.env` files or credentials into the build context.
- Keep `.dockerignore` current.
- Scan images with a tool such as Docker Scout or Trivy before production use.
