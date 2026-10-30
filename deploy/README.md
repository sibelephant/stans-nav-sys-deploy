# Production deployment

1. Provision an Ubuntu server and point DNS for `example.com` at its public IP.
2. Install Docker and Nginx, then allow only SSH, HTTP, and HTTPS:

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

3. Authenticate to GHCR, copy `docker-compose.prod.yml`, set `STANS_IMAGE` to the published image, and start it:

```bash
echo "$CR_PAT" | docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin
STANS_IMAGE=ghcr.io/YOUR_GITHUB_USER/YOUR_REPOSITORY:latest docker compose -f docker-compose.prod.yml up -d
```

4. Copy `host-nginx.conf` to `/etc/nginx/sites-available/stans`, replace `example.com`, enable it, and obtain TLS:

```bash
sudo ln -s /etc/nginx/sites-available/stans /etc/nginx/sites-enabled/stans
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d example.com
```

The host terminates TLS and proxies to the container on loopback. The container uses `restart: always` and exposes a health endpoint at `/health`.

## GitHub configuration

The workflow publishes to GitHub Container Registry using the built-in `GITHUB_TOKEN`. Make the package public, or grant the server a fine-grained read-only token. No long-lived registry secret is required in Actions. SSH deployment is intentionally separate so production access is not embedded in CI.
