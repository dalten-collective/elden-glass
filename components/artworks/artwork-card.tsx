'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import * as HoverCard from '@radix-ui/react-hover-card';
import { duchampArtworks } from '@/lib/duchamp-artworks';
import type { DuchampArtwork } from '@/lib/duchamp-artworks';

interface ArtworkCardProps {
  artworkSlug: string;
  children: React.ReactNode;
}

export function ArtworkCard({ artworkSlug, children }: ArtworkCardProps) {
  const artwork = useMemo(() => {
    // Search through all periods to find the artwork
    for (const period of duchampArtworks) {
      const found = period.works.find((work) => {
        // Match by filename (without extension) or by slug-ified title
        const fileSlug = work.filename.replace(/\.(jpg|jpeg|png)$/i, '');
        const titleSlug = work.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return fileSlug === artworkSlug || titleSlug === artworkSlug;
      });
      if (found) {
        return found;
      }
    }
    return null;
  }, [artworkSlug]);

  if (!artwork) {
    return <span>{children}</span>;
  }

  const imagePath = `/images/duchamp/paintings/${artwork.filename}`;

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <span className="cursor-help">
          {children}
        </span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-[420px] p-0 shadow-2xl outline-none"
          sideOffset={5}
        >
          <div className="elden-card">
            {/* Header with artist name */}
            <div className="elden-card-header">
              <div className="text-[10px] uppercase tracking-[0.15em] text-amber-200/70 font-light">
                Marcel Duchamp
              </div>
            </div>

            {/* Artwork image */}
            <div className="px-5 pt-3">
              <div className="relative w-full aspect-[4/3] rounded border border-amber-200/20 overflow-hidden bg-black/20">
                <Image
                  src={imagePath}
                  alt={artwork.title}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Hide image on error
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Title and year */}
            <div className="px-5 py-3">
              <h3 className="text-base text-amber-100/95 font-semibold mb-1 leading-tight">
                {artwork.title}
              </h3>
              {artwork.year && (
                <p className="text-xs text-amber-100/50 italic leading-tight font-light">
                  {artwork.year}
                </p>
              )}
            </div>

            {/* Decorative bottom border */}
            <div className="elden-card-footer"></div>
          </div>

          <HoverCard.Arrow className="fill-[#1a1410]" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
