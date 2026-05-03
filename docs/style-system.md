# Elden Glass Style System

This repo uses a single visual language: Delay in Glass. The goal is not to
offer several equivalent styling paths. The goal is to make the right path
obvious enough that new work does not create fresh visual dialects.

## Source Of Truth

The source of truth is `app/globals.css`.

It owns:

- the canonical color tokens
- the font tokens
- the type scale tokens
- the rule and pane tokens
- the named Delay in Glass classes

Component code may compose those primitives, but it must not invent a parallel
palette, type system, or surface system.

## Canonical Tokens

Use these tokens for new visual identity work:

| Role              | Tokens                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Ground            | `--ink`, `--ink-2`, `--ink-3`                                                                                               |
| Surfaces          | `--pane`, `--pane-edge`, `--glass`, `--glass-edge`                                                                          |
| Rules             | `--crack`, `--crack-strong`, `--rule`, `--rule-strong`, `--rule-gold`                                                       |
| Text              | `--paper`, `--paper-dim`, `--paper-dimmer`, `--paper-dimmest`                                                               |
| Accent            | `--gold`, `--gold-dim`, `--gold-bright`                                                                                     |
| Secondary accents | `--rust`, `--rust-dim`, `--glass-blue`, `--glass-blue-dim`, `--verdigris`                                                   |
| Fonts             | `--font-serif`, `--font-sans`, `--font-mono`                                                                                |
| Type scale        | `--fs-micro`, `--fs-cap`, `--fs-spec`, `--fs-body`, `--fs-lead`, `--fs-h4`, `--fs-h3`, `--fs-h2`, `--fs-h1`, `--fs-display` |

Legacy aliases such as `--bg-primary`, `--text-primary`,
`--accent-gold`, and `--border-subtle` exist only to keep older components
rendering while they are migrated. New code must not use them.

Raw colors belong in `app/globals.css`. Component files should not contain
hex colors, `rgb()`, `rgba()`, `hsl()`, `bg-white`, `text-red-400`, or similar
parallel palette choices unless the value is truly data-rendered output.

## Component Primitives

Use named primitives before hand-rolling equivalent Tailwind and token
combinations.

| Need                                 | Use                            |
| ------------------------------------ | ------------------------------ |
| Bounded content surface              | `Pane` from `components/delay` |
| Solid bounded surface                | `<Pane solid>`                 |
| Figure or reproduction               | `Plate`                        |
| Editorial lead paragraph             | `Lead`                         |
| Apparatus label                      | `Eyebrow`                      |
| Coordinate, hash, or technical value | `Spec`                         |
| Caption or small note                | `Cap`                          |
| Pull quote                           | `PullQuote`                    |
| Margin note                          | `MarginNote` or `AsideInline`  |
| Attestation card                     | `AttestCard`                   |
| Ornamental rule                      | `Crackline`                    |

The older `glass-card` class is legacy. Do not add new `glass-card` call sites.
When touching a file that already uses it, prefer converting that local surface
to `Pane` or a more specific Delay primitive.

## Interface Recipes

Bespoke app routes may need compact controls that are not editorial primitives.
Use the shared `dig-*` recipes before adding route-specific classes:

| Need                         | Use                           |
| ---------------------------- | ----------------------------- |
| App-route header band        | `dig-page-band`               |
| App-route heading            | `dig-page-title`              |
| Control input                | `dig-input`                   |
| Subtle/translucent input     | `dig-input dig-input--subtle` |
| Icon-only control            | `dig-icon-button`             |
| Floating dropdown/modal pane | `dig-floating-panel`          |
| Hoverable list row           | `dig-hover-row`               |
| Selectable result row        | `dig-result-row`              |
| Pagination rail              | `dig-pagination`              |
| Pagination button            | `dig-page-button`             |
| Search/result highlight      | `dig-highlight`               |
| Badge                        | `dig-badge`                   |
| Loading placeholder          | `dig-skeleton`                |
| Muted supporting text        | `dig-muted`                   |
| Primary body text            | `dig-copy`                    |
| Gold link/accent text        | `dig-link`                    |

Route names do not belong in global recipe names. A route may keep small local
classes for unique layout or one-off composition, but repeated control/surface
roles should be expressed through these shared recipes.

## Tailwind Boundary

Tailwind remains the layout language.

Use Tailwind for:

- flex, grid, gap, margin, padding
- width, height, position, overflow
- breakpoints and responsive state
- interaction state wiring
- dense control sizing when no Delay primitive applies

Do not use Tailwind to create new visual identity:

- no ad hoc color utilities
- no one-off surface recipes
- no new rounded-card vocabulary
- no shadow vocabulary outside existing tokens/utilities
- no arbitrary type system for editorial content

If a visual role repeats, make it a named Delay primitive or add one canonical
token in `app/globals.css`.

`tailwind.config.mjs` must not define an independent palette. Any named Tailwind
color or shadow extension should point at `app/globals.css` tokens.

## Inline Styles

Static visual styling does not belong in `style={{ ... }}`.

Inline styles are acceptable only for:

- computed geometry
- SVG coordinates and measurements
- dynamic transforms
- dynamic CSS variables passed into an existing class
- third-party integration seams that cannot express the value otherwise

Inline styles are not acceptable for static color, border, font, radius, or
surface decisions.

## Conversion Rule

Do not run a blind find-and-replace across the repo.

When touching a component for product work:

1. Convert the visual identity in that component to canonical tokens or Delay
   primitives.
2. Keep layout utilities as Tailwind.
3. Remove static inline visual styling in that component.
4. Leave unrelated files alone.

If conversion would alter a page materially, stop and make it a dedicated
reviewable change.

## Audit

Run:

```bash
npm run audit:styles
```

The audit is intentionally non-failing. It reports the current amount of style
drift so we can make it smaller over time:

- legacy token usage
- inline style objects
- raw color literals
- non-system Tailwind color utilities
- hand-rolled surfaces
- existing Delay primitive usage

Promote a category to CI only after the baseline is low enough that failures
are actionable.
