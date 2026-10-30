# 8. Stretch Goals

## Add Real Route Calculations

The current UI displays mock route results. A real system needs a backend or a client-side graph engine that can:

1. Load a graph of nodes and weighted edges.
2. Accept origin and destination nodes.
3. Apply travel-time and congestion weights.
4. Run Dijkstra, A*, or bidirectional A*.
5. Return the selected path, distance, ETA, and explored-node metrics.

Keep the existing `ApiClient` interface stable while replacing the mock implementation. This lets the UI evolve independently from the routing engine.

## Add a Backend Service

A backend could expose endpoints such as:

```text
GET  /api/workspace
GET  /api/editor
GET  /api/insights
POST /api/routes/calculate
GET  /api/health
```

Add request validation, authentication, rate limiting, structured errors, and observability before exposing it publicly.

## Add Tests

Recommended frontend tests:

- Render each route and verify navigation labels.
- Verify workspace route records appear after the API resolves.
- Verify loading, empty, and error states.
- Verify theme toggle behavior.
- Verify a client-side route survives a browser refresh in the container.

Recommended backend tests:

- Shortest-path correctness.
- Congestion weight changes.
- Unreachable destinations.
- Invalid node identifiers.
- Large graph performance.

## Improve Bundle Performance

The Vite build currently reports a large JavaScript chunk. Investigate:

- Route-level dynamic imports.
- Vite manual chunks.
- Removing unused icon imports.
- Lazy-loading tutorial content.
- Measuring with a bundle analyzer.

Do not optimize based only on file size. Measure startup time and interaction performance in a production build.

## Monitoring

Possible additions:

- Prometheus metrics for request count, latency, and error rate.
- Grafana dashboards.
- Container metrics through cAdvisor.
- Uptime checks for `/health`.
- Alerting for repeated restarts, high latency, or certificate expiry.

## Centralized Logging

For a larger deployment, forward host Nginx and container logs to a managed logging service or an ELK/OpenSearch stack. Include request IDs and avoid logging credentials, tokens, or sensitive user data.

## Infrastructure as Code

Use Terraform or Ansible to automate:

- Server creation.
- Security groups and firewall rules.
- Docker installation.
- Nginx configuration.
- Certificate prerequisites.
- Deployment users and SSH keys.

Store state securely and review infrastructure changes through pull requests.

## Kubernetes

A Kubernetes deployment would normally include:

- Deployment with multiple replicas.
- Service for internal routing.
- Ingress for TLS termination.
- Readiness and liveness probes using `/health`.
- ConfigMaps and Secrets where needed.
- Resource requests and limits.

Kubernetes is useful when the operational complexity is justified. For a single static frontend, one hardened server may be simpler and cheaper.
