/**
 * Pane — a rectangular region of the apparatus.
 *
 * Two variants:
 *   • default (glass): semi-transparent fill, hairline edge.
 *   • solid: ink-2 fill with a solid pane-edge.
 *
 * Used for vocabulary cards, correspondence lists, spec tiles — anywhere
 * a bounded block of the document needs to float on the ink ground.
 */

import type { HTMLAttributes, ReactNode } from 'react';

type PaneProps = HTMLAttributes<HTMLDivElement> & {
  solid?: boolean;
  children: ReactNode;
};

export function Pane({ solid, className, children, ...rest }: PaneProps) {
  const base = solid ? 'pane pane--solid' : 'pane';
  return (
    <div className={[base, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}
