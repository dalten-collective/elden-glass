/**
 * DropCap — a drop cap that is itself a readymade.
 *
 * An SVG glyph with:
 *   • ruled baseline + x-height line + cap-height ticks — the apparatus
 *     of the letter, borrowed from typographic drawing practice.
 *   • a registration mark in the corner (the printer's mark).
 *   • a small "PLATE · nn" stamp bottom-right.
 *
 * Host paragraph must carry `class="lead has-dropcap"` (see globals.css —
 * the `has-dropcap` class suppresses the CSS `::first-letter` drop cap
 * that would otherwise render a second, overlapping glyph).
 */

type DropCapProps = {
  letter?: string;
  plate?: string;
  color?: string;
};

export function DropCap({ letter = 'I', plate = '01', color = 'var(--gold)' }: DropCapProps) {
  return (
    <span className="dropcap-wrap" aria-hidden={false}>
      <svg viewBox="0 0 110 120" width={110} height={120} className="dropcap-svg">
        {/* rulings — the apparatus of the letter */}
        <line
          x1="0"
          y1="12"
          x2="110"
          y2="12"
          stroke="var(--crack)"
          strokeWidth="0.6"
          strokeDasharray="2 3"
        />
        <line x1="0" y1="100" x2="110" y2="100" stroke="var(--crack-strong)" strokeWidth="0.6" />
        <line
          x1="0"
          y1="48"
          x2="110"
          y2="48"
          stroke="var(--crack)"
          strokeWidth="0.4"
          strokeDasharray="1 3"
        />
        <line x1="0" y1="22" x2="8" y2="22" stroke="var(--gold-dim)" strokeWidth="0.8" />
        <line x1="102" y1="22" x2="110" y2="22" stroke="var(--gold-dim)" strokeWidth="0.8" />

        {/* the glyph — EB Garamond italic; baseline y=100, cap-height y=22 */}
        <text
          x="55"
          y="100"
          textAnchor="middle"
          fontFamily="var(--font-serif)"
          fontSize="110"
          fontWeight="500"
          fill={color}
          style={{ fontStyle: 'italic' }}
        >
          {letter}
        </text>

        {/* plate-number stamp */}
        <text
          x="108"
          y="117"
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="6.5"
          fill="var(--paper-dimmer)"
          letterSpacing="0.18em"
        >
          PLATE · {plate}
        </text>

        {/* registration mark — the printer's cross */}
        <g transform="translate(3 3)">
          <circle cx="3" cy="3" r="2.2" fill="none" stroke="var(--gold-dim)" strokeWidth="0.5" />
          <line x1="0" y1="3" x2="6" y2="3" stroke="var(--gold-dim)" strokeWidth="0.4" />
          <line x1="3" y1="0" x2="3" y2="6" stroke="var(--gold-dim)" strokeWidth="0.4" />
        </g>
      </svg>
    </span>
  );
}
