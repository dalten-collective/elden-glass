'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ExternalLink, X } from 'lucide-react';
import * as React from 'react';

const BAYER_4: ReadonlyArray<ReadonlyArray<number>> = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const DISC_R_MAX = 50;
const DISC_R_BRIGHT_END = 32;
const DISC_R_SOLID_END = 36;
const CELL_SIZE = 2;

type CellPhase = 'bright' | 'dark';

type Cell = {
  x: number;
  y: number;
  phase: CellPhase;
};

function computeDiscCells(): Cell[] {
  const cells: Cell[] = [];

  for (let y = -DISC_R_MAX; y < DISC_R_MAX; y += CELL_SIZE) {
    for (let x = -DISC_R_MAX; x < DISC_R_MAX; x += CELL_SIZE) {
      const cx = x + CELL_SIZE / 2;
      const cy = y + CELL_SIZE / 2;
      const dist = Math.hypot(cx, cy);
      if (dist > DISC_R_MAX) continue;

      const bayerX = Math.floor((x + DISC_R_MAX) / CELL_SIZE) % 4;
      const bayerY = Math.floor((y + DISC_R_MAX) / CELL_SIZE) % 4;
      const threshold = BAYER_4[bayerY][bayerX] / 16;
      let phase: CellPhase | null = null;

      if (dist < DISC_R_BRIGHT_END) {
        const intensity = 1 - dist / DISC_R_BRIGHT_END;
        phase = threshold < intensity ? 'bright' : 'dark';
      } else if (dist < DISC_R_SOLID_END) {
        phase = 'dark';
      } else {
        const intensity = 1 - (dist - DISC_R_SOLID_END) / (DISC_R_MAX - DISC_R_SOLID_END);
        if (threshold < intensity) phase = 'dark';
      }

      if (phase) cells.push({ x, y, phase });
    }
  }

  return cells;
}

const DISC_CELLS = computeDiscCells();

/**
 * A retinted Martian Engineering orbit mark adapted for the Elden Glass palette.
 */
function MartianOrbitMark() {
  const rawId = React.useId();
  const id = rawId.replace(/:/g, '');
  const ids = {
    trailPhobos: `${id}-tp`,
    trailDeimos: `${id}-td`,
  };

  return (
    <svg
      className="block h-9 w-9 overflow-visible"
      viewBox="-50 -50 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={ids.trailPhobos}
          gradientUnits="userSpaceOnUse"
          x1="25"
          y1="0"
          x2="0"
          y2="-25"
        >
          <stop offset="0%" stopColor="var(--gold-bright)" stopOpacity="0.82" />
          <stop offset="100%" stopColor="var(--gold-bright)" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={ids.trailDeimos}
          gradientUnits="userSpaceOnUse"
          x1="40"
          y1="0"
          x2="0"
          y2="-40"
        >
          <stop offset="0%" stopColor="var(--paper-dim)" stopOpacity="0.68" />
          <stop offset="100%" stopColor="var(--paper-dim)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g shapeRendering="crispEdges">
        {DISC_CELLS.map((cell, index) => (
          <rect
            key={index}
            x={cell.x}
            y={cell.y}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={cell.phase === 'bright' ? 'var(--pane)' : 'var(--ink)'}
          />
        ))}
      </g>

      <text
        x="0"
        y="-3"
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none fill-[var(--gold)] font-mono text-[36px] font-bold"
      >
        m
      </text>

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 0 0"
          to="360 0 0"
          dur="5s"
          repeatCount="indefinite"
        />
        <path
          d="M 25 0 A 25 25 0 0 0 0 -25"
          fill="none"
          stroke={`url(#${ids.trailPhobos})`}
          strokeLinecap="round"
          strokeWidth="1.6"
        />
        <rect x="23" y="-2" width="4" height="4" fill="var(--gold-bright)" />
      </g>

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 0 0"
          to="360 0 0"
          dur="10s"
          repeatCount="indefinite"
        />
        <path
          d="M 40 0 A 40 40 0 0 0 0 -40"
          fill="none"
          stroke={`url(#${ids.trailDeimos})`}
          strokeLinecap="round"
          strokeWidth="1.4"
        />
        <g transform="translate(40, 0)">
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="-360 0 0"
              dur="10s"
              repeatCount="indefinite"
            />
            <text
              x="0"
              y="-2"
              textAnchor="middle"
              dominantBaseline="central"
              className="select-none fill-[var(--paper-dim)] font-mono text-[22px] font-medium"
            >
              e
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}

/**
 * Coy author-page attribution for the Martian Engineering site build.
 */
export function MartianCredit() {
  return (
    <Dialog.Root>
      <div className="not-prose mt-16 flex justify-end border-t border-[var(--crack)] pt-6">
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-sm border border-[var(--glass-edge)] bg-[rgb(var(--bg-secondary-rgb)/0.45)] px-2.5 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--paper-dimmer)] opacity-75 transition hover:border-[var(--gold-dim)] hover:text-[var(--paper-dim)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-dim)]"
            aria-label="About the Martian Engineering build"
          >
            <MartianOrbitMark />
            <span className="leading-tight">
              quietly powered by
              <span className="block text-[var(--gold)]">Martian.Engineering</span>
            </span>
          </button>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-[rgba(0,0,0,0.78)] backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[100] w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[var(--gold-dim)] bg-[var(--ink-2)] shadow-panel outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--pane-edge)] bg-[var(--pane)] px-5 py-4">
            <Dialog.Title className="font-serif text-2xl leading-none text-[var(--gold)]">
              A small Martian machine
            </Dialog.Title>
            <Dialog.Close className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-emphasis)] bg-[rgb(var(--bg-primary-rgb)/0.75)] text-[var(--paper-dim)] transition hover:text-[var(--gold-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-dim)]">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <div className="space-y-4 px-5 py-5 font-serif text-[17px] leading-relaxed text-[var(--paper-dim)]">
            <p>
              Martian Engineering built this site pro bono because the argument was too strange, too
              specific, and too alive to leave in a pile of notes.
            </p>
            <p>
              The site is a custom Next.js instrument: authored MDX drives the content tree,
              navigation, contents, sitemap, and LLM surfaces; structured item cards power the
              Gatherer and the Duchamp works view; MiniSearch indexes prose and cards through one
              local search layer; result links land on addressable prose blocks instead of vague
              pages.
            </p>
            <p>
              The attestation pieces, fedwiki import/export scripts, local manuscript checks, and
              quiet little search behaviors are all part of the same idea: make the scholarship feel
              like a working apparatus, not a brochure.
            </p>
            <p>
              The mark is a machine too: a Bayer-dithered planet with an <code>m</code> at center, a
              quick dot, and a slower <code>e</code> orbiting back into alignment.
            </p>
            <div className="border-t border-[var(--pane-edge)] pt-4">
              <a
                href="https://martian.engineering"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--gold)] no-underline transition hover:text-[var(--gold-bright)]"
              >
                martian.engineering
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
