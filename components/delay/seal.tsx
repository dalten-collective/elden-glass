/**
 * Seal — the attestation sigils.
 *
 * Two small SVG seals used by AttestCard and the stair seal:
 *   • EthSeal — concentric circles with a dashed ring (default).
 *   • BtcSeal — orthogonal rungs suggesting the Bitcoin sigil.
 *
 * Both scale from their `size` prop; stroke widths stay in absolute
 * units of the 44×44 internal viewBox.
 */

type SealProps = {
  size?: number;
  className?: string;
};

export function EthSeal({ size = 44, className }: SealProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className={className} aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="none" stroke="var(--gold-dim)" strokeWidth="1" />
      <circle
        cx="22"
        cy="22"
        r="14"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <circle cx="22" cy="22" r="3" fill="var(--gold)" />
      <path
        d="M 22 5 L 22 2 M 22 42 L 22 39 M 5 22 L 2 22 M 42 22 L 39 22"
        stroke="var(--gold-dim)"
        strokeWidth="1"
      />
    </svg>
  );
}

export function BtcSeal({ size = 44, className }: SealProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className={className} aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="none" stroke="var(--gold-dim)" strokeWidth="1" />
      <path
        d="M 22 8 L 22 36 M 14 14 L 30 14 M 14 22 L 30 22 M 14 30 L 30 30"
        stroke="var(--gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The verdigris verified tick shown in the att-tick region of AttestCard. */
export function VerifiedTick({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.5" stroke="var(--verdigris)" strokeWidth="1" />
      <path
        d="M5.5 9.2 L7.8 11.5 L12.5 6.8"
        stroke="var(--verdigris)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
