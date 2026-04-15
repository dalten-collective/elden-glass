import type { ReactNode } from 'react';

interface CalloutRowProps {
  cols?: 2 | 3;
  children: ReactNode;
}

/**
 * Lays out two or more sibling Callouts (or ConceptCards) side-by-side on
 * medium+ viewports, stacking on narrow screens. Defaults to a 2-column
 * grid; pass `cols={3}` for three-tile rows. Zeroes out each child's own
 * vertical margin so the grid gap controls spacing.
 */
export function CalloutRow({ cols = 2, children }: CalloutRowProps) {
  const colsClass = cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className={`my-6 grid grid-cols-1 gap-6 ${colsClass} not-prose [&>*]:!my-0`}>
      {children}
    </div>
  );
}
