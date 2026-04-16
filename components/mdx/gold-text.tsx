import type { ReactNode } from 'react';

/**
 * Renders children in the site's accent-gold color for callout emphasis
 * within prose. Use sparingly — only for passages the author specifically
 * wants highlighted as key claims or discoveries.
 */
export function GoldText({ children }: { children: ReactNode }) {
  return (
    <span className="text-[var(--accent-gold)]" style={{ color: 'var(--accent-gold)' }}>
      {children}
    </span>
  );
}
