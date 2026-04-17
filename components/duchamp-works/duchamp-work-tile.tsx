'use client';

import Image from 'next/image';

import type { DuchampArtwork } from '@/types/duchamp-artworks';

interface DuchampWorkTileProps {
  artwork: DuchampArtwork;
  onSelect: (artwork: DuchampArtwork) => void;
}

export function DuchampWorkTile({ artwork, onSelect }: DuchampWorkTileProps) {
  const imagePath = `/images/duchamp/paintings/${artwork.filename}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(artwork)}
      className="group flex flex-col gap-3 text-left focus-visible:outline-none"
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-sm ring-1 ring-[rgb(201_169_97/0.12)] transition-[box-shadow,transform,ring-color] duration-500 ease-out group-hover:-translate-y-0.5 group-hover:ring-[rgb(201_169_97/0.55)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--accent-gold)]"
        style={{
          background: 'linear-gradient(135deg, #12100d 0%, #1a1511 50%, #12100d 100%)',
          boxShadow:
            '0 0 24px rgba(0,0,0,0.65), inset 0 1px 1px rgba(201,169,97,0.08), inset 0 -1px 1px rgba(0,0,0,0.4)',
        }}
      >
        <Image
          src={imagePath}
          alt={artwork.title}
          fill
          sizes="(max-width: 640px) 45vw, 30vw"
          className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          unoptimized
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(201,169,97,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="space-y-0.5 px-1">
        <h3 className="font-serif text-sm leading-snug text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--accent-gold)]">
          {artwork.title}
        </h3>
        {artwork.year && (
          <p className="font-serif text-xs italic text-[var(--text-tertiary)]">{artwork.year}</p>
        )}
      </div>
    </button>
  );
}
