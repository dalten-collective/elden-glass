/**
 * Server-side AX (agent-experience) event capture.
 *
 * Posts paired `ax_route_request` and `agent_classified` events to
 * PostHog's HTTP `/batch/` ingestion endpoint. Designed so non-JS agent
 * fetches and crawler requests are visible even when the browser shim
 * never runs (the docs/analytics.md contract).
 *
 * No request bodies, query strings, cookies, or sensitive headers are
 * captured — only path, method, route family, status (when supplied),
 * referrer, and user-agent string. The user-agent is intentionally
 * captured for AX events because the classifier needs it
 * (see docs/analytics.md, "May Capture").
 *
 * Encapsulates the full policy from docs/analytics.md:
 *   - Missing `POSTHOG_API_KEY` / `POSTHOG_HOST` or `ANALYTICS_DISABLED=1`
 *     no-ops the call.
 *   - `static_asset` and `unknown` route families are not AX-relevant and
 *     are skipped.
 *   - Browser-classified clients on human-facing surfaces (home,
 *     mdx_content, bespoke_interactive, search, item_cards,
 *     ax_route_catalog) are skipped to avoid double-counting against the
 *     native `$pageview` browser event. AX-only surfaces (`ax_llms_text`,
 *     `ax_llms_toc`, `feeds`, `sitemap_catalog`) are always captured —
 *     they are intentionally classified as AX traffic regardless of UA.
 *
 * Fire-and-forget: returns the underlying fetch Promise so a caller can
 * pipe it through `request.waitUntil` or Next.js `after()` if one is
 * available; letting the Promise float is also safe because PostHog
 * ingestion never gates the response.
 */

import { classifyUserAgent, type AgentClassification } from './agent-classifier.ts';
import { getServerAnalyticsConfig } from './config.ts';
import { routeFamilyForPath, type RouteFamily } from './route-family.ts';

export type AxCaptureInput = {
  method: string;
  path: string;
  userAgent: string | null;
  referrer: string | null;
  /** Response status, when known by the caller (route handlers). Optional. */
  status?: number;
};

/** AX-only surfaces — captured regardless of the classified UA. */
const AX_ONLY_FAMILIES = new Set<RouteFamily>([
  'ax_llms_text',
  'ax_llms_toc',
  'feeds',
  'sitemap_catalog',
]);

/** Families that are not meaningful for AX analytics. */
const SKIPPED_FAMILIES = new Set<RouteFamily>(['static_asset', 'unknown']);

/** PostHog batch ingestion path (relative to `POSTHOG_HOST`). */
const BATCH_ENDPOINT = '/batch/';

/**
 * Capture an AX route request. Returns a Promise so callers can await or
 * pipe it through a `waitUntil`-style helper; the function itself never
 * throws — fetch failures are swallowed because analytics outage must
 * not break rendering.
 */
export function captureAxRouteRequest(input: AxCaptureInput): Promise<void> {
  const config = getServerAnalyticsConfig();
  if (!config.enabled) return Promise.resolve();

  const family = routeFamilyForPath(input.path);
  if (SKIPPED_FAMILIES.has(family)) return Promise.resolve();

  const classification = classifyUserAgent(input.userAgent ?? null);
  const isBrowser = classification.agent_family === 'browser';
  const axSurface = AX_ONLY_FAMILIES.has(family);

  // On non-AX surfaces, ordinary browsers are already counted by
  // native PostHog browser analytics. Skipping them here is the dedupe
  // rule the docs/analytics.md acceptance criterion calls for.
  if (!axSurface && isBrowser) return Promise.resolve();

  const isUnknownAgentOnAxSurface = axSurface && classification.agent_family === 'unknown';
  const distinctId = deriveDistinctId(family, classification, isUnknownAgentOnAxSurface);
  const timestamp = new Date().toISOString();

  const sharedProps = {
    environment: config.env,
    route_family: family,
    path: input.path,
    method: input.method,
    user_agent: input.userAgent ?? '',
    referrer: input.referrer ?? null,
    status: input.status ?? null,
    is_js_likely: isBrowser,
    ax_surface: axSurface,
    agent_surface_unknown: isUnknownAgentOnAxSurface,
  };

  const classifierProps = {
    environment: config.env,
    path: input.path,
    route_family: family,
    ax_surface: axSurface,
    agent_family: classification.agent_family,
    agent_product: classification.agent_product,
    agent_mode: classification.agent_mode,
    confidence: classification.confidence,
    matched_token: classification.matched_token,
    agent_surface_unknown: isUnknownAgentOnAxSurface,
  };

  const payload = {
    api_key: config.key,
    batch: [
      {
        event: 'ax_route_request',
        distinct_id: distinctId,
        timestamp,
        properties: sharedProps,
      },
      {
        event: 'agent_classified',
        distinct_id: distinctId,
        timestamp,
        properties: classifierProps,
      },
    ],
  };

  const url = `${config.host.replace(/\/$/, '')}${BATCH_ENDPOINT}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
    keepalive: true,
  })
    .then(() => undefined)
    .catch(() => undefined);
}

/**
 * Choose a distinct_id for the event pair.
 *
 * Server-side AX events do not stitch identity across requests. The id is
 * a coarse, anonymous bucket that lets PostHog group "same kind of
 * client" without inventing a per-request user. Unknown clients on AX
 * surfaces collapse to a single `agent_surface_unknown:<family>` bucket
 * so the acceptance criterion ("recorded as agent_surface_unknown") is
 * directly visible in the PostHog Persons view.
 */
function deriveDistinctId(
  family: RouteFamily,
  classification: AgentClassification,
  isUnknownAgentOnAxSurface: boolean
): string {
  if (isUnknownAgentOnAxSurface) {
    return `agent_surface_unknown:${family}`;
  }
  if (classification.agent_family === 'unknown') {
    return `agent:unknown:${family}`;
  }
  const product = classification.agent_product || classification.agent_family;
  return `agent:${classification.agent_family}:${product}`;
}
