/**
 * Correspondence — a Glass ↔ Ring mapping row.
 *
 * Used inside the Correspondences pane on the TL;DR and showcase pages.
 * The two-column form (left Glass-side, right Ring-side) uses a center
 * double-headed arrow; on mobile it stacks.
 *
 *   <Correspondence n={1}
 *     glass="The Bride"
 *     ring="Marika the Eternal"
 *   />
 */

import type { ReactNode } from 'react';

type CorrespondenceProps = {
  n: ReactNode;
  glass: ReactNode;
  ring: ReactNode;
  stacked?: boolean;
  className?: string;
};

export function Correspondence({ n, glass, ring, stacked, className }: CorrespondenceProps) {
  if (stacked) {
    return (
      <div
        className={['corr corr--stacked', className].filter(Boolean).join(' ')}
        style={{
          display: 'grid',
          gridTemplateColumns: '24px 1fr',
          columnGap: 10,
          rowGap: 2,
          padding: '7px 0',
          borderBottom: '1px solid var(--crack)',
        }}
      >
        <span className="spec" style={{ color: 'var(--gold)', fontSize: 10 }}>
          [{n}]
        </span>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 14,
              color: 'var(--paper-dim)',
              lineHeight: 1.3,
            }}
          >
            {glass}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 14,
              color: 'var(--paper)',
              lineHeight: 1.3,
            }}
          >
            ↳ {ring}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={['corr', className].filter(Boolean).join(' ')}
      style={{
        display: 'grid',
        gridTemplateColumns: '24px 1fr 22px 1fr',
        alignItems: 'baseline',
        gap: 12,
        padding: '7px 0',
        borderBottom: '1px solid var(--crack)',
      }}
    >
      <span
        className="spec"
        style={{
          color: 'var(--gold)',
          fontSize: 10,
          letterSpacing: '0.1em',
        }}
      >
        [{n}]
      </span>
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 15,
          color: 'var(--paper-dim)',
        }}
      >
        {glass}
      </span>
      <span
        style={{
          color: 'var(--gold-dim)',
          fontFamily: 'var(--font-serif)',
          fontSize: 16,
          textAlign: 'center',
        }}
      >
        ↔
      </span>
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 15,
          color: 'var(--paper)',
        }}
      >
        {ring}
      </span>
    </div>
  );
}
