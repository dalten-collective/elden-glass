'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import posthog from 'posthog-js';

import { EngagementTracker } from './engagement-tracker';

/**
 * Browser-side PostHog initializer and pageview tracker.
 *
 * This component is the single client surface for analytics. It:
 *   - Initializes posthog-js once on mount, using values handed to it by the
 *     server-side mount component (no env reads happen here).
 *   - Honors Do Not Track, Sec-GPC, and a hard local opt-out marker.
 *   - Lets PostHog own canonical Web Analytics events (`$pageview`,
 *     `$pageleave`, scroll properties, and `$web_vitals`) so the native
 *     dashboards and setup checklist work as intended.
 *   - Mounts custom Elden Glass interaction tracking only after
 *     `posthog.init` has resolved (`loaded` callback flips ready state),
 *     avoiding capture against a not-yet-loaded global.
 *   - Does nothing if any required input is missing — analytics must degrade
 *     silently and never break rendering.
 */

type Props = {
  apiKey: string;
  apiHost: string;
  env: string;
  debug: boolean;
};

const OPT_OUT_KEY = 'eg.analytics.optout';

/**
 * Returns true when the browser environment forbids analytics.
 *
 * Combines DNT, GPC, and a local opt-out marker. Each signal is checked
 * defensively — feature detection rather than UA sniffing — so a missing
 * global never throws.
 */
function shouldSuppressInBrowser(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return true;
  }

  const nav = navigator as Navigator & {
    msDoNotTrack?: string;
    globalPrivacyControl?: boolean;
  };
  const win = window as Window & { doNotTrack?: string };

  const dntRaw = nav.doNotTrack ?? nav.msDoNotTrack ?? win.doNotTrack;
  if (dntRaw === '1' || dntRaw === 'yes') return true;

  if (nav.globalPrivacyControl === true) return true;

  try {
    if (window.localStorage?.getItem(OPT_OUT_KEY) === '1') return true;
  } catch {
    // localStorage access throws in some sandboxed/private contexts. Treat
    // that as "no opt-out marker" rather than failing closed, since the
    // user has not actively opted out.
  }

  return false;
}

export function PostHogProvider({ apiKey, apiHost, env, debug }: Props) {
  const initRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (initRef.current) return;
    if (!apiKey || !apiHost) return;
    if (shouldSuppressInBrowser()) return;
    initRef.current = true;

    posthog.init(apiKey, {
      api_host: apiHost,
      defaults: '2026-01-30',
      // Keep click autocapture quiet for now, but let PostHog emit the
      // canonical web analytics events its dashboards expect.
      autocapture: false,
      capture_pageview: 'history_change',
      capture_pageleave: 'if_capture_pageview',
      capture_performance: {
        web_vitals: true,
      },
      // Remote project settings can enable this separately from general
      // autocapture. Keep it off until we intentionally add dead-click review.
      capture_dead_clicks: false,
      // Defensive: this site has no logged-in concept and no recording use.
      disable_session_recording: true,
      disable_scroll_properties: false,
      // Defer profile creation until something explicitly identifies a user.
      person_profiles: 'identified_only',
      // Belt-and-suspenders alongside our own DNT/GPC checks.
      respect_dnt: true,
      loaded: (instance) => {
        instance.register({ environment: env });
        if (debug) {
          instance.debug();
          console.debug('[analytics] posthog initialized', { env, host: apiHost });
        }
        setReady(true);
      },
    });
  }, [apiKey, apiHost, env, debug]);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <EngagementTracker />
    </Suspense>
  );
}
