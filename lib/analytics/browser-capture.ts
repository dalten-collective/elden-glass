'use client';

/**
 * Browser-side capture wrappers for human engagement events.
 *
 * Each function builds a payload via the pure helpers in
 * `browser-events.ts` and forwards it to `posthog.capture(...)`. The
 * thin wrapper layer is the single client-side import surface so
 * components do not call `posthog.capture` directly with ad-hoc
 * property bags.
 *
 * If posthog-js is not yet initialized, `posthog.capture` no-ops (the
 * provider only mounts these tracker components after `posthog.init`'s
 * `loaded` callback has fired). All calls are wrapped in `try/catch`
 * defensively — analytics outage must never break rendering.
 */
import posthog from 'posthog-js';

import {
  buildInternalLinkClickProperties,
  buildItemCardOpenProperties,
  buildOutboundLinkClickProperties,
  buildSearchResultClickProperties,
  buildSearchSubmitProperties,
  buildSidebarNavigateProperties,
  type ItemCardSource,
  type SearchResultType,
  type SearchVia,
  type Surface,
} from './browser-events.ts';

/** Current SPA path, or empty string when called server-side. */
function currentPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

function safeCapture(eventName: string, properties: Record<string, unknown>): void {
  try {
    posthog.capture(eventName, properties);
  } catch {
    // Capture errors must never break the page.
  }
}

function destinationUrl(path: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return new URL(path, window.location.origin).href;
  } catch {
    return null;
  }
}

export function captureInternalLinkClick(input: { toPath: string }): void {
  safeCapture(
    'human_internal_link_click',
    buildInternalLinkClickProperties({ fromPath: currentPath(), toPath: input.toPath })
  );
}

export function captureOutboundLinkClick(input: { toHost: string }): void {
  safeCapture(
    'human_outbound_link_click',
    buildOutboundLinkClickProperties({ fromPath: currentPath(), toHost: input.toHost })
  );
}

export function captureSidebarNavigate(input: { toPath: string; surface: Surface }): void {
  const currentUrl = destinationUrl(input.toPath);
  const standardDestinationProperties = currentUrl ? { $current_url: currentUrl } : {};
  safeCapture('human_sidebar_navigate', {
    ...buildSidebarNavigateProperties({
      fromPath: currentPath(),
      toPath: input.toPath,
      surface: input.surface,
    }),
    ...standardDestinationProperties,
  });
}

export function captureSearchSubmit(input: { query: string; via: SearchVia }): void {
  if (!input.query) return;
  safeCapture(
    'human_search_submit',
    buildSearchSubmitProperties({ fromPath: currentPath(), query: input.query, via: input.via })
  );
}

export function captureSearchResultClick(input: {
  query: string;
  resultPath: string;
  resultRank: number;
  resultType: SearchResultType;
}): void {
  safeCapture(
    'human_search_result_click',
    buildSearchResultClickProperties({
      fromPath: currentPath(),
      query: input.query,
      resultPath: input.resultPath,
      resultRank: input.resultRank,
      resultType: input.resultType,
    })
  );
}

export function captureItemCardOpen(input: {
  cardId: string;
  cardSection: string | null;
  cardCategory: string | null;
  cardSubcategory: string | null;
  source: ItemCardSource;
}): void {
  safeCapture(
    'human_item_card_open',
    buildItemCardOpenProperties({
      fromPath: currentPath(),
      cardId: input.cardId,
      cardSection: input.cardSection,
      cardCategory: input.cardCategory,
      cardSubcategory: input.cardSubcategory,
      source: input.source,
    })
  );
}
