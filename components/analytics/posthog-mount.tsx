import {
  getBrowserAnalyticsConfig,
  isAnalyticsHardDisabledServerSide,
} from '@/lib/analytics/config';

import { PostHogProvider } from './posthog-provider';

/**
 * Server-side gate for the browser analytics shim.
 *
 * Runs in the root layout. Reads the server-only `ANALYTICS_DISABLED` kill
 * switch and the public PostHog configuration. When either condition forbids
 * analytics, we render nothing and no client provider hydrates — keeping
 * disabled environments fully analytics-free without leaking the kill-switch
 * variable to the browser bundle.
 */
export function PostHogMount() {
  if (isAnalyticsHardDisabledServerSide()) return null;

  const config = getBrowserAnalyticsConfig();
  if (!config.enabled) return null;

  return (
    <PostHogProvider
      apiKey={config.key}
      apiHost={config.host}
      env={config.env}
      debug={config.debug}
    />
  );
}
