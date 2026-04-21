/**
 * MarginNote — the pataphysical gloss beside the body.
 *
 *   <MarginNote spec="note · feb 2024">
 *     Miyazaki called it "a small element," and said…
 *   </MarginNote>
 *
 * On desktop this is a left-ruled paragraph in the right (or left)
 * column. On mobile it recomposes — see `AsideInline` for the
 * single-column variant the mobile artboard uses.
 */

import type { ReactNode } from 'react';

type MarginNoteProps = {
  spec?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function MarginNote({ spec, children, className }: MarginNoteProps) {
  return (
    <aside className={['margin-note', className].filter(Boolean).join(' ')}>
      {spec && <span className="spec">{spec}</span>}
      {children}
    </aside>
  );
}

type AsideInlineProps = {
  spec?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * AsideInline — the single-column recompose of a MarginNote.
 * Use this inside prose that does not have a margin column.
 */
export function AsideInline({ spec, children, className }: AsideInlineProps) {
  return (
    <aside className={['aside-inline', className].filter(Boolean).join(' ')}>
      {spec && <span className="spec">{spec}</span>}
      {children}
    </aside>
  );
}
