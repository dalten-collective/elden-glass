import type { ReactNode } from 'react';

/**
 * Lays out two or more sibling Callouts side-by-side on medium+ viewports,
 * stacking on narrow screens. Zeroes out each child's own vertical margin
 * so the grid gap controls spacing.
 */
export function CalloutRow({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 gap-6 md:grid-cols-2 not-prose [&>*]:!my-0">
      {children}
    </div>
  );
}
