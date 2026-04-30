/**
 * Browser-side analytics configuration.
 *
 * Reads only the documented environment variables from `docs/analytics.md`
 * and derives a sensible environment label. No keys are hardcoded.
 *
 * This module is safe to import from server components: it only reads
 * from `process.env` and does not touch browser globals.
 */

export type AnalyticsBrowserConfig = {
  /** True only when both required public PostHog vars are present. */
  enabled: boolean;
  /** Public PostHog project API key (browser-safe). */
  key: string;
  /** Browser SDK API host. Uses the same-origin reverse proxy when enabled. */
  host: string;
  /** Raw PostHog ingestion host used by the Next.js reverse proxy rewrites. */
  directHost: string;
  /** Free-form environment label tagged on every event. */
  env: string;
  /** When true, the browser shim emits verbose console logs. */
  debug: boolean;
};

function asBool(value: string | undefined): boolean {
  return value === '1' || value === 'true';
}

/**
 * Derive an environment label per the contract in docs/analytics.md.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_ANALYTICS_ENV — explicit operator override
 *   2. VERCEL_ENV — Vercel sets this automatically on builds and at
 *      runtime ('production' / 'preview' / 'development'). It is server-
 *      visible only, which is fine because this function is called from
 *      the server-side mount component and the resolved string is then
 *      passed into the client provider as a prop.
 *   3. 'local' fallback for ad-hoc local development.
 */
function deriveEnvLabel(): string {
  const explicit = process.env.NEXT_PUBLIC_ANALYTICS_ENV;
  if (explicit && explicit.length > 0) return explicit;
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === 'production' || vercelEnv === 'preview' || vercelEnv === 'development') {
    return vercelEnv;
  }
  return 'local';
}

/**
 * Resolve the browser-analytics configuration from public env vars.
 *
 * Missing required vars degrade silently to `enabled: false` so callers can
 * short-circuit without breaking rendering.
 */
export function getBrowserAnalyticsConfig(): AnalyticsBrowserConfig {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
  const directHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? '';
  const debug = asBool(process.env.NEXT_PUBLIC_ANALYTICS_DEBUG);
  const env = deriveEnvLabel();
  const enabled = key.length > 0 && directHost.length > 0;
  return { enabled, key, host: '/ingest', directHost, env, debug };
}

/**
 * Server-side kill switch. Honors `ANALYTICS_DISABLED=1` from the operator.
 * Must be called from server components only — `ANALYTICS_DISABLED` is
 * intentionally not exposed to the browser bundle.
 */
export function isAnalyticsHardDisabledServerSide(): boolean {
  return asBool(process.env.ANALYTICS_DISABLED);
}

export type AnalyticsServerConfig = {
  /** True only when both required server PostHog vars are present and not killed. */
  enabled: boolean;
  /** Server-only PostHog project API key. */
  key: string;
  /** Server-only PostHog ingestion host. */
  host: string;
  /** Free-form environment label tagged on every event. */
  env: string;
};

/**
 * Resolve the server-side analytics configuration from server-only env vars.
 *
 * Reads `POSTHOG_API_KEY` and `POSTHOG_HOST` per docs/analytics.md and honors
 * the `ANALYTICS_DISABLED=1` kill switch. Missing required vars degrade
 * silently to `enabled: false` so callers (middleware, route handlers) can
 * short-circuit without breaking responses.
 *
 * Server-only on purpose: the Node code path must never depend on
 * `NEXT_PUBLIC_*` mirrors of these values, even when the project policy
 * happens to use the same key for browser and server.
 */
export function getServerAnalyticsConfig(): AnalyticsServerConfig {
  const env = deriveEnvLabel();
  if (isAnalyticsHardDisabledServerSide()) {
    return { enabled: false, key: '', host: '', env };
  }
  const key = process.env.POSTHOG_API_KEY ?? '';
  const host = process.env.POSTHOG_HOST ?? '';
  const enabled = key.length > 0 && host.length > 0;
  return { enabled, key, host, env };
}
