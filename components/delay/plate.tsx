/**
 * Plate — a figure reproduction, the way it sits in a monograph.
 *
 *   <Plate no="i" caption="Marcel Duchamp…">
 *     <img src="/images/large-glass.jpg" alt="The Large Glass" />
 *   </Plate>
 *
 * The plate-number floats top-right; the caption renders as italic
 * serif below the figure. On mobile the plate breaks the gutter
 * (full-bleed) via the mobile rules in globals.css.
 */

import type { HTMLAttributes, ReactNode } from 'react';

type PlateProps = HTMLAttributes<HTMLElement> & {
  no?: ReactNode;
  caption?: ReactNode;
  children: ReactNode;
};

export function Plate({ no, caption, className, children, ...rest }: PlateProps) {
  return (
    <figure className={['plate', className].filter(Boolean).join(' ')} {...rest}>
      {no != null && <span className="plate-no">plate {no}</span>}
      {children}
      {caption && <figcaption className="plate-cap">{caption}</figcaption>}
    </figure>
  );
}
