'use client';

import { useState } from 'react';
import Image from 'next/image';
import { duchampArtworks } from '@/lib/duchamp-artworks';

export default function DuchampWorksPage() {
  const [hoveredWork, setHoveredWork] = useState<{ title: string; year?: string; imagePath: string } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-[var(--accent-gold)] mb-4">Duchamp&apos;s Works</h1>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          A comprehensive collection of Marcel Duchamp&apos;s artworks from 1901 to 1968, organized chronologically by period.
          Hover over any title to preview the artwork.
        </p>
      </div>

      <div className="space-y-12">
        {duchampArtworks.map((period) => (
          <div key={period.title} className="space-y-4">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] border-b border-[var(--border-subtle)] pb-2">
              {period.title} {period.years && <span className="text-lg text-[var(--text-tertiary)]">({period.years})</span>}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {period.works.map((work) => (
                <div
                  key={work.filename}
                  className="p-4 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-gold)] transition-colors cursor-default bg-[var(--bg-secondary)]"
                  onMouseEnter={() => setHoveredWork({
                    title: work.title,
                    year: work.year,
                    imagePath: `/images/duchamp/paintings/${work.filename}`
                  })}
                  onMouseLeave={() => setHoveredWork(null)}
                  onMouseMove={handleMouseMove}
                >
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">{work.title}</h3>
                  {work.year && (
                    <p className="text-sm text-[var(--text-tertiary)]">{work.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating image preview */}
      {hoveredWork && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${mousePosition.x + 20}px`,
            top: `${mousePosition.y - 150}px`,
          }}
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg shadow-2xl p-2 max-w-[350px]">
            <div className="relative w-full h-[300px]">
              <Image
                src={hoveredWork.imagePath}
                alt={hoveredWork.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-[0.7rem] text-[var(--text-tertiary)] mt-2 text-center">
              {hoveredWork.title} {hoveredWork.year && `(${hoveredWork.year})`}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
