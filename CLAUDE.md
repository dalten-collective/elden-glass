# Elden Glass System Guide

This document defines the operating model for agents and collaborators working
in this repository.

`AGENTS.md` and `CLAUDE.md` should stay identical.

## Non-Negotiables

### Do Not Commit Directly To `main`

Do not commit directly to `main`.

Do not push directly to `main`.

All work happens on a branch. Changes flow through:

1. Branch from current `origin/dev`
2. Make the change
3. Run local verification
4. Open a PR into `dev`
5. Request review
6. Merge to `dev`
7. Validate the deployed `dev` build online when behavior changed
8. Open a second PR from `dev` to `main`
9. Request review
10. Merge only after review

Do not treat "small" changes as exempt from this flow.

### Request Review

Every meaningful change should go through review.

Docs changes are not exempt. Routing, content, and operational docs all affect
how the repo is run.

## Core Rule

### MDX First, Except For Explicitly Bespoke Routes

Authored content belongs in MDX under `content/pages/**`.

Do not hardcode prose into TypeScript or JSX when the content is editorial,
structural, or document-like.

Use TypeScript for:

- layout and shell chrome
- rendering components
- interactive behavior
- data loading and transformation
- APIs
- bespoke application-style routes

Current examples of intentionally bespoke routes include:

- `/xenotext`
- `/duchamp/duchamp-works`
- `/gatherer`
- `/search`

These are not content pages. Do not migrate them into MDX unless explicitly
requested.

If a page already reads from Contentlayer and `MarkdownRenderer`, keep using
that path.

## Site Structure

### App Router

This is a Next.js App Router site.

- `app/layout.tsx` defines root metadata, global CSS, and root document structure
- `app/(site)/layout.tsx` wraps the site shell
- `app/(site)/[...slug]/page.tsx` is the catch-all content route
- `app/(site)/**/page.tsx` also contains bespoke non-content routes
- `app/api/**/route.ts` contains APIs for search, sense data, title cards, and related features

### Content Tree

The primary content system lives under `content/pages/`.

Examples:

- `content/pages/living-thesis.mdx`
- `content/pages/tldr.mdx`
- `content/pages/duchamp/chess/overview.mdx`
- `content/pages/xenotext-theory/theory.mdx`
- `content/pages/duchamp/layout.yaml`
- `content/pages/xenotext-theory/layout.yaml`

The content tree is interpreted by:

- `contentlayer.config.ts`
- `lib/content.ts`
- `lib/content-tree.ts`
- `components/mdx/markdown-renderer.tsx`
- `components/site/content-page-renderer.tsx`

### YAML Layout Model

Each `content/pages/**/layout.yaml` can control navigation and folder behavior.

Supported keys:

- `primary`: marks top-level entries that should appear in primary navigation
- `order`: orders sibling pages and sections
- `hidden`: hides filesystem entries from generated navigation
- `links`: injects internal or external links that are not backed by an MDX file

Use `links` for bespoke routes that should appear inside the content-driven nav.

Current examples:

- `content/pages/xenotext-theory/layout.yaml` links to `/xenotext`
- `content/pages/duchamp/layout.yaml` links to `/duchamp/duchamp-works`

### Routing Model

`app/(site)/[...slug]/page.tsx` serves MDX-backed content pages from
`content/pages/**`.

If a requested slug names a folder instead of a concrete page, the catch-all
route redirects to the first reachable page in that folder using
`lib/content-tree.ts` and that folder's `layout.yaml` ordering.

This means:

- content routes are filesystem and YAML driven
- folder URLs can resolve by redirecting to an ordered child page
- bespoke routes outside the content tree must be linked explicitly when they
  should appear in navigation

## Navigation

The shared navigation system is generated in `lib/sidebar.ts`.

Do not edit separate desktop and mobile navigation definitions. Both chrome
surfaces should consume the same generated navigation tree.

Important files:

- `lib/sidebar.ts`
- `lib/content-tree.ts`
- `components/site/site-shell.tsx`
- `components/site/sidebar.tsx`
- `components/site/mobile-sidebar.tsx`
- `components/site/navigation-menu.tsx`
- `components/site/top-bar.tsx`

If navigation needs to change, update the content tree, the relevant
`layout.yaml`, or the shared sidebar builder. Do not recreate the old
hand-authored nav tree.

## Content Authoring Rules

Edit MDX first for:

- thesis text
- essays and research pages
- bibliography and resource pages
- vocabulary pages
- critique pages
- headings and section structure
- summary text and other frontmatter-driven metadata

If you find yourself typing large paragraphs into `.tsx`, stop and reconsider.

Use `MarkdownRenderer` and the registered MDX components rather than bypassing
the interpreter for convenience.

## Data-Driven Features

Not everything is MDX. Structured data lives in `data/`.

Important examples:

- `data/title-cards.json`
- `data/title-cards-split/*.json`
- `data/sense-index.json`
- `data/xenotext-theories.json`

Important related APIs:

- `app/api/title-cards/route.ts`
- `app/api/title-cards/all/route.ts`
- `app/api/title-cards/catalog/route.ts`
- `app/api/title-cards/category/route.ts`
- `app/api/search/route.ts`
- `app/api/related-by-sense/route.ts`
- `app/api/sense-index/route.ts`

If the user is changing Gatherer or title-card data, update the source data or
the scripts that produce it. Do not fake data changes in the UI layer.

## Scripts

Repository scripts live in `scripts/`.

Use an existing script when a workflow already exists there instead of
reimplementing the logic ad hoc inside a component.

Examples:

- `scripts/sync-critique-assets.js`
- `scripts/sync-manuscripts.js`
- `scripts/generate-fedwiki-gatherer.js`
- `scripts/export-to-fedwiki.js`
- `scripts/sync-from-fedwiki.js`

## Agentation

When working on copy, structure, or presentation, prefer using Agentation on
the running site so feedback is anchored to exact content on the page.

Agentation is a collaboration aid. The source of truth remains:

- MDX in `content/pages/**`
- structured data in `data/**`
- rendering logic in components and route files

## Verification

Before pushing a PR, run the strongest local verification available for the
change.

Common commands:

- `npm run typecheck`
- `npm run build`

Run `npm run build` before pushing changes that affect routing, layout, content
rendering, APIs, or deployment behavior.

## Deployment

Vercel deploys branches and PRs to preview URLs.

Use preview deployments to validate behavior before merge.

Production promotion is still:

feature branch -> `dev` -> validated deployed `dev` -> `main`

## If You Are Unsure

If a requested change feels editorial, inspect `content/pages/**` first.

If it feels like navigation or route discoverability, inspect:

- `content/pages/**/layout.yaml`
- `lib/content-tree.ts`
- `lib/sidebar.ts`
- `app/(site)/[...slug]/page.tsx`

If it feels like a tool or application experience, inspect the bespoke route in
`app/(site)/**/page.tsx` before assuming it belongs in MDX.
