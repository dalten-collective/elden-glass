# Elden Glass

**Elden Ring Is Marcel Duchamp's *The Bride Stripped Bare by Her Bachelors, Even*.**

This is the thesis site for ~dashus-navnul's discovery that FromSoftware's Elden Ring is a literal instantiation of Marcel Duchamp's *The Large Glass* (1915-1923).

Live at [eldenringisthelargeglass.com](https://eldenringisthelargeglass.com).

## Stack

- Next.js 13.5.6 (App Router)
- Contentlayer 0.3.4 (MDX pipeline)
- Tailwind CSS
- TypeScript
- Vercel (deployment)
- Agentation (dev-only annotation workflow)

## Content Architecture

All long-form content lives in `content/` as MDX files compiled by Contentlayer.

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

The dev server runs Contentlayer on startup to compile MDX. First boot takes ~10s; subsequent hot reloads are fast.

```bash
npm run typecheck  # tsc --noEmit
npm run build      # production build (same as what Vercel runs)
```

## Agentation

Agentation is installed for dev-time visual collaboration with AI agents.

- it is wired through `components/agentation-dev.tsx`
- it is only rendered in development via `app/layout.tsx`
- use it to annotate exact content/UI on the running site when working with an LLM

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

One environment variable is set in Vercel:

- `NEXT_PUBLIC_BASE_URL` = `https://eldenringisthelargeglass.com`

## Blockchain Attestations

The site verifies two independent attestations of the original discovery:

1. **Initial Thesis** -- SHA-256 hash of `manuscript.txt` attested on Ethereum via EAS (Ethereum Attestation Service). The hash and attestation UID are in the MDX frontmatter.
2. **TL;DR** -- SHA-256 hash of `EldenRingSecretOriginal.md` timestamped on Bitcoin via OpenTimestamps. The `.ots` proof file is in `public/proofs/`.

Both proof files are served from `public/proofs/` so readers can independently verify.

## Project Structure

```
app/                    Routes and API endpoints
  (site)/               All content pages (living-thesis, vocab, gatherer, etc.)
  api/                  Title card, search, and sense-index endpoints
components/
  mdx/                  MDX components (MarkdownRenderer, DefinitionItem, FloatImage, etc.)
  site/                 Layout (sidebar, top bar, navigation)
  title-cards/          Rollover display, detail modal, provider
  verification/         Hash verification UI
content/                MDX source files
data/                   Title cards JSON, sense index, xenotext theories
lib/                    Content getters, search index, utilities
public/
  proofs/               Attestation proof files
  images/               All site imagery (Duchamp works, ER characters, etc.)
  animations/           Large Glass component GIFs
```
