'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import {
  captureEngagementTick,
  captureInternalLinkClick,
  captureOutboundLinkClick,
  captureSidebarNavigate,
} from '@/lib/analytics/browser-capture';
import { ENGAGEMENT_DEPTHS, shouldEmitEngagementTicks } from '@/lib/analytics/browser-events';

/**
 * Document-level engagement tracker.
 *
 * Attached once by `PostHogProvider` after `posthog.init`'s `loaded`
 * callback resolves. Two responsibilities:
 *
 *   1. Click delegation — observe anchor activations bubbling up from
 *      the document and emit the matching `human_*_link_click` event.
 *      Sidebar/topbar navigation is distinguished from in-content
 *      internal links by the `data-eg-nav-surface` attribute on the
 *      enclosing nav root, which the Stair component sets.
 *   2. Read-depth ticks — restrained scroll-depth heartbeats on
 *      content surfaces only. Each (path, threshold) pair fires at
 *      most once per pageview to avoid the vanity-metric volume that
 *      docs/analytics.md warns against.
 */

const SIDEBAR_SURFACE_ATTR = 'data-eg-nav-surface';

type NavSurfaceAttr = 'desktop' | 'mobile';

function readNavSurface(el: HTMLElement | null): NavSurfaceAttr | null {
  if (!el) return null;
  const value = el.getAttribute(SIDEBAR_SURFACE_ATTR);
  if (value === 'mobile' || value === 'desktop') return value;
  return null;
}

export function EngagementTracker() {
  const pathname = usePathname();

  // Click delegation — installed once for the lifetime of the tracker.
  // The capture-phase listener intentionally observes every anchor
  // activation; modifier-key clicks (open in new tab) are still useful
  // signal because they represent the same intent to leave the surface.
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      // Use the raw href so non-http schemes (mailto:, tel:) do not get
      // resolved into the current origin and misclassified as internal.
      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;
      if (rawHref.startsWith('#')) return;
      if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return;
      if (rawHref.startsWith('javascript:')) return;

      let url: URL;
      try {
        url = new URL(rawHref, window.location.href);
      } catch {
        return;
      }

      const isExternal = url.host !== window.location.host;
      if (isExternal) {
        captureOutboundLinkClick({ toHost: url.host });
        return;
      }

      const navRoot = anchor.closest(`[${SIDEBAR_SURFACE_ATTR}]`) as HTMLElement | null;
      const surface = readNavSurface(navRoot);
      if (surface) {
        captureSidebarNavigate({ toPath: url.pathname, surface });
        return;
      }

      captureInternalLinkClick({ toPath: url.pathname });
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // Scroll-depth ticks — reset per pathname so each page gets its own
  // independent set of fired thresholds.
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set<number>();

    if (typeof pathname !== 'string') return;
    if (!shouldEmitEngagementTicks(pathname)) return;

    let raf = 0;

    function evaluate() {
      const docEl = document.documentElement;
      const totalScroll = docEl.scrollHeight - docEl.clientHeight;
      if (totalScroll <= 0) {
        // Page is shorter than the viewport — treat as fully read once.
        if (!firedRef.current.has(100)) {
          firedRef.current.add(100);
          captureEngagementTick({ depth: 100 });
        }
        return;
      }

      const pct = Math.min(100, Math.round((window.scrollY / totalScroll) * 100));
      for (const threshold of ENGAGEMENT_DEPTHS) {
        if (pct >= threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold);
          captureEngagementTick({ depth: threshold });
        }
      }
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(evaluate);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount in case the page was opened scrolled (deep link
    // to an anchor) or is too short to ever scroll.
    evaluate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  return null;
}
