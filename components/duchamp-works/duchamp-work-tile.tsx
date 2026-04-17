'use client';

import Image from 'next/image';

import type { DuchampArtwork } from '@/types/duchamp-artworks';

interface DuchampWorkTileProps {
  artwork: DuchampArtwork;
  onHoverStart: (artwork: DuchampArtwork) => void;
  onHoverEnd: () => void;
  onHoverMove: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSelect: (artwork: DuchampArtwork) => void;
}

/**
 * Displays a single Duchamp artwork as a thumbnail-first gallery tile.
 */
export function DuchampWorkTile({
  artwork,
  onHoverStart,
  onHoverEnd,
  onHoverMove,
  onSelect,
}: DuchampWorkTileProps) {
  const imagePath = `/images/duchamp/paintings/${artwork.filename}`;

  return (
    <button
      type="button"
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-gold)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
      onMouseEnter={() => onHoverStart(artwork)}
      onMouseLeave={onHoverEnd}
      onMouseMove={onHoverMove}
      onClick={() => onSelect(artwork)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-primary)]">
        <Image
          src={imagePath}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-lg text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-gold)]">
          {artwork.title}
        </h3>
        {artwork.year && <p className="text-sm text-[var(--text-tertiary)]">{artwork.year}</p>}
      </div>
    </button>
  );
}
