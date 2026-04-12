# Elden Glass Agent Guide

This file is for agents and collaborators working in this repository.

Read it before making changes.

## Non-Negotiables

### We Do Not Commit Directly To `main`

Do not commit directly to `main`.

Do not push directly to `main`.

Do not "just make a quick fix on production."

All work happens on a branch. That branch opens a PR into `dev`. After `dev` is reviewed and validated online, we open a second PR from `dev` into `main`.

This is the required flow:

1. Branch off `dev`
2. Make the change
3. Run local verification
4. Push the branch
5. Open a PR to `dev`
6. Request review
7. Merge to `dev`
8. Validate the deployed `dev` build online
9. Open a PR from `dev` to `main`
10. Request review
11. Merge `dev` to `main`

If you are tempted to skip this flow, do not.

### Request Review

Every meaningful change should go through a pull request and review.

Do not self-authorize a direct production change because it "looks small." The mobile nav fix, Gatherer route fix, and similar changes all look small until deployment behavior proves otherwise.

Do not treat docs-only changes as exempt from review. Docs can encode the operating procedure for the repository, so they also need PRs and review.

### Content Belongs In MDX, Not Hardcoded JSX

This site has a content pipeline. Use it.

If the user wants to change article copy, section headings, thesis text, bibliography text, vocabulary entries, critique copy, or other authored content, edit the `.mdx` files in `content/`.

Do not hardcode prose into TypeScript just because it is faster in the moment.

Do not move content out of MDX and into JSX unless the user explicitly asks for that architectural change.

If a page already reads from Contentlayer and `MarkdownRenderer`, keep using that path.

TypeScript should define:

- layout
- shell/chrome
- rendering components
- interactive behavior
- content interpretation

TypeScript should not become a dumping ground for editorial content.

## Site Structure

### App Router

This is a Next.js App Router site.

- `app/layout.tsx` defines root metadata, global CSS, and root document structure.
- `app/(site)/layout.tsx` wraps site pages with the shared shell and title-card provider.
- `app/(site)/**/page.tsx` contains route entrypoints for site pages.
- `app/api/**/route.ts` contains API endpoints used by search, title cards, and related features.

### Shared Site Chrome

The shared shell lives in `components/site/`.

Important files:

- `components/site/site-shell.tsx` composes the main site layout
- `components/site/sidebar.tsx` renders the desktop sidebar
- `components/site/mobile-sidebar.tsx` renders the mobile navigation drawer
- `components/site/top-bar.tsx` renders the top header
- `components/site/site-navigation.ts` defines the shared navigation tree
- `components/site/navigation-menu.tsx` renders the shared nav structure

If you need to change navigation, do it in the shared navigation system. Do not create separate desktop/mobile nav trees again.

### Content Pipeline

The site content is primarily driven by `content/` plus Contentlayer.

Important files:

- `contentlayer.config.ts` defines the document types and MDX pipeline
- `lib/content.ts` is the content access layer used by route pages
- `components/mdx/markdown-renderer.tsx` renders MDX using the registered custom components
- `content/*.mdx` contains the longform authored documents
- `content/vocab/*.mdx` contains vocabulary/catalog content
- `content/critiques/*.mdx` contains critique pages

Typical pattern:

1. A route page in `app/(site)/.../page.tsx` loads a document from `lib/content.ts`
2. The page renders hero chrome and metadata
3. The main body is rendered through `MarkdownRenderer`

If a user asks to edit a document page, your first instinct should be to inspect the corresponding MDX file in `content/`.

### Data-Driven Features

Not everything in the site is MDX. Structured datasets live in `data/`.

Important files:

- `data/title-cards.json`
- `data/title-cards-split/*.json`
- `data/sense-index.json`
- `data/xenotext-theories.json`

Relevant APIs:

- `app/api/title-cards/route.ts`
- `app/api/title-cards/all/route.ts`
- `app/api/title-cards/catalog/route.ts`
- `app/api/title-cards/category/route.ts`
- `app/api/search/route.ts`
- `app/api/related-by-sense/route.ts`

If the user is changing Gatherer/title-card data, update the data source or the scripts that generate/manage it. Do not fake data changes in the UI layer.

### Scripts

Repository scripts live in `scripts/`.

Notable examples:

- `scripts/sync-critique-assets.js`
- `scripts/generate-fedwiki-gatherer.js`
- `scripts/export-to-fedwiki.js`
- `scripts/sync-from-fedwiki.js`

If a workflow already exists as a script, use or update the script rather than reproducing the logic ad hoc in a component.

## Authoring Rules

### Prefer MDX Edits For Content Changes

For these categories, edit MDX first:

- thesis text
- article text
- bibliography text
- vocabulary text
- critique text
- static explanatory sections
- frontmatter-driven hero metadata

Examples:

- `/living-thesis` comes from `content/living-thesis.mdx`
- `/tldr` comes from `content/tldr.mdx`
- `/initial-thesis` comes from `content/initial-thesis.mdx`
- `/about` comes from `content/about.mdx`
- `/bibliography` comes from `content/bibliography.mdx`
- `/master-list` comes from `content/master-list.mdx`
- `/bachelor-machines/terms` comes from `content/vocab/bachelor-machines.mdx`
- `/vocab` comes from `content/vocab/pataphysics.mdx`

If you find yourself typing large paragraphs into a `.tsx` file, stop and reconsider.

### Use The Interpreter We Already Have

This repo already has an MDX interpreter/rendering path:

- Contentlayer parses the documents
- `lib/content.ts` loads them
- `MarkdownRenderer` renders them
- MDX components provide richer embedded elements when needed

Use that system.

Do not bypass it by hardcoding content into React components unless the work is genuinely presentational or interactive.

### Use Agentation For Content Collaboration

When working with an LLM on content changes, use Agentation on the running site whenever possible.

Agentation is installed in this repo and is wired in development through `components/agentation-dev.tsx` and `app/layout.tsx`.

Use it for:

- reviewing editorial changes in context
- selecting specific headings, paragraphs, hero text, and callouts
- capturing page-level feedback from the user
- iterating on MDX-backed content with visible, anchored annotations instead of vague prose instructions

Preferred workflow for content work:

1. Run the site locally
2. Open the relevant page in the browser
3. Use Agentation to annotate the exact content that should change
4. Apply the edits in the underlying MDX or data source
5. Re-check the page with the annotations in view

If the requested work is primarily about copy, structure, or editorial presentation, do not rely only on abstract chat descriptions when Agentation can anchor the requested change directly on-page.

Agentation is a collaboration aid, not the source of truth. The source of truth remains:

- MDX in `content/`
- structured data in `data/`
- rendering logic in components and route files

### When TypeScript Changes Are Appropriate

Use TypeScript edits for:

- new UI components
- navigation/layout changes
- interactive client behavior
- API behavior
- data loading and transformation
- MDX component support
- styling and responsive fixes

Use MDX edits for:

- copy
- headings
- lists
- citations
- editorial structure
- vocabulary entries
- article body content

## Deployment Strategy

### Branching And Promotion

The deployment model is:

- feature/fix branch -> PR to `dev`
- `dev` validated online
- PR from `dev` -> `main`
- `main` becomes production

`dev` is the integration branch.

`main` is the production branch.

Do not branch from stale local history. Fetch first, and branch from current `origin/dev`.

### Vercel

Vercel auto-deploys branches and pull requests to unique preview URLs.

That means every pushed branch/PR can be reviewed online at its own Vercel deployment URL before merge.

After merging to `dev`, Vercel deploys the updated `dev` state so it can be tested online as the staging/integration environment.

After merging `dev` into `main`, Vercel deploys production.

Production lives at:

- `https://eldenringisthelargeglass.com`

There is also a Vercel production alias:

- `https://elden-glass.vercel.app`

When someone says "test it online," that means:

1. Use the PR preview URL for branch validation
2. Use the deployed `dev` build after merge-to-`dev`
3. Use the production domain only after `dev -> main` is merged

### Deployment Discipline

Do not merge to `main` because local build passed.

Do not merge to `main` because the PR preview "basically looks right."

Do not merge to `main` until the `dev` deployment has been checked online when the change affects runtime behavior, routing, responsive behavior, API behavior, or content rendering.

## Practical Workflow

Before changing files:

1. Check `git status`
2. Check the current branch
3. Fetch `origin`
4. Start from current `origin/dev`
5. Create a branch for the change

Before opening a PR:

1. Run the strongest local verification available
2. Make sure the working tree is clean
3. Push the branch
4. Open a PR to `dev`
5. Write a clear PR body
6. Request review

Before promoting `dev` to `main`:

1. Confirm the merged change works in the online `dev` deployment
2. Open a dedicated `dev -> main` PR
3. Request review
4. Merge only after that review/validation step

## Avoid These Mistakes

- Do not commit directly to `main`
- Do not push directly to `main`
- Do not hardcode document content into `.tsx` files when an MDX source exists
- Do not fork mobile and desktop navigation/content definitions unnecessarily
- Do not patch production behavior without a PR because "it is only one line"
- Do not assume deployment behavior matches local behavior without checking Vercel

## If You Are Unsure

If a requested change feels like content, inspect `content/` first.

If a requested change feels like data, inspect `data/` and `app/api/` first.

If a requested change feels like layout/navigation, inspect `components/site/` first.

If a requested change affects production, assume the correct path is:

branch -> PR -> `dev` -> online validation -> PR -> `main`
