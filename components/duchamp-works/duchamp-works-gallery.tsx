'use client';

import { useState } from 'react';

import { DuchampWorkTile } from '@/components/duchamp-works/duchamp-work-tile';
import { WorkDetailModal } from '@/components/duchamp-works/work-detail-modal';
import type { DuchampArtwork, DuchampPeriod } from '@/types/duchamp-artworks';

interface DuchampWorksGalleryProps {
  periods: DuchampPeriod[];
}

/**
 * Client-side interaction shell for the Duchamp Works item-card gallery.
 */
export function DuchampWorksGallery({ periods }: DuchampWorksGalleryProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<DuchampArtwork | null>(null);

  return (
    <>
      <div className="space-y-16 sm:space-y-20">
        {periods.map((period) => (
          <section key={period.title} aria-labelledby={slugify(period.title)}>
            <header className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[rgb(201_169_97/0.18)] pb-4">
              <h2
                id={slugify(period.title)}
                className="font-serif text-xl leading-tight text-[var(--text-primary)] sm:text-2xl"
              >
                {period.title}
              </h2>
              {period.years && (
                <p className="font-serif text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)] sm:text-sm">
                  {period.years}
                </p>
              )}
            </header>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10">
              {period.works.map((artwork) => (
                <DuchampWorkTile key={artwork.id} artwork={artwork} onSelect={setSelectedArtwork} />
              ))}
            </div>
          </section>
        ))}
      </div>

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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
