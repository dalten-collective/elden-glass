/**
 * Tests for server-side AX analytics capture.
 *
 * Run with `node --test lib/analytics/server-capture.test.ts`. Node 22.6+
 * strips TypeScript types natively; these tests stub `globalThis.fetch`
 * to inspect the outbound payload without a network round-trip.
 */

import { test, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';

import { captureAxRouteRequest } from './server-capture.ts';

type CapturedCall = { url: string; init: RequestInit };

const realFetch = globalThis.fetch;
const realEnv: Record<string, string | undefined> = {};
let calls: CapturedCall[] = [];

const ENV_KEYS = [
  'POSTHOG_API_KEY',
  'POSTHOG_HOST',
  'ANALYTICS_DISABLED',
  'NEXT_PUBLIC_ANALYTICS_ENV',
  'VERCEL_ENV',
] as const;

beforeEach(() => {
  calls = [];
  for (const key of ENV_KEYS) {
    realEnv[key] = process.env[key];
    delete process.env[key];
  }
  globalThis.fetch = ((url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return Promise.resolve(new Response(null, { status: 200 }));
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  for (const key of ENV_KEYS) {
    if (realEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = realEnv[key];
    }
  }
});

function configureProvider() {
  process.env.POSTHOG_API_KEY = 'phc_test_key';
  process.env.POSTHOG_HOST = 'https://us.i.posthog.com';
  process.env.NEXT_PUBLIC_ANALYTICS_ENV = 'test';
}

function readBatch(call: CapturedCall): { api_key: string; batch: Array<Record<string, unknown>> } {
  const body = call.init.body;
  if (typeof body !== 'string') {
    throw new Error('expected string fetch body');
  }
  return JSON.parse(body);
}

// --- No-op cases ---

test('no-op when POSTHOG_API_KEY/HOST are unset', async () => {
  await captureAxRouteRequest({
    method: 'GET',
    path: '/llms.txt',
    userAgent: 'curl/8.5.0',
    referrer: null,
  });
  assert.equal(calls.length, 0);
});

test('no-op when ANALYTICS_DISABLED=1 even with keys set', async () => {
  configureProvider();
  process.env.ANALYTICS_DISABLED = '1';
  await captureAxRouteRequest({
    method: 'GET',
    path: '/llms.txt',
    userAgent: 'ClaudeBot',
    referrer: null,
  });
  assert.equal(calls.length, 0);
});

test('no-op for static_asset family', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/images/foo.png',
    userAgent: 'ClaudeBot',
    referrer: null,
  });
  assert.equal(calls.length, 0);
});

test('no-op for unmapped /api/* path (unknown family)', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/api/agent-sync',
    userAgent: 'ClaudeBot',
    referrer: null,
  });
  assert.equal(calls.length, 0);
});

test('no-op for browser UA on a content surface (native browser analytics owns this)', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/living-thesis',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    referrer: null,
  });
  assert.equal(calls.length, 0);
});

// --- Capturing cases ---

test('captures AX surface for known agent UA', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/llms.txt',
    userAgent: 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +mailto:support@anthropic.com)',
    referrer: null,
  });
  assert.equal(calls.length, 1);
  const body = readBatch(calls[0]);
  assert.equal(body.api_key, 'phc_test_key');
  assert.equal(body.batch.length, 2);
  assert.equal(body.batch[0].event, 'ax_route_request');
  assert.equal(body.batch[1].event, 'agent_classified');

  const axProps = body.batch[0].properties as Record<string, unknown>;
  assert.equal(axProps.route_family, 'ax_llms_text');
  assert.equal(axProps.path, '/llms.txt');
  assert.equal(axProps.method, 'GET');
  assert.equal(axProps.is_js_likely, false);
  assert.equal(axProps.ax_surface, true);
  assert.equal(axProps.agent_surface_unknown, false);
  assert.equal(axProps.environment, 'test');

  const classifierProps = body.batch[1].properties as Record<string, unknown>;
  assert.equal(classifierProps.agent_family, 'anthropic');
  assert.equal(classifierProps.agent_product, 'ClaudeBot');
  assert.equal(classifierProps.agent_mode, 'training');
});

test('captures AX surface for unknown UA and tags agent_surface_unknown', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/llms.txt',
    userAgent: 'curl/8.5.0',
    referrer: null,
  });
  assert.equal(calls.length, 1);
  const body = readBatch(calls[0]);
  assert.equal(body.batch[0].distinct_id, 'agent_surface_unknown:ax_llms_text');

  const axProps = body.batch[0].properties as Record<string, unknown>;
  assert.equal(axProps.agent_surface_unknown, true);
  assert.equal(axProps.is_js_likely, false);

  const classifierProps = body.batch[1].properties as Record<string, unknown>;
  assert.equal(classifierProps.agent_family, 'unknown');
  assert.equal(classifierProps.agent_surface_unknown, true);
});

test('captures content surface for non-browser UA (Claude-User on /tldr)', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/tldr',
    userAgent: 'Claude-User/1.0 (+https://www.anthropic.com)',
    referrer: 'https://example.com/agent-context',
  });
  assert.equal(calls.length, 1);
  const body = readBatch(calls[0]);

  const axProps = body.batch[0].properties as Record<string, unknown>;
  assert.equal(axProps.route_family, 'mdx_content');
  assert.equal(axProps.ax_surface, false);
  assert.equal(axProps.is_js_likely, false);
  assert.equal(axProps.referrer, 'https://example.com/agent-context');

  const classifierProps = body.batch[1].properties as Record<string, unknown>;
  assert.equal(classifierProps.agent_family, 'anthropic');
  assert.equal(classifierProps.agent_product, 'Claude-User');
});

test('captures /api/llms/toc for known agent UA', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/api/llms/toc',
    userAgent: 'GPTBot/1.0',
    referrer: null,
  });
  assert.equal(calls.length, 1);
  const body = readBatch(calls[0]);
  const axProps = body.batch[0].properties as Record<string, unknown>;
  assert.equal(axProps.route_family, 'ax_llms_toc');
  assert.equal(axProps.ax_surface, true);

  const classifierProps = body.batch[1].properties as Record<string, unknown>;
  assert.equal(classifierProps.agent_family, 'openai');
  assert.equal(classifierProps.agent_product, 'GPTBot');
});

test('captures /sitemap.xml regardless of UA (browser UA still emits)', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/sitemap.xml',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    referrer: null,
  });
  assert.equal(calls.length, 1);
  const body = readBatch(calls[0]);
  const axProps = body.batch[0].properties as Record<string, unknown>;
  assert.equal(axProps.route_family, 'sitemap_catalog');
  assert.equal(axProps.ax_surface, true);
  assert.equal(axProps.is_js_likely, true);
});

test('forwards optional status when supplied', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/llms.txt',
    userAgent: 'ClaudeBot',
    referrer: null,
    status: 200,
  });
  const body = readBatch(calls[0]);
  const axProps = body.batch[0].properties as Record<string, unknown>;
  assert.equal(axProps.status, 200);
});

test('omits sensitive headers — body never contains cookie/authorization', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/llms.txt',
    userAgent: 'ClaudeBot',
    referrer: null,
  });
  const raw = String(calls[0].init.body);
  assert.equal(/cookie/i.test(raw), false);
  assert.equal(/authorization/i.test(raw), false);
});

test('posts to POSTHOG_HOST + /batch/ with JSON content type', async () => {
  configureProvider();
  await captureAxRouteRequest({
    method: 'GET',
    path: '/feed.xml',
    userAgent: 'CCBot/2.0',
    referrer: null,
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://us.i.posthog.com/batch/');
  assert.equal(calls[0].init.method, 'POST');
  const headers = calls[0].init.headers as Record<string, string>;
  assert.equal(headers['Content-Type'], 'application/json');
});
