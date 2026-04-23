'use client';

import { useEffect } from 'react';

/**
 * Flashes a search-target block when the URL hash points at one.
 */
export function SearchTargetFlash() {
  useEffect(() => {
    let timeoutId: number | undefined;

    const flashTarget = () => {
      const hash = window.location.hash;
      const targetId = hash.startsWith('#') ? decodeURIComponent(hash.slice(1)) : '';

      if (!targetId) {
        return;
      }

      const target = document.getElementById(targetId);
      if (!target || target.dataset.searchBlock !== 'true') {
        return;
      }

      target.classList.remove('search-target-flash');
      void target.getBoundingClientRect();
      target.classList.add('search-target-flash');

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        target.classList.remove('search-target-flash');
      }, 4000);
    };

    const frameId = window.requestAnimationFrame(flashTarget);
    window.addEventListener('hashchange', flashTarget);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('hashchange', flashTarget);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
