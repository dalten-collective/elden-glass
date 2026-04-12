# Elden Glass

Thesis site: **Elden Ring Is Marcel Duchamp's _The Bride Stripped Bare by Her Bachelors, Even_.**

Production: [eldenringisthelargeglass.com](https://eldenringisthelargeglass.com)

## Git Workflow

### WE DO NOT COMMIT DIRECTLY TO `main`. EVER.

All work happens on feature branches. Changes reach `main` exclusively through pull requests with review.

The workflow:

1. **Create a branch** off current `dev`.
2. **Do your work** on the branch. Commit early, commit often.
3. **Open a PR** targeting `dev`. Request review.
4. **Merge to `dev`** only after review approval.
5. **Validate `dev` online** after merge when the change affects runtime behavior, routing, layout, API behavior, or content rendering.
6. **Promote `dev` to `main`** via a separate PR when a release is ready. This PR also requires review.

Never force-push to `main` or `dev`. Never bypass review.

### Branch naming

- Pebbles issues: `<issue-id>/<description>`
- Otherwise: `<feat,fix,docs,chore>/<description>`

### Deployment pipeline

Vercel deploys automatically from `dalten-collective/elden-glass` on GitHub:

| Branch | Environment           | URL                                                                  |
| ------ | --------------------- | -------------------------------------------------------------------- |
| `main` | Production            | [eldenringisthelargeglass.com](https://eldenringisthelargeglass.com) |
| `dev`  | Integration / preview | Unique Vercel preview URL per push                                   |
| Any PR | Preview               | Unique Vercel preview URL per PR                                     |

Every push to `dev` and every PR gets its own preview deployment at a unique Vercel URL. Use these to verify changes before merging.

One environment variable is set in Vercel:

- `NEXT_PUBLIC_BASE_URL` = `https://eldenringisthelargeglass.com`

## Content Architecture

### Content lives in MDX. Not in TypeScript. Not in JSX.

All long-form content is in `content/` as MDX files processed by Contentlayer 0.3.4. The entire point of this architecture is that **the author edits MDX files and nothing else**. The site renders those files through a pipeline that handles formatting, components, and layout automatically.

**Do not hardcode content into React components or page files.** If content needs to appear on the site, it goes in an MDX file under `content/`. The page file (`app/(site)/*/page.tsx`) should be a thin shell that fetches the content document and passes it to `MarkdownRenderer`.

### How it works

1. MDX files in `content/` have YAML frontmatter (title, dates, hashes, etc.)
2. `contentlayer.config.ts` defines document types and their fields
3. Contentlayer compiles MDX at build/dev time into importable modules
4. `lib/content.ts` provides getter functions for each document type
5. Page files call getters and render via `<MarkdownRenderer code={doc.body.code} />`

### Document types (defined in `contentlayer.config.ts`)

- **InitialThesisDoc** -- `content/initial-thesis.mdx`
- **TldrDoc** -- `content/tldr.mdx`
- **LivingThesisDoc** -- `content/living-thesis.mdx`
- **Critique** -- `content/critiques/*.mdx`
- **AboutDoc** -- `content/about.mdx`
- **BibliographyDoc** -- `content/bibliography.mdx`
- **MasterListDoc** -- `content/master-list.mdx`
- **VocabDoc** -- `content/vocab/*.mdx` (bachelor-machines, pataphysics)

### MDX components available in content files

These are registered in `components/mdx/markdown-renderer.tsx` and can be used directly in any MDX file:

- `<FloatImage>` -- Floating images within prose
- `<ItemCard>` -- Elden Ring item cards
- `<ArtworkCard>` -- Duchamp artwork cards
- `<LinkPreview>` -- Hover-preview links
- `<MagnifierImage>` -- Zoomable images
- `<DefinitionItem term="..." definition="..." source="...">` -- Vocabulary definitions (used heavily in vocab pages)

GFM markdown tables are also supported via `remark-gfm` (used for machine catalogs in bachelor-machines.mdx).

## Stack

- Next.js 13.5.6 (App Router)
- Contentlayer 0.3.4 (MDX pipeline)
- Tailwind CSS + @tailwindcss/typography
- TypeScript
- Vercel (deployment)

## Project Structure

```
app/
  (site)/               All content pages (37 routes)
  api/                  Title card, search, and sense-index endpoints
components/
  mdx/                  MDX components (MarkdownRenderer, DefinitionItem, FloatImage, etc.)
  site/                 Layout (sidebar, top bar, navigation)
  title-cards/          Rollover display, detail modal, provider
  verification/         Hash verification UI
content/                MDX source files -- this is where content lives
  vocab/                Vocabulary MDX (bachelor-machines, pataphysics)
contentlayer.config.ts  Document type definitions and MDX plugin config
data/                   Title cards JSON, sense index, xenotext theories
lib/                    Content getters, search index, utilities
public/
  proofs/               Blockchain attestation proof files
  images/               All site imagery
  animations/           Large Glass component GIFs
```

## Local Development

```bash
npm install
npm run dev        # starts on localhost:3000
```

The dev server runs Contentlayer on startup to compile MDX. First boot takes ~10s; subsequent hot reloads are fast.

```bash
npm run typecheck  # contentlayer build + tsc --noEmit
npm run build      # production build (same as what Vercel runs)
```

Always run `npm run build` locally before pushing a PR to verify the build will pass on Vercel.

## Agentation (AI Visual Feedback)

This site has [agentation](https://www.agentation.com/) installed as a dev dependency. It provides a visual annotation layer that lets you click UI elements in the browser, attach feedback notes, and pipe structured context (CSS selectors, source file paths, React component hierarchy, computed styles) directly to an AI agent.

### How it's wired up

- `components/agentation-dev.tsx` renders the `<Agentation>` component pointed at `http://localhost:4747`
- `app/layout.tsx` includes it **only in development** (`process.env.NODE_ENV === 'development'`)
- It does not ship to production

### Using it

1. Run `npm run dev` to start the site
2. The agentation toolbar appears in the bottom-right corner of the browser
3. Hover over any element to see its name highlighted
4. Click an element to annotate it with feedback
5. Copy the formatted markdown output and paste it into Claude Code (or, with MCP enabled, the agent reads annotations directly)

With MCP integration active, there is no copy-paste step -- the agent can read and act on annotations directly. You can say things like "address my feedback" or "fix annotation 3."

When the requested work is primarily about copy, structure, or page-level presentation, prefer using Agentation on the running site to anchor the requested change before editing the underlying MDX or data source.

### Setup for new developers

If you're working on this site with an AI agent, install agentation and ensure the MCP server is running so the agent has direct access to your UI annotations. See [agentation.com](https://www.agentation.com/) for full setup instructions.

## Title Cards

Title cards (the rollover definitions throughout the site) are **view-only**. There are no edit affordances anywhere on the site. The card data lives in `data/title-cards.json` and `data/title-cards-split/`. The modal triggered by clicking a card's view button shows the full card detail but does not allow editing.

## Vercel Configuration

`vercel.json` handles headers (security, RSS content-type) and redirects (RSS aliases). The build runs in the `iad1` region. No custom functions or middleware beyond what Next.js provides.

The site is on Vercel's Hobby plan. The repo at `dalten-collective/elden-glass` is public (required for Hobby plan org repos).
