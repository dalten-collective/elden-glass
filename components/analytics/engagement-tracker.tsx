'use client';

import { useEffect } from 'react';

import {
  captureInternalLinkClick,
  captureOutboundLinkClick,
  captureSidebarNavigate,
} from '@/lib/analytics/browser-capture';

/**
 * Document-level human interaction tracker.
 *
 * Attached once by `PostHogProvider` after `posthog.init`'s `loaded`
 * callback resolves. It delegates anchor activations bubbling up from
 * the document and emits site-specific `human_*` events. Sidebar/topbar
 * navigation is distinguished from in-content internal links by the
 * `data-eg-nav-surface` attribute on the enclosing nav root, which the
 * Stair component sets.
 *
 * Generic web analytics events such as `$pageview`, `$pageleave`, scroll
 * depth, and `$web_vitals` are owned by PostHog's native SDK behavior.
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

  return null;
}
