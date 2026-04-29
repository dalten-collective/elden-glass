'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

import { routeFamilyForPath } from '@/lib/analytics/route-family';

import { EngagementTracker } from './engagement-tracker';

/**
 * Browser-side PostHog initializer and pageview tracker.
 *
 * This component is the single client surface for analytics. It:
 *   - Initializes posthog-js once on mount, using values handed to it by the
 *     server-side mount component (no env reads happen here).
 *   - Honors Do Not Track, Sec-GPC, and a hard local opt-out marker.
 *   - Disables PostHog autocapture and built-in pageview capture so our
 *     vocabulary in docs/analytics.md owns event names.
 *   - Routes both the initial pageview and App Router route-change pageviews
 *     through a single `PageviewTracker` effect so there is exactly one
 *     `human_pageview` emitter and a single dedupe ref. The tracker is
 *     mounted only after `posthog.init` has resolved (`loaded` callback
 *     flips ready state), avoiding capture against a not-yet-loaded global.
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

/**
 * Properties attached to every `human_pageview` event. Kept minimal per the
 * data-hygiene rules in docs/analytics.md — no PII, no untrimmed UA, no full
 * URL with query string.
 */
function readPageviewProperties() {
  if (typeof window === 'undefined') return {};
  return {
    referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : null,
    locale: navigator.language ?? null,
    viewport_w: window.innerWidth,
    viewport_h: window.innerHeight,
  };
}

/**
 * Internal tracker that listens for App Router navigation and emits the
 * `human_pageview` event for each unique pathname (+ search params) shown.
 *
 * This is the only `human_pageview` emitter. The provider mounts it only
 * after `posthog.init`'s `loaded` callback has resolved, so the very first
 * effect run captures the initial pageview against an already-initialized
 * client. Subsequent App Router navigations re-run the effect with new
 * `pathname` / `searchParams` values; the dedupe ref ensures each
 * (pathname, search) tuple fires at most once.
 *
 * Wrapped in <Suspense> by the parent because `useSearchParams` requires a
 * suspense boundary in App Router.
 */
function PageviewTracker({ debug }: { debug: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastReportedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (typeof window === 'undefined') return;

    const queryString = searchParams?.toString() ?? '';
    const fullKey = queryString ? `${pathname}?${queryString}` : pathname;
    if (lastReportedRef.current === fullKey) return;
    lastReportedRef.current = fullKey;

    const properties = {
      route_family: routeFamilyForPath(pathname),
      path: pathname,
      ...readPageviewProperties(),
    };

    posthog.capture('human_pageview', properties);
    if (debug) {
      console.debug('[analytics] human_pageview', properties);
    }
  }, [pathname, searchParams, debug]);

  return null;
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
      // Our event vocabulary in docs/analytics.md owns the names; turn off
      // PostHog's automatic capture so it does not produce parallel events.
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      // Defensive: this site has no logged-in concept and no recording use.
      disable_session_recording: true,
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
        // Hand off all `human_pageview` emission to PageviewTracker by
        // marking the provider ready. Mounting the tracker now means its
        // first effect run captures the initial pageview against an
        // already-loaded client, with no parallel capture from this
        // callback to double-count against.
        setReady(true);
      },
    });
  }, [apiKey, apiHost, env, debug]);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <PageviewTracker debug={debug} />
      <EngagementTracker />
    </Suspense>
  );
}
