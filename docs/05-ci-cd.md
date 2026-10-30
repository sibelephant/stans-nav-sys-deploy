# 5. GitHub Actions and Container Publishing

## Pipeline Behavior

The workflow at `.github/workflows/deploy.yml` has two jobs:

### Validate

Runs on pull requests and pushes:

1. Checks out the repository.
2. Installs Node.js 22.
3. Restores npm cache using `services/web/package-lock.json`.
4. Runs `npm ci` in `services/web`.
5. Runs `npm run build`.

### Publish

Runs only after a successful validation job on a push:

1. Logs in to GitHub Container Registry with `GITHUB_TOKEN`.
2. Creates image tags from the commit SHA and `latest`.
3. Builds the root Dockerfile.
4. Pushes the image to `ghcr.io/<owner>/<repository>`.

## First-Time Repository Setup

1. Push the repository to GitHub.
2. Ensure the default branch is `main`.
3. Enable Actions if the repository is private or organization policy disables them.
4. Check the Actions tab after pushing a commit.
5. Open the published package under the repository's Packages section.

The workflow uses the built-in token, so you normally do not need to create a Docker Hub password secret.

## Package Visibility

For a simple server setup, make the GHCR package public. For a private package, create a fine-grained GitHub token with read-only package access and authenticate the production server with it. Never place that token in the workflow file.

## Useful GitHub CLI Checks

```bash
gh run list
gh run view --log-failed
```

You can also inspect workflow runs from the GitHub web interface.

## Safe Deployment Pattern

The current workflow publishes an image but does not SSH into a server. This is intentional: keeping deployment credentials outside CI reduces the blast radius of a compromised workflow.

A later deployment job can be added with an environment named `production`, required reviewers, and secrets such as:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`

Use an environment approval gate before allowing production changes.

## Pipeline Troubleshooting

### Build succeeds locally but fails in Actions

Check that commands run from the correct directory. The frontend package is under `services/web`, while the Docker context is the repository root.

### GHCR permission denied

Confirm the workflow has:

```yaml
permissions:
  contents: read
  packages: write
```

### Image cannot be pulled on the server

Confirm the image name uses lowercase repository and owner names, and authenticate to GHCR with a token that can read packages.
