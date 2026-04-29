# Elden Glass

**Elden Ring Is Marcel Duchamp's _The Bride Stripped Bare by Her Bachelors, Even_.**

This is the thesis site for ~dashus-navnul's discovery that FromSoftware's Elden Ring is a literal instantiation of Marcel Duchamp's _The Large Glass_ (1915-1923).

Live at [eldenringisthelargeglass.com](https://eldenringisthelargeglass.com).

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript 6
- Filesystem-backed MDX loading through `lib/content.ts`
- Vercel (deployment)
- Agentation (dev-only annotation workflow)

## Content Architecture

All long-form content lives in `content/` as MDX files loaded through `lib/content.ts`.

This is not a site where editorial content should be hardcoded into TypeScript. Route pages should remain thin and should render content loaded through `lib/content.ts` and `components/mdx/markdown-renderer.tsx`.

If you are changing:

- thesis copy
- article copy
- bibliography text
- vocabulary/catalog content
- critique copy

start in `content/`, not in `app/(site)/*.tsx`.

Structured interactive datasets live in `data/`, especially the title-card system.

## Local Development

```bash
npm install
npm run dev        # starts on localhost:3000
```

The dev server reads MDX content directly from `content/` and renders it through the shared Markdown renderer.

```bash
npm run typecheck  # tsc --noEmit
npm run build      # production build (same as what Vercel runs)
```

## Agentation

Agentation is installed for dev-time visual collaboration with AI agents.

- it is wired through `components/agentation-dev.tsx`
- it is only rendered in development via `app/layout.tsx`
- use it to annotate exact content/UI on the running site when working with an LLM

No setup is required beyond `npm run dev`. The toolbar mounts automatically
in development. The `endpoint` prop (`http://localhost:4747`) is optional:
if an Agent Sync server is running locally on that port, Agentation will
sync annotations to it; if not, the toolbar still works — annotate the page
and copy the structured markdown output to the clipboard manually.

Preferred content workflow:

1. run the site locally
2. annotate the exact content with Agentation
3. apply the real edit in `content/` or `data/`
4. verify the result in-browser

## Deployment

The site deploys from [dalten-collective/elden-glass](https://github.com/dalten-collective/elden-glass) on Vercel:

- `main` is production
- `dev` is the integration branch
- every PR and branch push gets a unique Vercel preview URL
- [eldenringisthelargeglass.com](https://eldenringisthelargeglass.com) is the production site
- [elden-glass.vercel.app](https://elden-glass.vercel.app) is the Vercel production alias

Required workflow:

1. branch from current `dev`
2. make the change
3. run local verification
4. open a PR to `dev`
5. request review
6. merge to `dev`
7. validate the deployed `dev` build online
8. open a PR from `dev` to `main`
9. request review
10. merge `dev` to `main`

Do not commit directly to `main`.

Do not push directly to `main`.

See `CLAUDE.md` / `AGENTS.md` for the authoritative version of this flow,
including reviewer-assignment rules for agent-driven PRs.

One environment variable is set in Vercel:

- `NEXT_PUBLIC_BASE_URL` = `https://eldenringisthelargeglass.com`

## Analytics

The analytics stack and deployment contract are documented in
[`docs/analytics.md`](./docs/analytics.md). That document is the source
of truth for the provider stack (PostHog Cloud + Google Search Console),
the required Vercel environment variables, the data-hygiene rules, the
route-family vocabulary, the event-naming convention, and the local
verification steps. Read it before adding analytics code or wiring up
provider SDKs.

## Blockchain Attestations

The site verifies two independent attestations of the original discovery:

1. **Initial Thesis** -- SHA-256 hash of `manuscript.txt` attested on Ethereum via EAS (Ethereum Attestation Service). The hash and attestation UID are in the MDX frontmatter.
2. **TL;DR** -- SHA-256 hash of `EldenRingSecretOriginal.md` timestamped on Bitcoin via OpenTimestamps. The `.ots` proof file is in `public/proofs/`.

The OpenTimestamps `.ots` proof and both source documents (`manuscript.txt`
and `EldenRingSecretOriginal.md`) are served from `public/proofs/` so
readers can independently recompute the hashes and verify the attestations.

## How this repo is laid out

This site is filesystem + YAML driven by design. Pages, section ordering,
injected TSX routes, and external sidebar links all flow through the
`content/pages/**` filesystem tree and the `layout.yaml` files inside it. The
authoritative description lives in `CLAUDE.md` / `AGENTS.md`. A brief
orientation:

- **Content is filesystem-shaped.** MDX files under `content/pages/**` and
  each folder's `layout.yaml` determine which pages exist, their order, and
  how they appear in navigation. Adding a page is adding an MDX file;
  reorganising a section is moving files and tweaking that folder's
  `layout.yaml`.

- **`layout.yaml` has four keys:** `primary` (root-only, surfaces names in
  primary nav), `order` (explicit sibling order), `hidden` (hides filesystem
  entries from nav), and `links` (injects nav entries not backed by an MDX
  file). Each `links` entry takes `href`, `label`, and optional
  `external: true` (opens in a new tab with `rel="noopener noreferrer"`) and
  `hidden: true`. Place the link key in `order:` to position it among its
  siblings. Live examples:
  - `links.gatherer → /gatherer` in `content/pages/layout.yaml` injects the
    bespoke `/gatherer` TSX route at the root of the sidebar.
  - `links.cipher → /xenotext` in
    `content/pages/xenotext-theory/layout.yaml` injects the `/xenotext` TSX
    route into the Xenotext Theory section.
  - `links.duchamp-works → /duchamp/duchamp-works` in
    `content/pages/duchamp/layout.yaml` does the same for the
    `/duchamp/duchamp-works` TSX route.
  - External sites use the same shape with `href: https://...` and
    `external: true`.

- **Routes live in `app/`.** `app/(site)/[...slug]/page.tsx` is the
  content-driven catch-all that serves MDX pages from `content/pages/**`.
  Bespoke (non-content) interactive routes live as their own folders under
  `app/(site)/`; they appear in navigation only when a `layout.yaml`
  references them via a `links:` entry. `app/api/**` contains JSON endpoints
  (search, title cards, sense index, and agent-facing `llms` routes).

- **Structured data lives in `data/`** — title cards, including Duchamp
  artwork metadata, sense index, manuscripts manifest, and xenotext theories.
  See `data/README.md`.

- **Generation machinery lives in `lib/`.**
  Key files: `lib/content.ts`, `lib/content-tree.ts`, `lib/sidebar.ts`,
  and `components/mdx/markdown-renderer.tsx`. Don't duplicate navigation or
  page-discovery logic elsewhere.

- **Components, scripts, and public assets grow organically.** Check the
  filesystem for what's there rather than a list here. Entry points worth
  knowing: `components/mdx/markdown-renderer.tsx` (MDX renderer + component
  registry), `components/site/` (site shell), `components/delay/`
  (thesis-voice primitives used across content pages and the home hero),
  `scripts/` (sync scripts for critique assets, manuscripts, and FedWiki
  import/export).

- **Proofs and attestations.** `public/proofs/` holds the Bitcoin
  OpenTimestamps `.ots` proof for the TL;DR plus the two source documents
  (`manuscript.txt`, `EldenRingSecretOriginal.md`) whose SHA-256 hashes are
  the subject of the EAS and OpenTimestamps attestations.
