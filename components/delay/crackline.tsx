/**
 * Crackline — a real SVG shard with three branches and micro-dust.
 *
 * Seeded per page/section: the same `seed` always yields the same crack,
 * so every § has its own stable ornament but no two sections share a crack.
 * The hash + rng implementation mirrors the design-spec primitive.
 *
 * Usage:
 *   <Crackline seed="tldr-top" />
 *   <Crackline seed="iii-pataphysics" tone="gold" />
 */

type CracklineProps = {
  seed?: string;
  tone?: 'neutral' | 'gold';
  width?: number;
  height?: number;
  className?: string;
};

// FNV-1a — deterministic, cheap, good enough to salt a small RNG.
function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// mulberry32 — tiny seeded PRNG, plenty for a decorative 16-segment polyline.
function makeRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function Crackline({
  seed = 'default',
  tone = 'neutral',
  width = 1200,
  height = 22,
  className,
}: CracklineProps) {
  const r = makeRng(hashSeed(seed));
  const W = width;
  const H = height;
  const baselineY = H * 0.5;

  // Main crack: 17-point polyline with sub-pixel y-jitter. A crack, not a
  // mountain range — keep deviations tiny.
  const N = 16;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= N; i += 1) {
    const x = (i / N) * W;
    const jitter = (r() - 0.5) * 1.6;
    pts.push([x, baselineY + jitter]);
  }

  // Three branches depart the main line at pseudo-random (non-adjacent)
  // segment indexes. Each branch is itself a short jagged polyline angling
  // 20–55° off horizontal, up or down at random.
  const branches: Array<Array<[number, number]>> = [];
  const used = new Set<number>();
  for (let b = 0; b < 3; b += 1) {
    let idx: number;
    do {
      idx = 2 + Math.floor(r() * (N - 4));
    } while (used.has(idx));
    used.add(idx);
    used.add(idx + 1);
    used.add(idx - 1);

    const [ox, oy] = pts[idx];
    const dir = r() < 0.5 ? -1 : 1;
    const angle = (20 + r() * 35) * (Math.PI / 180);
    const len = 8 + r() * 18;
    const segs = 3 + Math.floor(r() * 2);

    const branchPts: Array<[number, number]> = [[ox, oy]];
    for (let s = 1; s <= segs; s += 1) {
      const t = s / segs;
      const bx = ox + Math.cos(angle) * len * t * (r() < 0.5 ? 1 : -1);
      const by = oy + dir * Math.sin(angle) * len * t + (r() - 0.5) * 1.4;
      branchPts.push([bx, by]);
    }
    branches.push(branchPts);
  }

  // Dust alongside the main line — particulates caught in the crack.
  const dots: Array<[number, number, number]> = [];
  const dotCount = 4 + Math.floor(r() * 4);
  for (let i = 0; i < dotCount; i += 1) {
    const x = W * (0.1 + r() * 0.8);
    const y = baselineY + (r() - 0.5) * 4;
    dots.push([x, y, 0.5 + r() * 0.7]);
  }

  const stroke = tone === 'gold' ? 'var(--gold)' : 'var(--crack-strong)';
  const strokeDim = tone === 'gold' ? 'var(--gold-dim)' : 'var(--crack)';

  const poly = (arr: Array<[number, number]>) =>
    arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <svg
      className={['crackline-svg', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      width="100%"
      height={H}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* faded halo — the ghost of the crack */}
      <polyline
        points={poly(pts)}
        fill="none"
        stroke={strokeDim}
        strokeWidth="3"
        opacity="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* main line */}
      <polyline
        points={poly(pts)}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {branches.map((bp, i) => (
        <polyline
          key={i}
          points={poly(bp)}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7 + i * 0.1}
        />
      ))}
      {dots.map(([x, y, rr], i) => (
        <circle key={i} cx={x} cy={y} r={rr} fill={stroke} opacity="0.55" />
      ))}
    </svg>
  );
}
