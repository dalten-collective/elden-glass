/**
 * Pure property builders for browser-side human engagement events.
 *
 * This module is intentionally posthog-free so it can be unit-tested
 * under `node --test` without pulling the browser SDK into the
 * dependency graph. The thin runtime wrappers in `browser-capture.ts`
 * import these builders and call `posthog.capture(...)` with the
 * resulting payloads.
 *
 * Event vocabulary and property hygiene rules come from
 * `docs/analytics.md`. Adding a new event is a documentation change in
 * that file plus a builder here — components must not assemble event
 * payloads inline.
 */
import { routeFamilyForPath } from './route-family.ts';

export type Surface = 'desktop' | 'mobile';

export type ItemCardSource = 'gatherer_grid' | 'mdx_inline' | 'deep_link';

export type SearchVia = 'page' | 'global';

export type SearchResultType = 'content' | 'titlecard';

/** Internal-link click — same-host navigation the SPA owns. */
export function buildInternalLinkClickProperties(input: {
  fromPath: string;
  toPath: string;
}): Record<string, unknown> {
  return {
    from_route_family: routeFamilyForPath(input.fromPath),
    from_path: input.fromPath,
    to_route_family: routeFamilyForPath(input.toPath),
    to_path: input.toPath,
  };
}

/**
 * Outbound-link click — host differs from the site's host.
 *
 * Only the host is recorded; full URLs may carry query strings or
 * tracking parameters, which docs/analytics.md forbids capturing.
 */
export function buildOutboundLinkClickProperties(input: {
  fromPath: string;
  toHost: string;
}): Record<string, unknown> {
  return {
    from_route_family: routeFamilyForPath(input.fromPath),
    from_path: input.fromPath,
    to_host: input.toHost,
  };
}

/** Sidebar/topbar nav use — emitted instead of `human_internal_link_click`. */
export function buildSidebarNavigateProperties(input: {
  fromPath: string;
  toPath: string;
  surface: Surface;
}): Record<string, unknown> {
  return {
    from_route_family: routeFamilyForPath(input.fromPath),
    from_path: input.fromPath,
    to_route_family: routeFamilyForPath(input.toPath),
    to_path: input.toPath,
    surface: input.surface,
  };
}

/**
 * Internal search form submit. Per docs/analytics.md only the explicitly
 * submitted query text is captured — never live keystrokes.
 *
 * `query_length` is exposed alongside `query` so analyses that opt to
 * scrub the text can still reason about typical query length.
 */
export function buildSearchSubmitProperties(input: {
  fromPath: string;
  query: string;
  via: SearchVia;
}): Record<string, unknown> {
  return {
    route_family: routeFamilyForPath(input.fromPath),
    path: input.fromPath,
    query: input.query,
    query_length: input.query.length,
    via: input.via,
  };
}

/** Click on an in-result item from the search UI. */
export function buildSearchResultClickProperties(input: {
  fromPath: string;
  query: string;
  resultPath: string;
  resultRank: number;
  resultType: SearchResultType;
}): Record<string, unknown> {
  return {
    route_family: routeFamilyForPath(input.fromPath),
    path: input.fromPath,
    query: input.query,
    result_route_family: routeFamilyForPath(input.resultPath),
    result_rank: input.resultRank,
    result_type: input.resultType,
  };
}

/**
 * Open of an item card detail. Section / category / subcategory may be
 * absent when the card is opened from an inline MDX context where the
 * payload has not loaded yet — record `null` rather than fabricating.
 */
export function buildItemCardOpenProperties(input: {
  fromPath: string;
  cardId: string;
  cardSection: string | null;
  cardCategory: string | null;
  cardSubcategory: string | null;
  source: ItemCardSource;
}): Record<string, unknown> {
  return {
    route_family: routeFamilyForPath(input.fromPath),
    path: input.fromPath,
    card_id: input.cardId,
    card_section: input.cardSection,
    card_category: input.cardCategory,
    card_subcategory: input.cardSubcategory,
    source: input.source,
  };
}
