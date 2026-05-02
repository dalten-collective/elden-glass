# Deployment

This repository is already connected to Vercel through the Vercel GitHub integration.

## Deployment behavior

- Pushes to non-`main` branches create Vercel preview deployments.
- Pushes to `main` create production deployments.
- Vercel uses `vercel.json` for the Next.js framework, build command, output directory, regions, headers, and redirects.

## Current configuration

The repo does not need a separate GitHub Actions deployment workflow or committed `.vercel/project.json` file. GitHub Actions still runs CI checks in `.github/workflows/ci.yml`, while Vercel handles deployment from GitHub push events.

## Manual verification

Recent deployment records can be checked with:

```bash
gh api repos/dalten-collective/elden-glass/deployments --paginate \
  --jq '.[0:5][] | {environment, ref, sha, created_at, statuses_url}'
```

Then inspect a deployment status with:

```bash
gh api <statuses_url> --jq '.[0] | {state, environment_url, description, created_at}'
```
