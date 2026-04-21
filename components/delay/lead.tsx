/**
 * Lead — a lead paragraph with an opt-in readymade DropCap.
 *
 *   <Lead plate="iii" letter="I">
 *     In ordinary usage, physics describes the general laws…
 *   </Lead>
 *
 * Renders a `<p class="lead has-dropcap flush">` paragraph. The
 * `has-dropcap` class suppresses the CSS `::first-letter` drop cap
 * that would otherwise paint a second glyph over the SVG.
 *
 * If `letter` is omitted, the component uses the first grapheme of the
 * first string child. The "flush" class disables the serif indent so
 * the paragraph opens hard-left against the DropCap.
 */

import { Children, type ReactNode } from 'react';

import { DropCap } from './dropcap';

type LeadProps = {
  children: ReactNode;
  plate?: string;
  letter?: string;
  className?: string;
};

export function Lead({ children, plate = 'i', letter, className }: LeadProps) {
  // When the caller doesn't pass `letter`, pick the first visible
  // character of the first string child. Falls back to "I" — a safe
  // opening letter for the generic English essay.
  const resolvedLetter = letter ?? firstChar(children) ?? 'I';
  const cls = ['lead', 'has-dropcap', 'flush', className].filter(Boolean).join(' ');

  return (
    <p className={cls}>
      <DropCap letter={resolvedLetter} plate={plate} />
      {children}
    </p>
  );
}

// Pull the first visible character out of the children tree so an author
// can write `<Lead>In ordinary usage…</Lead>` without repeating the 'I'.
function firstChar(node: ReactNode): string | null {
  const kids = Children.toArray(node);
  for (const kid of kids) {
    if (typeof kid === 'string' || typeof kid === 'number') {
      const trimmed = String(kid).trimStart();
      if (trimmed.length > 0) return trimmed.charAt(0);
    }
    // Skip React elements, fragments, booleans, null — we only pick the
    // first literal character we find.
  }
  return null;
}
