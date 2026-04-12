# eldengglass

`eldengglass` is a standalone Next.js site built from the Elden Ring / Large Glass website work originally developed inside `elden-ring-discovery`.

This repo now carries the website itself:

- `app/` for routes and API endpoints
- `components/` for UI and site modules
- `content/` for MDX source material
- `data/` for generated Elden Ring and reference datasets
- `public/` for images, animations, and proof artifacts
- `scripts/` for content and asset maintenance utilities

## Stack

- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Contentlayer

## Local Development

Requirements:

- Node.js 18+
- npm

Run locally:

```bash
npm install
npm run dev
```

Build and verification:

```bash
npm run typecheck
npm run build
```

## Notes

- `predev` and `prebuild` run `scripts/sync-critique-assets.js`
- the imported site includes a large `public/` asset tree
- this repo is intentionally the website-only extraction, not the full archived source project

## Origin

The initial import was reconstructed from `DashusNavnul/elden-ring-discovery` and narrowed to the website project surfaces so `eldengglass` can evolve as a clean standalone app repo.
