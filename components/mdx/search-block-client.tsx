'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  SEARCH_TARGET_EVENT,
  clearPendingSearchTarget,
  getPendingSearchTarget,
} from '@/lib/search-navigation';

/**
 * Flashes a search-target block when the URL hash points at one.
 */
export function SearchTargetFlash() {
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    let timeoutId: number | undefined;
    let observer: MutationObserver | undefined;

    const flashTarget = (targetId: string, shouldScroll = false) => {
      if (!targetId) {
        return false;
      }

      const target = document.getElementById(targetId);
      if (!target || target.dataset.searchBlock !== 'true') {
        return false;
      }

      if (shouldScroll) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.history.replaceState(
          window.history.state,
          '',
          `${window.location.pathname}${window.location.search}#${encodeURIComponent(targetId)}`
        );
      }

      target.classList.remove('search-target-flash');
      void target.getBoundingClientRect();
      target.classList.add('search-target-flash');

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        target.classList.remove('search-target-flash');
      }, 4000);

      return true;
    };

    const scrollToTargetWhenReady = (targetId: string) => {
      if (flashTarget(targetId, true)) {
        clearPendingSearchTarget();
        return;
      }

      observer = new MutationObserver(() => {
        if (flashTarget(targetId, true)) {
          clearPendingSearchTarget();
          observer?.disconnect();
          observer = undefined;
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    const flashHashTarget = () => {
      const hash = window.location.hash;
      const targetId = hash.startsWith('#') ? decodeURIComponent(hash.slice(1)) : '';
      flashTarget(targetId);
    };

    const flashRequestedTarget = (event: Event) => {
      const targetId = (event as CustomEvent<{ targetId?: string }>).detail?.targetId;
      if (targetId) {
        scrollToTargetWhenReady(targetId);
      }
    };

    const pendingTarget = getPendingSearchTarget(pathname);
    const frameId = window.requestAnimationFrame(() => {
      if (pendingTarget) {
        scrollToTargetWhenReady(pendingTarget.targetId);
        return;
      }

      flashHashTarget();
    });

    window.addEventListener('hashchange', flashHashTarget);
    window.addEventListener(SEARCH_TARGET_EVENT, flashRequestedTarget);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener('hashchange', flashHashTarget);
      window.removeEventListener(SEARCH_TARGET_EVENT, flashRequestedTarget);
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
