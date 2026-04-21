/**
 * Eyebrow, Spec, Cap — small typographic voices that appear in the
 * apparatus (labels, running heads, plate captions, specs).
 *
 * All three are span-level and style-only. Tone options map to the
 * accent palette (gold / rust / blue) per the design spec.
 */

import type { HTMLAttributes, ReactNode } from 'react';

type EyebrowTone = 'muted' | 'gold' | 'rust' | 'blue';

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: EyebrowTone;
  children: ReactNode;
};

const TONE_CLASS: Record<EyebrowTone, string> = {
  muted: 'eyebrow',
  gold: 'eyebrow eyebrow--gold',
  rust: 'eyebrow eyebrow--rust',
  blue: 'eyebrow eyebrow--blue',
};

/** Uppercase apparatus label (Inter Tight, wide-tracked). */
export function Eyebrow({ tone = 'muted', className, children, ...rest }: EyebrowProps) {
  return (
    <span className={[TONE_CLASS[tone], className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}

/** Monospace spec voice — hashes, coordinates, plate numbers. */
export function Spec({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={['spec', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}

/** Sans caption voice — plate captions, small notes. */
export function Cap({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={['cap', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}
