const PENDING_SEARCH_TARGET_KEY = 'elden-glass:pending-search-target';
export const SEARCH_TARGET_EVENT = 'elden-glass:search-target';

export type PendingSearchTarget = {
  page: string;
  targetId: string;
};

/**
 * Stores a search-result block target so the destination page can scroll to it smoothly.
 */
export function savePendingSearchTarget(target: PendingSearchTarget) {
  window.sessionStorage.setItem(PENDING_SEARCH_TARGET_KEY, JSON.stringify(target));
}

/**
 * Requests a smooth scroll to a search target on the already-mounted page.
 */
export function dispatchSearchTarget(targetId: string) {
  window.dispatchEvent(new CustomEvent(SEARCH_TARGET_EVENT, { detail: { targetId } }));
}

/**
 * Reads a pending search target when the current page owns it.
 */
export function getPendingSearchTarget(page: string): PendingSearchTarget | null {
  const rawTarget = window.sessionStorage.getItem(PENDING_SEARCH_TARGET_KEY);
  if (!rawTarget) {
    return null;
  }

  try {
    const target = JSON.parse(rawTarget) as PendingSearchTarget;
    if (target.page !== page) {
      return null;
    }

    return target;
  } catch {
    window.sessionStorage.removeItem(PENDING_SEARCH_TARGET_KEY);
    return null;
  }
}

/**
 * Clears a pending search target after it has been consumed.
 */
export function clearPendingSearchTarget() {
  window.sessionStorage.removeItem(PENDING_SEARCH_TARGET_KEY);
}
