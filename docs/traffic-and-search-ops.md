# Traffic and Search Operations

This is the maintenance loop for lightweight growth work on Elden Glass. It is
meant to keep Codex useful without asking Eric to become the analytics operator.

## Weekly Traffic Readout

Run:

```bash
npm run traffic:weekly
```

The report reads PostHog through HogQL and prints a markdown summary of:

- human pageviews, visitors, sessions, and last activity
- daily human trend for the last 14 days
- top human pages and referrers
- agent traffic by classified identity
- top AX request paths

Required local env:

```bash
POSTHOG_PERSONAL_API_KEY=phx_...
POSTHOG_PROJECT_ID=402828
POSTHOG_QUERY_HOST=https://us.posthog.com
```

`POSTHOG_PROJECT_ID` and `POSTHOG_QUERY_HOST` have repo defaults for the
current US Cloud project. The personal API key must stay local.

## Search Plumbing Audit

Run:

```bash
npm run audit:search
```

The audit checks the repo surfaces that control indexing and snippets:

- root metadata, canonical URL, Open Graph, Twitter card, and WebSite JSON-LD
- MDX content-page canonical, Open Graph, Twitter, and Article JSON-LD metadata
- sitemap generation from the route catalog
- robots sitemap plus explicit LLM API allow-listing
- MDX frontmatter required for titles, summaries, and updated dates

Use this as a regression check after changes to metadata, routing, frontmatter,
or the route catalog. It is advisory for now; it is not wired into `npm run
check`.

## Operating Boundary

PostHog answers what visitors and agents actually did on the site. Google
Search Console answers what Google queries and indexing produced those arrivals.

Do not rewrite the AX surfaces just to chase traffic. `/skill`, `/contents`,
`/llms.txt`, and `/llms-full.txt` exist to give agents the right reading path
once they arrive. Growth work should focus on content quality, search metadata,
route discoverability, and external distribution.
