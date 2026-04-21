/**
 * PullQuote — the named quote component.
 *
 * Two variants, per the design spec:
 *   • default: gold-ruled block with a big left curly quote, the
 *     quote as a "delay" sitting inside the prose flow.
 *   • epigraph: border-bottom only, no ornament; opens a section
 *     with a Duchamp fragment above the crack.
 *
 *   <PullQuote
 *     variant="epigraph"
 *     attribution={{ name: 'Marcel Duchamp', src: <><i>The Green Box</i>, c. 1934</> }}
 *   >
 *     Only an initiate could understand The Large Glass.
 *   </PullQuote>
 *
 * The component file is named pull-quote.tsx (not quote.tsx) because
 * `components/mdx/quote.tsx` already exists for a different MDX need.
 */

import type { ReactNode } from 'react';

type Attribution = {
  name: ReactNode;
  src?: ReactNode;
};

type PullQuoteProps = {
  variant?: 'block' | 'epigraph';
  attribution?: Attribution;
  children: ReactNode;
  className?: string;
};

export function PullQuote({ variant = 'block', attribution, children, className }: PullQuoteProps) {
  const cls = ['quote', variant === 'epigraph' ? 'quote--epi' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <figure className={cls}>
      <div className="quote-body">{children}</div>
      {attribution && (
        <figcaption className="quote-attr">
          <span className="em-dash" />
          <span className="name">{attribution.name}</span>
          {attribution.src && <span className="src">{attribution.src}</span>}
        </figcaption>
      )}
    </figure>
  );
}
