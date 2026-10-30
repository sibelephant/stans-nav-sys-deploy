# STANS Deployment Tutorial

This tutorial teaches you how to run, containerize, validate, publish, and deploy STANS. Follow the documents in order, or jump to the topic you need.

## Learning Path

1. [Architecture and repository tour](01-architecture.md)
2. [Local development](02-local-development.md)
3. [Frontend workflow and mock data](03-frontend-workflow.md)
4. [Docker and Nginx](04-docker.md)
5. [GitHub Actions and container publishing](05-ci-cd.md)
6. [Production deployment with HTTPS](06-production-deployment.md)
7. [Operations and troubleshooting](07-operations.md)
8. [Stretch goals](08-stretch-goals.md)

## What You Will Build

By the end, you will have:

- A reproducible React development workflow.
- A production frontend bundle built by Vite.
- A small Nginx runtime image created with a multi-stage Dockerfile.
- Automated build validation and image publishing through GitHub Actions.
- A Linux host running the image behind host-level Nginx and Let's Encrypt TLS.
- A health check, restart policy, firewall rules, and a basic operations runbook.

## Important Scope Note

The current STANS application is a frontend demonstration. Its route, graph, health, and benchmark values come from mock data in `services/web/src/api/mockClient.ts`. This tutorial deploys that frontend safely; it does not create a live routing backend. The backend integration options are discussed in [stretch goals](08-stretch-goals.md).
