'use client';

import { useState } from 'react';
import Image from 'next/image';

import { DuchampWorkTile } from '@/components/duchamp-works/duchamp-work-tile';
import { WorkDetailModal } from '@/components/duchamp-works/work-detail-modal';
import { duchampArtworks } from '@/lib/duchamp-artworks';
import type { DuchampArtwork } from '@/types/duchamp-artworks';

interface HoveredWork {
  title: string;
  year?: string;
  imagePath: string;
}

/**
 * Preview-only gallery implementation for Duchamp works.
 */
export default function DuchampWorksPreviewPage() {
  const [hoveredWork, setHoveredWork] = useState<HoveredWork | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedArtwork, setSelectedArtwork] = useState<DuchampArtwork | null>(null);

  const handleHoverStart = (artwork: DuchampArtwork) => {
    setHoveredWork({
      title: artwork.title,
      year: artwork.year,
      imagePath: `/images/duchamp/paintings/${artwork.filename}`,
    });
  };

  const handleHoverMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleHoverEnd = () => {
    setHoveredWork(null);
  };

  const handleSelect = (artwork: DuchampArtwork) => {
    setHoveredWork(null);
    setSelectedArtwork(artwork);
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
            Preview Path
          </p>
          <h1 className="mb-4 font-serif text-4xl text-[var(--accent-gold)]">
            Duchamp&apos;s Works
          </h1>
          <p className="leading-relaxed text-[var(--text-secondary)]">
            A gallery-first preview of Marcel Duchamp&apos;s works. Hover a tile to inspect the
            floating image preview, then click through for the full record.
          </p>
        </div>

        <div className="space-y-14">
          {duchampArtworks.map((period) => (
            <section key={period.title} className="space-y-5">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <h2 className="font-serif text-2xl text-[var(--accent-gold)]">
                  {period.title}{' '}
                  <span className="text-lg text-[var(--text-tertiary)]">({period.years})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {period.works.map((artwork) => (
                  <DuchampWorkTile
                    key={artwork.filename}
                    artwork={artwork}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    onHoverMove={handleHoverMove}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {hoveredWork && (
        <div
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: `${mousePosition.x + 20}px`,
            top: `${mousePosition.y - 150}px`,
          }}
        >
          <div className="max-w-[350px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 shadow-2xl">
            <div className="relative h-[300px] w-full">
              <Image
                src={hoveredWork.imagePath}
                alt={hoveredWork.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="mt-2 text-center text-[0.7rem] text-[var(--text-tertiary)]">
              {hoveredWork.title} {hoveredWork.year && `(${hoveredWork.year})`}
            </p>
          </div>
        </div>
      )}

      <WorkDetailModal
        artwork={selectedArtwork}
        open={selectedArtwork !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedArtwork(null);
          }
        }}
      />
    </>
  );
}
