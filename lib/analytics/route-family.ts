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
  | 'site_path'
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
  | 'probe'
  | 'telemetry'
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

// Observed configuration and software paths, including probes below /app or /src.
const PROBE_DIRECTORY =
  /(?:^|\/)(?:wp-admin|wp-content|wp-includes|wp-json|\.git|\.svn|\.ssh|\.aws|\.docker|\.claude|\.codex|\.cursor|\.continue|\.hermes|\.openclaw|@fs)(?:\/|$)/i;
const PROBE_FILE =
  /(?:^|\/)(?:\.git-credentials|\.gitconfig|\.npmrc|\.htpasswd|\.mcp\.json|\.claude\.json|credentials\.(?:json|js)|secrets\.(?:json|yml)|id_(?:rsa|dsa|ecdsa|ed25519)|terraform\.tfstate)(?:\/|$)/i;

/**
 * Strip query string and hash, then collapse a trailing slash on
 * non-root paths so '/foo/' and '/foo' map to the same family.
 */
export function normalizePath(rawPath: string): string {
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

  // This is our PostHog ingestion proxy, not a page or an agent reading content.
  if (path === '/_eg/mark' || path.startsWith('/_eg/mark/')) return 'telemetry';

  // These paths target software/configuration the site does not serve. This
  // describes the requested path, not the caller's identity or exploit success.
  if (
    /\.php(?:\/|$)/i.test(path) ||
    PROBE_DIRECTORY.test(path) ||
    PROBE_FILE.test(path) ||
    /(?:^|\/)\.env(?:[./]|$)/i.test(path)
  ) {
    return 'probe';
  }

  // AX surfaces — explicit before generic routing
  if (
    ['/llms.txt', '/llms-full.txt', '/.well-known/llms.txt', '/.well-known/llms-full.txt'].includes(
      path
    )
  )
    return 'ax_llms_text';
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
  // Public assets can also live outside the named static roots.
  if (
    path.startsWith('/_next/') ||
    /\.(?:avif|gif|ico|jpe?g|png|svg|webp|pdf|txt|woff2?|ttf|otf|css|js|map|mp[34]|webm|wav)$/i.test(
      path
    )
  ) {
    return 'static_asset';
  }

  // Any other API surface that did not match a more specific family above
  if (path.startsWith('/api/')) return 'unknown';

  // The proxy runs before route resolution. A site-shaped path can be an
  // article, redirect, or nonexistent URL; this does not certify a content read.
  return 'site_path';
}
