---
name: posthog-nextjs-app-router
description: Use when working on PostHog analytics in this Next.js App Router repo, including wizard-generated setup, web analytics, dashboards, insights, and Elden Glass AX analytics.
---

# PostHog Next.js App Router

This repo uses PostHog for both standard web analytics and Elden Glass-specific
agent-experience analytics.

## Required Context

Before changing analytics code, read:

- `.claude/skills/integration-nextjs-app-router/SKILL.md`
- `posthog-setup-report.md`
- `docs/analytics.md`

Load the detailed `.claude/skills/integration-nextjs-app-router/references/*`
files only when their specific workflow is needed.

## Local Policy

- Let PostHog own canonical web analytics such as `$pageview`,
  `$pageleave`, scroll depth, web vitals, dashboards, and standard insights.
- Keep custom events only when they add Elden Glass-specific meaning, especially
  AX events such as `ax_route_request` and `agent_classified`.
- Do not hardcode PostHog project tokens or hosts. Use the existing environment
  variables documented in `docs/analytics.md`.
- Keep session replay disabled unless Eric explicitly asks to enable it.
- Preserve the `ANALYTICS_DISABLED=1` kill switch for browser and server
  analytics paths.
- Run the repo verification commands before publishing analytics changes.

## Current Wizard Output

The PostHog wizard installed its upstream skill at:

`./.claude/skills/integration-nextjs-app-router/`

The wizard also generated:

- `posthog-setup-report.md`

Treat these as repo-local source artifacts, not global user configuration.
