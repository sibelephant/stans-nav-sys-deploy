# 6. Production Deployment with HTTPS

This guide uses an Ubuntu server, Docker Compose, host Nginx, and Let's Encrypt. The same concepts apply to AWS, DigitalOcean, Azure, or another Linux host.

## 1. Provision the Server

Create a small Ubuntu LTS server with a public IP address. Create a DNS `A` record pointing your domain to that IP. Wait for DNS to resolve before requesting a certificate.

Use a non-root administrative user where possible and configure SSH keys instead of passwords.

## 2. Install Packages

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx ufw
sudo systemctl enable --now docker nginx
```

## 3. Configure the Firewall

Only expose SSH, HTTP, and HTTPS:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status verbose
```

If your cloud provider has a separate security group, apply the same three inbound rules there.

## 4. Authenticate to GHCR

Use a read-only package token for a private image:

```bash
echo "$CR_PAT" | sudo docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin
```

Do not put the token in shell history. Prefer an interactive secret prompt or a secure secret manager.

## 5. Start the Container

Copy `docker-compose.prod.yml` to the server and select the image:

```bash
export STANS_IMAGE=ghcr.io/YOUR_GITHUB_USER/YOUR_REPOSITORY:latest
sudo --preserve-env=STANS_IMAGE docker compose -f docker-compose.prod.yml up -d
```

The container listens only on `127.0.0.1:8080`. It is not directly exposed to the public internet.

Check it:

```bash
sudo docker compose -f docker-compose.prod.yml ps
curl --fail http://127.0.0.1:8080/health
```

## 6. Configure Host Nginx

Copy `deploy/host-nginx.conf` to `/etc/nginx/sites-available/stans`, replace `example.com` with your domain, and enable it:

```bash
sudo ln -s /etc/nginx/sites-available/stans /etc/nginx/sites-enabled/stans
sudo nginx -t
sudo systemctl reload nginx
```

The host Nginx proxy forwards requests to `127.0.0.1:8080`.

## 7. Enable Let's Encrypt

```bash
sudo certbot --nginx -d example.com
sudo certbot renew --dry-run
```

Certbot configures HTTPS and installs a renewal timer. Confirm renewal periodically.

## 8. Verify the Release

```bash
curl --fail https://example.com/health
curl --head https://example.com/editor
```

Open the site in a browser and refresh a client-side route such as `/editor`. A successful refresh confirms the Nginx SPA fallback works.

## Updating the Application

Pull the new image and recreate the service:

```bash
export STANS_IMAGE=ghcr.io/YOUR_GITHUB_USER/YOUR_REPOSITORY:latest
sudo --preserve-env=STANS_IMAGE docker compose -f docker-compose.prod.yml pull
sudo --preserve-env=STANS_IMAGE docker compose -f docker-compose.prod.yml up -d
```

For safer releases, deploy an immutable commit tag instead of `latest`, verify it, then update the tag deliberately.

## Rollback

Keep the previous image tag available:

```bash
export STANS_IMAGE=ghcr.io/YOUR_GITHUB_USER/YOUR_REPOSITORY:COMMIT_SHA
sudo --preserve-env=STANS_IMAGE docker compose -f docker-compose.prod.yml up -d
```

The application is static, so rollback is usually a quick image replacement.
