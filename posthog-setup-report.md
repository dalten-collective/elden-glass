<wizard-report>
# PostHog post-wizard report

The wizard audited the existing PostHog integration in Elden Glass and found it already comprehensively instrumented. All browser-side events were wired up across the PostHog provider, engagement tracker, search pages, and item card components. It also confirmed environment variables are set correctly and built a PostHog dashboard with five insights.

Codex follow-up on `pb-ba4.7/posthog-wizard-baseline`: the browser provider now lets PostHog emit canonical Web Analytics events (`$pageview`, `$pageleave`, scroll properties, and `$web_vitals`) instead of replacing them with custom pageview/read-depth events. The custom event layer is now limited to Elden Glass-specific interactions and AX analytics. Browser-side PostHog requests now go through the same-origin `/ingest` reverse proxy configured in `next.config.mjs`. The wizard-created `middleware.ts` was removed because Next.js 16 rejects projects that contain both `middleware.ts` and `proxy.ts`; `proxy.ts` is the correct active request proxy entrypoint for this repo.

## Changes made

| File                   | Change                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `.env.local`           | Updated `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY`, `POSTHOG_HOST` with correct project values |
| `.posthog-events.json` | Created event inventory (removed at end of wizard run)                                                                       |

## Event inventory

| Event                       | Description                                                                                                          | File                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `$pageview`                 | Native PostHog pageview on initial load and App Router history changes                                               | `components/analytics/posthog-provider.tsx`    |
| `$pageleave`                | Native PostHog pageleave with scroll/session properties                                                              | `components/analytics/posthog-provider.tsx`    |
| `$web_vitals`               | Native PostHog Core Web Vitals capture                                                                               | `components/analytics/posthog-provider.tsx`    |
| `human_internal_link_click` | Same-host anchor clicks outside nav; from/to path and route_family                                                   | `components/analytics/engagement-tracker.tsx`  |
| `human_outbound_link_click` | Clicks on external links; records to_host only (no full URL)                                                         | `components/analytics/engagement-tracker.tsx`  |
| `human_sidebar_navigate`    | Sidebar/topbar nav clicks identified by `data-eg-nav-surface`; includes surface (desktop\|mobile)                    | `components/analytics/engagement-tracker.tsx`  |
| `human_search_submit`       | Search form submission from `/search` page; via=page                                                                 | `app/(site)/search/page.tsx`                   |
| `human_search_submit`       | Global search bar submission; via=global                                                                             | `components/site/global-search.tsx`            |
| `human_search_result_click` | Click on a result in `/search` results list; includes result_rank, result_type                                       | `app/(site)/search/page.tsx`                   |
| `human_search_result_click` | Click on a result in global search dropdown; result_type=titlecard for item cards                                    | `components/site/global-search.tsx`            |
| `human_item_card_open`      | Item card opened from the Gatherer grid (source=gatherer_grid) or deep link (source=deep_link)                       | `app/(site)/gatherer/page.tsx`                 |
| `human_item_card_open`      | Inline MDX title-card reference clicked (source=mdx_inline)                                                          | `components/title-cards/title-card-inline.tsx` |
| `ax_route_request`          | Server-side: every non-browser, non-static request via Next.js proxy; skips browser clients on human-facing surfaces | `proxy.ts`                                     |
| `agent_classified`          | Paired with ax_route_request in the same PostHog batch; contains agent_family, agent_product, agent_mode, confidence | `proxy.ts`                                     |

## Next steps

A dashboard and five insights have been built to monitor key user behaviors:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/402828/dashboard/1525324)

- [Human arrivals over time](https://us.posthog.com/project/402828/insights/p03qgBm4) — update to use `$pageview`
- [Reading depth on content pages](https://us.posthog.com/project/402828/insights/GyuuupeD) — update to use Web Analytics scroll/pageleave data
- [Search submit → result click conversion](https://us.posthog.com/project/402828/insights/IQpLKp4T) — funnel from search submission to result click
- [Item card opens by source](https://us.posthog.com/project/402828/insights/wUg3Ym8n) — card discovery via gatherer_grid, mdx_inline, deep_link
- [AX agent traffic by family](https://us.posthog.com/project/402828/insights/vKa2FDKF) — server-side agent_classified events broken down by agent_family

Remember to filter all saved views by `environment=production` for the weekly review, and `environment=preview` for PR validation. The `ANALYTICS_DISABLED=1` kill switch disables both browser and server analytics in any environment.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
