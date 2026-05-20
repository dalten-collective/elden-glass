'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import type { DuchampArtwork } from '@/types/duchamp-artworks';

interface DuchampWorkTileProps {
  artwork: DuchampArtwork;
  onSelect: (artwork: DuchampArtwork) => void;
}

export function DuchampWorkTile({ artwork, onSelect }: DuchampWorkTileProps) {
  const imagePath = getDuchampArtworkImage(artwork);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imagePath]);

  return (
    <button
      type="button"
      onClick={() => onSelect(artwork)}
      className="group flex cursor-pointer flex-col gap-3 text-left focus-visible:outline-none"
    >
      <div className="pane pane--solid relative aspect-[3/4] cursor-pointer overflow-hidden rounded-sm bg-[linear-gradient(135deg,var(--ink-2)_0%,var(--ink-3)_50%,var(--ink-2)_100%)] ring-1 ring-[color-mix(in_srgb,var(--gold)_12%,transparent)] transition-[box-shadow,transform,ring-color] duration-500 ease-out group-hover:-translate-y-0.5 group-hover:ring-[color-mix(in_srgb,var(--gold)_55%,transparent)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--gold)]">
        {imagePath && !imageFailed ? (
          <Image
            src={imagePath}
            alt={artwork.title}
            fill
            sizes="(max-width: 640px) 45vw, 30vw"
            className="cursor-pointer object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            unoptimized={imagePath.startsWith('/')}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center font-serif text-sm italic text-[var(--paper-dimmer)]">
            Image not available
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--gold)_8%,transparent)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="space-y-0.5 px-1">
        <h3 className="font-serif text-sm leading-snug text-[var(--paper)] transition-colors duration-300 group-hover:text-[var(--gold)]">
          {artwork.title}
        </h3>
        {artwork.artwork.year && (
          <p className="font-serif text-xs italic text-[var(--paper-dimmer)]">
            {artwork.artwork.year}
          </p>
        )}
      </div>
    </button>
  );
}

function getDuchampArtworkImage(artwork: DuchampArtwork): string | null {
  return (
    artwork.image ??
    (artwork.artwork.filename ? `/images/duchamp/paintings/${artwork.artwork.filename}` : null)
  );
}
