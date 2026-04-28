# Elden Glass Analytics Stack and Deployment Contract

This document is the single contract that downstream analytics work
(`pb-ba4.2` through `pb-ba4.6`) must conform to. It names the providers,
the deployment configuration, the data-hygiene rules, the route-family
vocabulary, the event-naming convention, and the local verification
steps.

It is documentation only. Provider SDKs are not installed and analytics
code is not yet wired up.

If a downstream task needs to deviate from this contract, update this
document in the same PR rather than letting the code and the contract
drift apart.

## Provider Stack

Elden Glass uses two analytics providers, with clearly separated jobs:

1. **PostHog Cloud** — primary product-analytics sink. Captures
   browser-side human behavior events and server-side AX (agent
   experience) events. PostHog is the source of truth for "what is
   happening on the site, by whom, on which surfaces."
2. **Google Search Console (GSC)** — SEO acquisition source. Owns
   "what query in Google brought a human to which page, and how
   often does Google index our content." GSC is read in its own
   dashboard; the repo does not ingest GSC data into PostHog.

PostHog is hosted on PostHog Cloud (the SaaS offering at
`app.posthog.com` / `eu.posthog.com`). We are not self-hosting PostHog.
The exact region (US vs EU) is selected per-project at provider setup
time and is reflected by `NEXT_PUBLIC_POSTHOG_HOST`.

### Why PostHog Cloud

- It supports both browser-side and server-side event ingestion behind
  one project, which we need because Elden Glass deliberately serves
  AX surfaces (`/llms.txt`, `/api/llms/toc`, MDX content pages to
  non-JS crawlers) where browser-only analytics would be blind.
- It supports event-property-based segmentation, which is how we
  separate human pageviews from agent fetches without inventing
  parallel pipelines.
- It supports IP anonymization, opt-out, and event scrubbing, which we
  need to honor the data-hygiene rules below.
- Its free / hobby tier is sufficient for this site's traffic profile,
  which is research-scale, not consumer-scale.

### Why Not GA4

- GA4 is browser-first and is brittle when the request comes from a
  non-JS crawler or a server-side fetcher. We need first-class
  visibility into AX traffic, which GA4 does not give us.
- GA4 modeling decisions (sessions, attribution) are tuned for
  marketing funnels, not for "is an LLM agent reading our content?"
- We do not want a Google-only signal stack. GSC already covers the
  Google-side acquisition story, and PostHog gives us provider-neutral
  product analytics on top.

### Why Not Plausible / Fathom Only

- Plausible/Fathom are great for human-pageview privacy analytics, but
  do not natively support the agent-classification work this project
  needs (`pb-ba4.4`, `pb-ba4.5`).
- We would still need a second pipeline for AX events. Standing up a
  second pipeline doubles the data-hygiene surface. Picking a tool
  that can do both is the simpler contract.

### Why Not Vercel Analytics / Vercel Web Analytics

- Vercel's first-party analytics is intentionally minimal and is not
  designed for a custom event vocabulary or for distinguishing AI
  agent fetches from human reads. It is fine as an additional signal
  but is not load-bearing for this project.
- Downstream tasks may still leave Vercel Web Analytics enabled at the
  project level for redundancy, but it is not part of this contract.

## Required Environment Variables

The following environment variables form the deployment contract.
Downstream code must read them from `process.env` only — no key may be
hardcoded.

| Name                          | Visibility  | Required | Purpose                                                                                                                                                                                                                                                                     |
| ----------------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`     | public      | yes      | PostHog project API key used by the browser SDK.                                                                                                                                                                                                                            |
| `NEXT_PUBLIC_POSTHOG_HOST`    | public      | yes      | PostHog ingestion host (`https://us.i.posthog.com` or `https://eu.i.posthog.com`).                                                                                                                                                                                          |
| `POSTHOG_API_KEY`             | server-only | yes      | PostHog project API key used by server-side event capture (AX events from route handlers / middleware). May be the same key as the public one if PostHog project policy allows; treated as server-only here so the Node code path never depends on a `NEXT_PUBLIC_*` value. |
| `POSTHOG_HOST`                | server-only | yes      | Server-side mirror of the PostHog host. Avoids depending on a `NEXT_PUBLIC_*` value from server code.                                                                                                                                                                       |
| `NEXT_PUBLIC_ANALYTICS_ENV`   | public      | no       | Free-form environment label (`production`, `preview`, `dev`, `local`). When unset, code must derive a sensible default from `process.env.VERCEL_ENV` and fall back to `local`.                                                                                              |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | public      | no       | When `"1"` or `"true"`, enables verbose console logging from the analytics shim. Off in production.                                                                                                                                                                         |
| `ANALYTICS_DISABLED`          | server-only | no       | When `"1"`, force-disables both browser and server analytics regardless of the keys above. Used for incident response or for environments that should never emit events.                                                                                                    |

Notes:

- "Public" means the variable is exposed to the browser at build time
  via Next.js's `NEXT_PUBLIC_*` convention. These keys are not secret;
  PostHog browser keys are designed to be safe to ship to the client.
- "Server-only" means the variable must never be exposed to the
  browser bundle. Code that reads server-only variables must live in
  server components, route handlers, middleware, or server actions.
- Google Search Console requires no environment variable. Site
  ownership is verified out-of-band via DNS TXT record on the apex
  domain (`eldenringisthelargeglass.com`). The verification artifact
  lives outside the repo.

## Vercel Configuration

Vercel is the deployment surface. The analytics contract assumes the
standard Vercel three-environment model:

- **Production** — promoted builds for `main`. Analytics fully on.
- **Preview** — branch and PR builds. Analytics on, but tagged
  `environment=preview` so preview traffic does not pollute the
  production dashboards.
- **Development** — `vercel dev` against the project. Analytics off
  by default unless the developer explicitly opts in by setting
  `NEXT_PUBLIC_POSTHOG_KEY` locally.

The variables in the previous section must be set in the Vercel
dashboard (or via `vercel env add`) for at least Production and
Preview. Setting them for Development is optional; the recommended
local mode is "disabled."

`vercel.json` is the only Vercel-level config file currently in the
repo. This contract does not require changes to `vercel.json`. If the
team later moves to `vercel.ts`, the analytics environment variables
remain provider-managed and do not need to be inlined.

Region pinning: `vercel.json` pins functions to `iad1`. Server-side
analytics ingestion targets PostHog Cloud over HTTPS, so region
pinning has no effect on analytics correctness, only on latency.

### Promotion Order

The promotion path matches `AGENTS.md`:

```
feature branch → preview → dev → validated dev → main → production
```

When PostHog project IDs differ between preview and production
(recommended), the same code path picks the right key from the
environment, so no code change is required to promote.

## Data Hygiene Rules

These are non-negotiable. Any analytics PR that violates them must be
reverted.

### Must Not Capture

- **Form bodies.** No POST body content, no contact-form text, no
  comment/critique text, no clipboard contents, no draft text from any
  in-page editor. If a future feature accepts user-authored prose,
  that prose does not enter analytics.
- **Search-result contents.** The body of search results, the text of
  matched MDX paragraphs, or the contents of item cards returned by a
  search must not be sent to PostHog. The query text itself may be
  captured (see below) but the result payload must not.
- **Personally identifying information.** No emails, no names, no
  postal addresses, no phone numbers. Elden Glass has no logged-in
  user concept; analytics must not invent one.
- **Raw IP addresses.** PostHog must be configured to anonymize IPs
  (`person_profiles=identified_only`, `$ip` scrubbed at ingest, or
  equivalent). The browser SDK config must opt out of IP-based
  geolocation precision beyond country.
- **Cookie identifiers from third parties.** Do not import
  fingerprinting libraries, do not stitch identity across providers,
  do not enrich with third-party data brokers.
- **Untrimmed user agents in human events.** User agent strings may be
  captured for AX/server events where they are required for agent
  classification. They must not be captured verbatim on browser
  events; PostHog's default user-agent parsing is sufficient.

### May Capture (intentional)

- The internal search **query text**, but only the query text the user
  submits to `/search` or the search API. Not the live keystroke
  buffer, not query-as-you-type, not draft queries the user abandoned.
- Path / route, route family (see vocabulary below), referrer where
  the browser provides it, viewport size, locale, color-scheme
  preference, time-on-page heuristics.
- For AX/server events: request path, route family, status code,
  user-agent string, referrer when present, classifier output, and
  timestamps.

### Must Honor

- **Do Not Track / Global Privacy Control.** When the browser sends
  `DNT: 1` or `Sec-GPC: 1`, the browser-side analytics shim must not
  initialize.
- **Hard opt-out.** A future opt-out mechanism (e.g.,
  `localStorage["eg.analytics.optout"] = "1"`) must short-circuit
  initialization. The shim must check this on every page load.
- **`ANALYTICS_DISABLED=1`.** Server-side and browser-side analytics
  must both no-op when this is set. This is the kill switch.

## Route-Family Vocabulary

Every analytics event — browser or server — must include a
`route_family` property drawn from this fixed list. This is the
shared dimension that lets a maintainer ask "what is happening on
which surface" without tying queries to URL strings that change as
content moves.

| Route family          | Examples                                                           | Notes                                                                                |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `home`                | `/`                                                                | The home route only.                                                                 |
| `mdx_content`         | `/living-thesis`, `/duchamp/chess/overview`, any catch-all MDX URL | Content from `content/pages/**` rendered through the catch-all.                      |
| `bespoke_interactive` | `/xenotext`, `/duchamp/duchamp-works`, `/gatherer`                 | Bespoke TSX routes called out in `AGENTS.md` and `CLAUDE.md`.                        |
| `search`              | `/search`, `/api/search`                                           | Both the page and its API.                                                           |
| `item_cards`          | `/api/title-cards`, `/api/title-cards/[id]`                        | The structured item-card APIs. The `/gatherer` page itself is `bespoke_interactive`. |
| `ax_llms_text`        | `/llms.txt`                                                        | Plain-text agent guide.                                                              |
| `ax_llms_toc`         | `/api/llms/toc`                                                    | Machine-readable agent table of contents.                                            |
| `ax_route_catalog`    | `/contents`, anything else built on `lib/route-catalog.ts`         | Human-and-agent-readable route inventory.                                            |
| `feeds`               | `/feed.xml`, redirected `/rss`, `/rss.xml`                         | Syndication surfaces.                                                                |
| `sitemap_catalog`     | `/sitemap.xml`, `/robots.txt`                                      | Crawler-discovery surfaces.                                                          |
| `redirect`            | Anything matched by `content/redirects.json`                       | Recorded as a redirect hop, not as a destination.                                    |
| `static_asset`        | `/images/**`, `/proofs/**`, other public files                     | Usually filtered out, but the family exists for AX log analysis.                     |
| `unknown`             | fallthrough                                                        | Reserved for paths that do not match any known family.                               |

Mapping rules:

- The `mdx_content` family is decided by whether the URL is served
  through `app/(site)/[...slug]/page.tsx`, not by URL string match.
- A request to `/gatherer` is `bespoke_interactive`, even though its
  data layer is `item_cards`. Family describes the surface the user/
  agent is on; data-source dimensions are separate properties.
- `redirect` is recorded as a route family on the originating request
  if it is observable. The destination request is recorded as its own
  event with its own family.

Downstream tasks must implement this mapping in one place
(canonical location: `lib/analytics/route-family.ts` when it is
created in `pb-ba4.2`/`pb-ba4.5`). No component or route handler may
re-implement the mapping inline.

## Event Naming Convention

Event names are lowercase snake_case. They use a fixed prefix that
identifies what kind of observer produced the event.

| Prefix    | Producer                                | Use                                                                                           |
| --------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `human_`  | Browser SDK, in a real browser session  | Human-attributable interaction events.                                                        |
| `ax_`     | Server-side route handlers / middleware | Agent-experience events: requests to AX surfaces and to content surfaces from non-JS clients. |
| `agent_`  | Agent-classification module             | Classifier output. Always paired with an `ax_` event in the same request.                     |
| `system_` | Build / health / scheduled jobs         | Operational events that are not user-facing (e.g., catalog regeneration).                     |

Within a prefix, names use `<prefix>_<noun>_<verb>` where possible.

Initial event vocabulary (downstream tasks own implementation; this
list defines the names so siblings stay coherent):

- `human_pageview` — emitted on route change in the App Router.
  Properties include `route_family`, `path`, `referrer`, `locale`,
  `viewport_w`, `viewport_h`.
- `human_internal_link_click` — clicks on links to in-site routes.
  Properties include `from_route_family`, `to_route_family`,
  `to_path`.
- `human_outbound_link_click` — clicks on links whose host is not the
  site's host. Properties include `from_route_family`, `to_host`. Do
  not record full outbound URLs verbatim if they contain query
  strings.
- `human_search_submit` — search form submitted. Property: `query`
  (the text the user submitted, see hygiene rules).
- `human_search_result_click` — click on a result in the search UI.
  Properties: `query`, `result_route_family`, `result_rank`.
- `human_sidebar_navigate` — sidebar/topbar navigation use. Property:
  `to_route_family`.
- `human_item_card_open` — opening an item card detail. Properties:
  `card_section`, `card_category`, `card_subcategory`.
- `human_engagement_tick` — periodic visibility/engagement heartbeat
  used to estimate read time. Cadence and exact properties are
  decided in `pb-ba4.3`.
- `ax_route_request` — server-side request to any tracked route.
  Properties: `route_family`, `path`, `status`, `user_agent`,
  `referrer`, `is_js_likely`.
- `agent_classified` — paired classification output. Properties:
  `agent_family`, `agent_product`, `agent_mode`, `confidence`.
  See `pb-ba4.4` for the classifier vocabulary.
- `system_route_catalog_built` — emitted when the catalog
  regenerates, if the team decides to track it. Optional.

Property values must be primitive (string, number, boolean) wherever
possible. Nested objects are allowed only when they cleanly map to a
PostHog property dictionary; we are not using PostHog as a generic
event store.

## Local Verification

Three modes must work locally and must be verifiable end-to-end. The
behaviors below are how a reviewer (or an agent in a future PR) can
confirm the contract holds.

### Mode 1 — Disabled (default local)

Setup:

```bash
unset NEXT_PUBLIC_POSTHOG_KEY
unset NEXT_PUBLIC_POSTHOG_HOST
npm run dev
```

Verification:

- Load `http://localhost:3000`. Open DevTools → Network.
- Confirm no requests to `*.posthog.com`, `*.i.posthog.com`, or any
  configured PostHog host.
- Confirm no `<script>` tag with `posthog` in its `src` attribute.
- Confirm `window.posthog` is `undefined` in the console.
- In server logs, confirm no "PostHog event" log lines.

### Mode 2 — Configured (browser + server, local)

Setup (use a dedicated PostHog dev project, not production):

```bash
export NEXT_PUBLIC_POSTHOG_KEY=phc_dev_xxx
export NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
export POSTHOG_API_KEY=phc_dev_xxx
export POSTHOG_HOST=https://us.i.posthog.com
export NEXT_PUBLIC_ANALYTICS_ENV=local
npm run dev
```

Verification:

- Load `http://localhost:3000`. Confirm a request to the configured
  PostHog host appears in DevTools → Network.
- Trigger a search, click an internal link, click an outbound link.
- In the PostHog dev project, confirm `human_pageview`,
  `human_search_submit`, `human_internal_link_click`, and
  `human_outbound_link_click` events arrive within ~1 minute, with
  `route_family` populated and `environment=local`.
- Hit `/llms.txt` directly with `curl`. Confirm an `ax_route_request`
  event arrives in PostHog with `route_family=ax_llms_text` and a
  `user_agent` matching `curl/...`.
- Confirm Do Not Track behavior: enable DNT in the browser, reload,
  confirm no `human_*` events fire.

### Mode 3 — Production-like (Vercel build emulation)

Setup:

```bash
vercel pull --yes --environment=preview
vercel build
vercel dev
```

Verification:

- Repeat Mode 2 verifications against the `vercel dev` server.
- Confirm `NEXT_PUBLIC_ANALYTICS_ENV` (or the derived default) reads
  `preview` and that PostHog tags events accordingly.
- Confirm `ANALYTICS_DISABLED=1 vercel dev` produces zero analytics
  traffic for both browser and server, matching Mode 1 behavior.

A downstream task is responsible for adding an `npm run` script (for
example `npm run analytics:smoke`) that automates as much of the
above as is feasible. This contract does not require the script to
exist yet; it only requires that all three modes are verifiable by
hand today.

## Cross-References

- `AGENTS.md` and `CLAUDE.md` — operating model. Promotion path
  (feature branch → dev → main) governs how analytics changes ship.
- `lib/route-catalog.ts` — source of truth for route metadata. The
  route-family mapping lives next to this when it is created.
- `vercel.json` — current Vercel config. Analytics does not require
  changes here.
- Parent epic: `pb-ba4`. Sibling tasks: `pb-ba4.2` (browser
  foundation), `pb-ba4.3` (engagement events), `pb-ba4.4` (agent
  classification), `pb-ba4.5` (server-side AX capture), `pb-ba4.6`
  (review workflow).
