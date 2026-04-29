/**
 * Tests for browser-side human-engagement event property builders.
 *
 * Run with `node --test lib/analytics/browser-events.test.ts`. The
 * builders are pure functions of their inputs and the route-family
 * mapping; no posthog-js or DOM is required.
 */

import { test } from 'node:test';
import { strict as assert } from 'node:assert';

import {
  buildInternalLinkClickProperties,
  buildItemCardOpenProperties,
  buildOutboundLinkClickProperties,
  buildSearchResultClickProperties,
  buildSearchSubmitProperties,
  buildSidebarNavigateProperties,
} from './browser-events.ts';

test('internal-link click captures from/to route families and paths', () => {
  const props = buildInternalLinkClickProperties({
    fromPath: '/living-thesis',
    toPath: '/duchamp/chess/overview',
  });
  assert.equal(props.from_path, '/living-thesis');
  assert.equal(props.from_route_family, 'mdx_content');
  assert.equal(props.to_path, '/duchamp/chess/overview');
  assert.equal(props.to_route_family, 'mdx_content');
});

test('outbound-link click records only the host, never the full URL', () => {
  const props = buildOutboundLinkClickProperties({
    fromPath: '/duchamp/chess/overview',
    toHost: 'example.com',
  });
  assert.equal(props.from_path, '/duchamp/chess/overview');
  assert.equal(props.from_route_family, 'mdx_content');
  assert.equal(props.to_host, 'example.com');
  assert.equal('to_url' in props, false);
  assert.equal('to_path' in props, false);
});

test('sidebar-navigate distinguishes desktop and mobile surfaces', () => {
  const desktop = buildSidebarNavigateProperties({
    fromPath: '/',
    toPath: '/gatherer',
    surface: 'desktop',
  });
  assert.equal(desktop.surface, 'desktop');
  assert.equal(desktop.to_route_family, 'bespoke_interactive');

  const mobile = buildSidebarNavigateProperties({
    fromPath: '/',
    toPath: '/search',
    surface: 'mobile',
  });
  assert.equal(mobile.surface, 'mobile');
  assert.equal(mobile.to_route_family, 'search');
});

test('search-submit captures query text, length, and origin surface', () => {
  const fromPage = buildSearchSubmitProperties({
    fromPath: '/search',
    query: 'erotema',
    via: 'page',
  });
  assert.equal(fromPage.query, 'erotema');
  assert.equal(fromPage.query_length, 7);
  assert.equal(fromPage.via, 'page');
  assert.equal(fromPage.route_family, 'search');

  const fromGlobal = buildSearchSubmitProperties({
    fromPath: '/duchamp/chess/overview',
    query: 'glass',
    via: 'global',
  });
  assert.equal(fromGlobal.via, 'global');
  assert.equal(fromGlobal.route_family, 'mdx_content');
});

test('search-result click captures rank and result kind without leaking result body', () => {
  const props = buildSearchResultClickProperties({
    fromPath: '/search',
    query: 'glass',
    resultPath: '/duchamp/chess/overview',
    resultRank: 2,
    resultType: 'content',
  });
  assert.equal(props.query, 'glass');
  assert.equal(props.result_route_family, 'mdx_content');
  assert.equal(props.result_rank, 2);
  assert.equal(props.result_type, 'content');
  // No matched-sentence / context body should ever be on the payload.
  assert.equal('result_body' in props, false);
  assert.equal('context' in props, false);
});

test('item-card open keeps null taxonomy when caller did not have it', () => {
  const props = buildItemCardOpenProperties({
    fromPath: '/duchamp/chess/overview',
    cardId: 'erdtree-burial-watchdog',
    cardSection: null,
    cardCategory: null,
    cardSubcategory: null,
    source: 'mdx_inline',
  });
  assert.equal(props.card_id, 'erdtree-burial-watchdog');
  assert.equal(props.card_section, null);
  assert.equal(props.card_category, null);
  assert.equal(props.card_subcategory, null);
  assert.equal(props.source, 'mdx_inline');
});
