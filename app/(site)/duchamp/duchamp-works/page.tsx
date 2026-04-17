'use client';

import { useState } from 'react';

import { DuchampWorkTile } from '@/components/duchamp-works/duchamp-work-tile';
import { WorkDetailModal } from '@/components/duchamp-works/work-detail-modal';
import { duchampArtworks } from '@/lib/duchamp-artworks';
import type { DuchampArtwork } from '@/types/duchamp-artworks';

export default function DuchampWorksPreviewPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<DuchampArtwork | null>(null);

  return (
    <>
      <header className="mb-12 border-b border-[rgb(201_169_97/0.2)] pb-8">
        <p className="mb-3 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--accent-gold)] sm:text-xs">
          Catalogue raisonné
        </p>
        <h1 className="mb-4 font-serif text-3xl leading-[1.08] text-[var(--text-primary)] sm:text-4xl lg:text-[2.75rem]">
          Duchamp&apos;s Works
        </h1>
        <p className="max-w-2xl font-serif text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          A chronological gallery of Marcel Duchamp&apos;s production — from the early Blainville
          paintings through the readymades, the Large Glass, and the late objects. Click any work
          for its full record.
        </p>
      </header>

      <div className="space-y-16 sm:space-y-20">
        {duchampArtworks.map((period) => (
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
                <DuchampWorkTile
                  key={artwork.filename}
                  artwork={artwork}
                  onSelect={setSelectedArtwork}
                />
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
