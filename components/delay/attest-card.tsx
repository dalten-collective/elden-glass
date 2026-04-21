/**
 * AttestCard — the sealed-document card.
 *
 * Three-column machined object: [seal][body][status-tick]. The body
 * shows chain / sha-256 header, title, hash (with the leading nibble
 * bolded in gold), and sealed-date/block meta. A perforation runs
 * between seal and body (see globals.css `.attest::before`).
 *
 *   <AttestCard
 *     chain="ethereum · eas"
 *     title="Initial Thesis"
 *     hashHi="0xdce7e265a647611bca0ff61c"
 *     hashLo="c832d3e1f522f78e003a86d3f4f72a66ec78842c"
 *     sealed="17 · nov · 2025"
 *     block="21,304,118"
 *     sigil="eth"
 *   />
 *
 * On mobile (see the media query in globals.css) the card recomposes
 * vertically: seal on top, body in the middle, tick as a full-width slug.
 */

import type { ReactNode } from 'react';

import { BtcSeal, EthSeal, VerifiedTick } from './seal';

type Sigil = 'eth' | 'btc';

type AttestCardProps = {
  chain: ReactNode;
  title: ReactNode;
  hashHi: string;
  hashLo: string;
  sealed?: ReactNode;
  block?: ReactNode;
  status?: ReactNode;
  sigil?: Sigil;
  sealLabel?: ReactNode;
  className?: string;
};

export function AttestCard({
  chain,
  title,
  hashHi,
  hashLo,
  sealed,
  block,
  status = 'verified',
  sigil = 'eth',
  sealLabel = 'sealed',
  className,
}: AttestCardProps) {
  const SigilSvg = sigil === 'btc' ? BtcSeal : EthSeal;
  return (
    <div className={['attest', className].filter(Boolean).join(' ')}>
      <div className="seal">
        <SigilSvg size={44} />
        <div className="seal-label">{sealLabel}</div>
      </div>
      <div className="att-body">
        <div className="att-head">
          <span className="chain">{chain}</span>
          <span>· sha-256 ·</span>
        </div>
        <div className="att-title">{title}</div>
        <div className="att-hash">
          <b>{hashHi}</b>
          {hashLo}
        </div>
        {(sealed || block) && (
          <div className="att-meta">
            {sealed && (
              <span>
                <span className="k">sealed</span>
                {sealed}
              </span>
            )}
            {block && (
              <span>
                <span className="k">block</span>
                {block}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="att-tick">
        <VerifiedTick size={18} />
        <span className="status">{status}</span>
      </div>
    </div>
  );
}
