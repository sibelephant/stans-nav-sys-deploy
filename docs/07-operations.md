# 7. Operations and Troubleshooting

## Health Checks

The live API and database can be checked through Compose:

```bash
curl --fail http://localhost:8080/api/health
docker compose -f docker-compose.prod.yml ps
```

PostgreSQL data lives in the `stans-nav-sys-deploy_stans-postgres-data` volume. Back it up before maintenance and do not use `docker compose down -v` unless the database can be recreated.

The API uses PostgreSQL `LISTEN/NOTIFY` to publish graph/editor invalidation events through `/api/events`; clients refetch current rows through REST.

The container health check requests:

```text
http://127.0.0.1/health
```

A healthy response is HTTP 200 with the body `ok`.

Check health locally:

```bash
docker inspect --format='{{.State.Health.Status}}' stans-app
curl --fail http://localhost:8080/health
```

## Logs

Container logs:

```bash
docker logs --tail 100 stans-app
docker logs -f stans-app
```

Host Nginx logs:

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Common Failures

### The browser shows a blank page

Check the browser console, then confirm the asset requests return 200. Rebuild the image from the repository root:

```bash
docker build --no-cache -t stans-app .
```

### `/editor` returns 404 after refresh

The container Nginx must contain `try_files $uri $uri/ /index.html;`. The host Nginx should proxy all paths to the container rather than trying to serve the frontend itself.

### The host returns 502 Bad Gateway

Confirm the container is running and bound to loopback port 8080:

```bash
sudo docker ps
sudo ss -ltnp | grep 8080
curl --fail http://127.0.0.1:8080/health
```

### The certificate request fails

Check that DNS resolves to the server and that port 80 is allowed through both UFW and the cloud security group. Certbot's HTTP challenge cannot work if port 80 is blocked.

### The container keeps restarting

Inspect its state and logs:

```bash
sudo docker inspect stans-app
sudo docker logs --tail 200 stans-app
```

A failed health check alone does not normally restart a container; the process must exit or an external policy must recreate it. Verify Nginx starts and that `/health` is reachable inside the container.

## Release Checklist

- [ ] `npm ci` completes in `services/web`.
- [ ] `npm run build` succeeds.
- [ ] Docker image builds from the repository root.
- [ ] `/health` returns 200.
- [ ] Client-side routes work after browser refresh.
- [ ] The production image uses an immutable tag or a reviewed `latest` release.
- [ ] HTTPS certificate is valid.
- [ ] Ports 22, 80, and 443 are the only public inbound ports.
- [ ] Logs and health status are observable.
- [ ] Rollback image tag is known.

## Security Checklist

- Use SSH keys and disable password SSH where practical.
- Use a non-root deploy user.
- Keep the operating system, Docker, and Nginx updated.
- Use read-only GHCR credentials on production hosts.
- Do not commit `.env` files, private keys, or tokens.
- Restrict cloud security groups as well as the host firewall.
- Rotate tokens and remove access when a person or system no longer needs it.
