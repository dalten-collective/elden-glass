# Elden Glass Analytics Stack and Deployment Contract

This document is the single contract that downstream analytics work
(`pb-ba4.2` through `pb-ba4.6`) must conform to. It names the providers,
the deployment configuration, the data-hygiene rules, the route-family
vocabulary, the event-naming convention, and the local verification
steps.

The provider SDKs and runtime capture code are wired in by the sibling
tasks under `pb-ba4`. This document remains the source of truth for
reviewing that implementation and for operating the dashboards after
deployment.

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

## PostHog Project Settings

The PostHog setup checklist is partly code and partly PostHog project
configuration.

Configure **Authorized URLs** in PostHog for:

- `https://eldenringisthelargeglass.com`
- `https://elden-glass.vercel.app`
- `https://elden-glass-git-dev-erichelal-3278s-projects.vercel.app`
- PR / branch preview URLs used for validation, or a project-level
  Vercel wildcard if PostHog accepts it for the account.

The current code enables the checklist's canonical web events:

- `$pageview`
- `$pageleave`
- scroll-depth properties on pageview/pageleave events
- `$web_vitals`

Browser-side PostHog traffic is routed through the same-origin
`/_eg/mark` reverse proxy configured in `next.config.mjs`. The browser
SDK uses `/_eg/mark` as its `api_host`, while the Next.js rewrites
forward requests to the PostHog Cloud project host:

- `/_eg/mark/static/:path*` → PostHog asset origin `/static/:path*`
- `/_eg/mark/array/:path*` → PostHog asset origin `/array/:path*`
- `/_eg/mark/:path*` → PostHog ingest origin `/:path*`

The rewrite targets derive from `NEXT_PUBLIC_POSTHOG_HOST`; the current
US Cloud project routes assets to `https://us-assets.i.posthog.com` and
ingest requests to `https://us.i.posthog.com`. Server-side AX capture
continues to use `POSTHOG_HOST` directly because browser tracking
blockers do not affect server-to-server event capture.

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
| `item_cards`          | `/api/item-cards`, `/api/item-cards/[id]`                          | The structured item-card APIs. The `/gatherer` page itself is `bespoke_interactive`. |
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

Current emitted event vocabulary:

- `$pageview` — emitted by PostHog's native browser SDK on initial load
  and App Router history changes. This is the primary human pageview
  event for PostHog Web Analytics.
- `$pageleave` — emitted by PostHog's native browser SDK when a pageview
  ends. This powers native session-duration, bounce-rate, and scroll-depth
  reporting.
- `$web_vitals` — emitted by PostHog's native browser SDK for Core Web
  Vitals. This powers the Web Analytics performance view.
- `human_internal_link_click` — clicks on links to in-site routes.
  Properties: `from_route_family`, `from_path`, `to_route_family`,
  `to_path`.
- `human_outbound_link_click` — clicks on links whose host is not the
  site's host. Properties: `from_route_family`, `from_path`,
  `to_host`. Do not record full outbound URLs verbatim.
- `human_sidebar_navigate` — sidebar/topbar navigation use. Properties:
  `from_route_family`, `from_path`, `to_route_family`, `to_path`,
  `$pathname`, `$current_url`, `surface` (`desktop` or `mobile`). The
  PostHog standard URL fields intentionally point at the destination so
  PostHog's event list and URL breakdowns read as navigation outcomes;
  `from_path` preserves the source page.
- `human_search_submit` — search form submitted. Properties:
  `route_family`, `path`, `query`, `query_length`, `via` (`page` or
  `global`). The `query` is only the text the user submitted; see the
  hygiene rules.
- `human_search_result_click` — click on a result in the search UI.
  Properties: `route_family`, `path`, `query`, `result_route_family`,
  `result_rank`, `result_type` (`content` or `itemcard`).
- `human_item_card_open` — opening an item card detail. Properties:
  `route_family`, `path`, `card_id`, `card_section`,
  `card_category`, `card_subcategory`, `source` (`gatherer_grid`,
  `mdx_inline`, or `deep_link`).
- `ax_route_request` — server-side request to any tracked route.
  Properties: `environment`, `route_family`, `path`, `method`,
  `user_agent`, `referrer`, `status`, `is_js_likely`, `ax_surface`,
  `agent_surface_unknown`.
- `agent_classified` — paired classification output. Properties:
  `environment`, `path`, `route_family`, `ax_surface`,
  `agent_family`, `agent_product`, `agent_mode`, `confidence`,
  `matched_token`, `agent_surface_unknown`. The event is emitted in
  the same server-side PostHog batch as its matching
  `ax_route_request`.

Property values must be primitive (string, number, boolean) wherever
possible. Nested objects are allowed only when they cleanly map to a
PostHog property dictionary; we are not using PostHog as a generic
event store.

## Maintainer Review Workflow

Eric should review analytics in two places:

1. **PostHog** for product behavior, human engagement, internal
   search, item-card use, and AX / LLM traffic.
2. **Google Search Console** for Google search acquisition and indexing
   health. GSC query data is not ingested into PostHog, so SEO review
   always happens in GSC.

Keep Preview and Production separate. All PostHog saved views should
include an `environment` filter. Use `environment=production` for the
weekly site review, and `environment=preview` for PR or release-adjacent
validation.

### Expected PostHog Saved Views

Create a dashboard named **Elden Glass Analytics Review** with these
saved cards.

| Card                 | Event filter                                             | Breakdowns / properties                                                                           | Question answered                                                     |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Human arrivals       | `$pageview`                                              | `$pathname`, `$current_url`, `$referrer`                                                          | What brought humans here, and which surfaces did they enter?          |
| Reading depth        | `$pageleave` / Web Analytics scroll-depth properties     | `$pathname`, previous-pageview scroll properties                                                  | Which pages hold attention and how far do readers scroll?             |
| Web vitals           | `$web_vitals`                                            | LCP, INP, CLS, FCP metrics                                                                        | What real-user performance issues affect readers?                     |
| Internal searches    | `human_search_submit`                                    | `query`, `query_length`, `via`                                                                    | What are humans trying to find from `/search` or global search?       |
| Search result clicks | `human_search_result_click`                              | `query`, `result_type`, `result_route_family`, `result_rank`                                      | Which searches lead to useful clicks?                                 |
| Navigation use       | `human_internal_link_click` and `human_sidebar_navigate` | `from_path`, `to_path`, `to_route_family`, `surface`                                              | How do humans move through the site shell and content links?          |
| Item-card opens      | `human_item_card_open`                                   | `card_section`, `card_category`, `card_subcategory`, `source`                                     | Which Gatherer / item-card taxonomy areas attract use?                |
| AX route requests    | `ax_route_request`                                       | `route_family`, `path`, `method`, `status`, `ax_surface`, `is_js_likely`, `agent_surface_unknown` | Which AX and content routes are being fetched by non-browser clients? |
| Agent classification | `agent_classified`                                       | `agent_family`, `agent_product`, `agent_mode`, `confidence`, `matched_token`, `route_family`      | Which known agents accessed AX routes or ordinary content?            |

PostHog owns generic web analytics. Use `$pageview`, `$pageleave`,
scroll-depth properties, `$web_vitals`, and the native Web Analytics UI
for ordinary traffic questions. Use custom `human_*` events only where
they add Elden Glass-specific interaction semantics, and use `ax_*` /
`agent_*` events for agent-experience traffic.

### Human Analytics Review

Run this weekly and after material releases.

- Start with PostHog Web Analytics or `$pageview` filtered to
  `environment=production`. Break down by `$pathname`, `$current_url`,
  and `$referrer` to see which authored pages, bespoke interactive
  routes, and search surfaces are drawing traffic.
- Use `$referrer` / referrer dimensions on `$pageview` for broad acquisition source
  hints. Treat it as incomplete: browsers and referrer policies often
  suppress or trim it, and Google query text belongs in GSC.
- Use PostHog's Web Analytics scroll-depth/session-duration data for
  reading depth. Treat short sessions carefully: some readers may get
  the point from a short page without scrolling deeply.
- Review `human_search_submit` by `query`, `query_length`, and `via`.
  `via=page` means the `/search` page; `via=global` means the global
  search surface. A repeated query with few
  `human_search_result_click` events is a content or ranking signal.
- Review `human_search_result_click` by `result_rank`,
  `result_type`, and `result_route_family`. High-value queries should
  produce low-rank clicks to `content` or `itemcard` results.
- Review `human_item_card_open` by taxonomy properties and `source`.
  `source=gatherer_grid` measures Gatherer browsing, `mdx_inline`
  measures inline card interest inside prose, and `deep_link` measures
  direct card opens.

### Search Console Review

Run this weekly, and again after publishing or reorganizing major MDX
pages.

- In **Performance > Search results**, inspect queries, pages,
  impressions, clicks, CTR, and average position for the canonical
  production domain.
- Answer "what brought humans here from Google?" with GSC query and
  page data, then compare those landing pages to PostHog Web Analytics
  pageview, session-duration, and scroll-depth behavior.
- Watch for pages with impressions but low CTR. Those need title,
  summary, or snippet work before they need analytics code changes.
- Watch for pages with clicks but low read depth in PostHog. Those
  may need better above-the-fold framing, route summaries, or internal
  links.
- In **Indexing > Pages** and **Sitemaps**, confirm that `/sitemap.xml`
  is accepted and that important MDX pages are indexed. GSC indexing
  state answers a different question than PostHog traffic volume.

### AX / LLM Traffic Review

Run this weekly and after any release that changes `/llms.txt`,
`/api/llms/toc`, `/contents`, route summaries, sitemap output, or
robots behavior.

- Start with `ax_route_request` filtered to
  `environment=production`. Break down by `route_family` and `path`.
  AX-native surfaces are `ax_llms_text`, `ax_llms_toc`,
  `ax_route_catalog`, `feeds`, and `sitemap_catalog`.
- To see agents reading ordinary authored pages, filter
  `ax_route_request` to `route_family=mdx_content` and
  `ax_surface=false`. Browser user agents on human-facing surfaces are
  skipped server-side, so these rows represent non-browser clients that
  reached content routes.
- Use `status` to catch broken AX access. Repeated non-2xx statuses on
  `/llms.txt`, `/api/llms/toc`, `/contents`, `/sitemap.xml`, or
  `/robots.txt` should be treated as release blockers.
- Use `agent_surface_unknown=true` to find AX surface requests where
  the user agent did not match a known agent or browser rule. These
  are real requests, but not attributable to a named provider.
- Review the paired `agent_classified` event by `agent_family`,
  `agent_product`, `agent_mode`, `confidence`, and `matched_token`.
  It is emitted in the same server-side batch as the corresponding
  `ax_route_request`, with the same `distinct_id` and timestamp.

### Claude And Other Agent Distinctions

The classifier intentionally distinguishes provider, product, and mode.
Use all three fields before making claims.

| Provider signal | `agent_product`    | `agent_mode` | Interpretation                                                     |
| --------------- | ------------------ | ------------ | ------------------------------------------------------------------ |
| Anthropic       | `ClaudeBot`        | `training`   | Anthropic crawler documented for model-training corpus collection. |
| Anthropic       | `Claude-SearchBot` | `search`     | Anthropic search / indexing crawler.                               |
| Anthropic       | `Claude-User`      | `user_fetch` | Fetch made on behalf of a Claude user prompt.                      |
| OpenAI          | `GPTBot`           | `training`   | OpenAI crawler documented for model-training corpus collection.    |
| OpenAI          | `OAI-SearchBot`    | `search`     | OpenAI search / indexing crawler.                                  |
| OpenAI          | `ChatGPT-User`     | `user_fetch` | Fetch made on behalf of a ChatGPT user prompt.                     |
| Perplexity      | `Perplexity-User`  | `user_fetch` | Fetch made on behalf of a Perplexity user prompt.                  |

When Eric wants to know whether user-triggered Claude or OpenAI fetches
are happening, filter `agent_classified` to
`agent_family=anthropic`, `agent_product=Claude-User`,
`agent_mode=user_fetch`, or to `agent_family=openai`,
`agent_product=ChatGPT-User`, `agent_mode=user_fetch`. Then inspect the
paired `ax_route_request.path` / `route_family` distribution around the
same time window. `ClaudeBot`, `Claude-SearchBot`, `GPTBot`, and
`OAI-SearchBot` answer different questions and should not be counted as
user-triggered fetches.

### Confidence Caveats

Analytics here answers "what requests and browser events did we see?"
It does not answer "total LLM usage of the site."

- `confidence=high` means a known published agent token matched the
  user-agent string. User agents can still be spoofed.
- `confidence=medium` currently applies to ordinary browser tokens.
  Browser AX events appear only on AX-only surfaces because browser
  traffic on human-facing surfaces is owned by native `$pageview`
  browser analytics.
- `confidence=none` and `agent_family=unknown` mean no known token
  matched. On AX-only surfaces, these events are still useful as
  `agent_surface_unknown=true`, but they must not be attributed to a
  provider.
- LLMs can read copied text, cached content, screenshots, search
  snippets, or third-party indexes without making a fresh request to
  Elden Glass. Do not infer total Claude/OpenAI/LLM use from these
  server events alone.
- Google Search Console and PostHog use different measurement models.
  GSC is the authority for Google query and indexing questions;
  PostHog is the authority for site behavior and AX request events.

### Weekly Checklist

- Check Web Analytics top paths, referrers, session duration, and
  scroll depth for unexpected shifts.
- Check `human_search_submit` and `human_search_result_click` for
  unanswered or poorly ranked internal search intent.
- Check `human_item_card_open` for Gatherer taxonomy areas that deserve
  better links or prose integration.
- Check GSC Performance for query/page changes and GSC Indexing for
  sitemap or indexing problems.
- Check `ax_route_request` status and route-family distribution for AX
  surfaces.
- Check `agent_classified` for Claude/OpenAI user-fetch evidence and
  for unexpected spikes in training, search, or unknown traffic.

### Preview And Release Manual Verification

Run these steps on every preview deployment that changes analytics,
routes, AX surfaces, search, or route metadata. Set
`PREVIEW_URL` to the Vercel preview origin, with no trailing slash.

```bash
export PREVIEW_URL=https://example-git-branch-project.vercel.app
```

Browser checks:

- Open `$PREVIEW_URL` in a normal browser session and load at least one
  MDX page, `/search`, and `/gatherer`.
- Submit a search from `/search`; submit another from global search.
  Click at least one search result.
- Click an internal content link, a sidebar/topbar navigation link,
  and an outbound link.
- Open an item card from `/gatherer` and, where a page includes one,
  an inline MDX item card.
- In PostHog, filter to `environment=preview` and confirm the expected
  `$pageview`, `$pageleave`, `$web_vitals`,
  `human_search_submit`, `human_search_result_click`,
  `human_internal_link_click`, `human_sidebar_navigate`,
  `human_outbound_link_click`, and `human_item_card_open` events appear
  with the properties documented above.
- On an MDX page, scroll before navigating away; confirm PostHog's
  native pageleave/scroll-depth properties populate rather than looking
  for a custom read-depth event.

AX checks:

```bash
curl -A 'Claude-User/1.0 (+https://www.anthropic.com)' "$PREVIEW_URL/llms.txt"
curl -A 'ClaudeBot/1.0 (+https://www.anthropic.com)' "$PREVIEW_URL/tldr"
curl -A 'ChatGPT-User/1.0 (+https://openai.com)' "$PREVIEW_URL/api/llms/toc"
curl -A 'GPTBot/1.0' "$PREVIEW_URL/contents"
curl -A 'curl/8.5.0' "$PREVIEW_URL/llms.txt"
```

- Confirm each request creates an `ax_route_request` and paired
  `agent_classified` event in `environment=preview`.
- Confirm `Claude-User` and `ChatGPT-User` classify as
  `agent_mode=user_fetch`, while `ClaudeBot` and `GPTBot` do not.
- Confirm the plain `curl/...` request to `/llms.txt` has
  `agent_family=unknown`, `confidence=none`, and
  `agent_surface_unknown=true`.
- Confirm `/tldr` with `ClaudeBot` records `route_family=mdx_content`
  and `ax_surface=false`.

Production checks after merge:

- Repeat a smaller version of the browser and AX checks on the
  canonical production domain, filtering PostHog to
  `environment=production`.
- In GSC, use URL Inspection for changed production URLs after they
  deploy. Preview URLs are not the SEO source of truth.
- If any AX endpoint returns a non-2xx `status` in PostHog, fix that
  before treating the release as validated.

## Local Verification

Three modes must work locally and must be verifiable end-to-end. The
behaviors below are how a reviewer (or an agent in a future PR) can
confirm the contract holds.

### Mode 1 — Disabled (default local)

Setup:

```bash
unset NEXT_PUBLIC_POSTHOG_KEY
unset NEXT_PUBLIC_POSTHOG_HOST
unset POSTHOG_API_KEY
unset POSTHOG_HOST
unset ANALYTICS_DISABLED
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
- In the PostHog dev project, confirm `$pageview`, `$pageleave`,
  `$web_vitals`, `human_search_submit`, `human_internal_link_click`, and
  `human_outbound_link_click` events arrive within ~1 minute, with
  `environment=local`.
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
  route-family mapping is implemented by `lib/analytics/route-family.ts`.
- `vercel.json` — current Vercel config. Analytics does not require
  changes here.
- Parent epic: `pb-ba4`. Sibling tasks: `pb-ba4.2` (browser
  foundation), `pb-ba4.3` (engagement events), `pb-ba4.4` (agent
  classification), `pb-ba4.5` (server-side AX capture), `pb-ba4.6`
  (review workflow).
