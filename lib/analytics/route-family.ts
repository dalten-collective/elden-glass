/**
 * Route-family vocabulary for analytics events.
 *
 * The vocabulary itself is fixed in `docs/analytics.md`. Every analytics
 * event — browser or server — must include a `route_family` property drawn
 * from this list so that downstream queries are stable across content moves.
 *
 * This module is the canonical mapping between a request path and its
 * route family. No other code path may inline its own mapping.
 */

export type RouteFamily =
  | 'home'
  | 'mdx_content'
  | 'bespoke_interactive'
  | 'search'
  | 'item_cards'
  | 'ax_llms_text'
  | 'ax_llms_toc'
  | 'ax_route_catalog'
  | 'feeds'
  | 'sitemap_catalog'
  | 'redirect'
  | 'static_asset'
  | 'unknown';

// Bespoke TSX routes called out in AGENTS.md / CLAUDE.md. The /gatherer page
// is a bespoke interactive route even though its data layer is item_cards;
// route family describes the surface, not the data source.
const BESPOKE_INTERACTIVE_PATHS = new Set<string>([
  '/xenotext',
  '/duchamp/duchamp-works',
  '/gatherer',
]);

const STATIC_ASSET_PREFIXES = ['/images/', '/proofs/', '/fonts/'];

/**
 * Strip query string and hash, then collapse a trailing slash on
 * non-root paths so '/foo/' and '/foo' map to the same family.
 */
function normalizePath(rawPath: string): string {
  if (!rawPath) return '/';
  const noQuery = rawPath.split('?')[0].split('#')[0];
  if (noQuery.length > 1 && noQuery.endsWith('/')) {
    return noQuery.slice(0, -1);
  }
  return noQuery;
}

/**
 * Resolve the route family for a given path.
 *
 * Designed to be safe for both server and browser callers. The mapping is
 * intentionally exhaustive for AX/server-only paths (e.g. `/llms.txt`) so
 * the same helper can be reused by `pb-ba4.5` server-side capture.
 */
export function routeFamilyForPath(rawPath: string): RouteFamily {
  const path = normalizePath(rawPath);

  if (path === '/') return 'home';

  // AX surfaces — explicit before generic routing
  if (path === '/llms.txt' || path === '/llms-full.txt') return 'ax_llms_text';
  if (path === '/api/llms/toc' || path.startsWith('/api/llms/')) return 'ax_llms_toc';
  if (path === '/contents') return 'ax_route_catalog';

  // Search page and API
  if (path === '/search' || path === '/api/search' || path.startsWith('/api/search/')) {
    return 'search';
  }

  // Structured item-card APIs (the /gatherer page itself is bespoke).
  if (path === '/api/item-cards' || path.startsWith('/api/item-cards/')) {
    return 'item_cards';
  }

  // Syndication and discovery surfaces
  if (path === '/feed.xml' || path === '/rss' || path === '/rss.xml') return 'feeds';
  if (path === '/sitemap.xml' || path === '/robots.txt') return 'sitemap_catalog';

  // Bespoke interactive TSX routes
  if (BESPOKE_INTERACTIVE_PATHS.has(path)) return 'bespoke_interactive';

  // Static asset roots
  for (const prefix of STATIC_ASSET_PREFIXES) {
    if (path.startsWith(prefix)) return 'static_asset';
  }

  // Any other API surface that did not match a more specific family above
  if (path.startsWith('/api/')) return 'unknown';

  // Fallthrough: anything served by the App Router site shell that wasn't
  // recognized above is treated as MDX-backed content. This matches the
  // catch-all behavior of `app/(site)/[...slug]/page.tsx`.
  return 'mdx_content';
}
