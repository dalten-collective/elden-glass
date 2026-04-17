import type { ReactNode } from 'react';

/**
 * A single passage quote with an optional attribution line rendered outside
 * and below the blockquote card, right-aligned in small muted text. Opts out
 * of prose so the typography plugin's auto-curly-quotes don't pile on top
 * of whatever quoting glyphs the author included in the passage.
 */
export function Quote({ source, children }: { source?: string; children: ReactNode }) {
  return (
    <figure className="my-6 not-prose">
      <blockquote className="border-l-2 border-[var(--accent-gold)] pl-4 py-1 font-serif italic leading-relaxed text-[var(--text-primary)] [&_p]:!m-0 [&_p]:font-serif [&_p]:italic [&>p:first-of-type]:before:content-['“'] [&>p:last-of-type]:after:content-['”']">
        {children}
      </blockquote>
      {source && (
        <figcaption className="mt-2 pr-1 text-right text-xs not-italic text-[var(--text-tertiary)]">
          — {source}
        </figcaption>
      )}
    </figure>
  );
}
