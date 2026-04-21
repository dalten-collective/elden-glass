'use client';

/**
 * ArtworkCard — hover-card lookup for a Duchamp work referenced in prose.
 *
 * Rendered in the Delay-in-Glass voice: a solid pane with an eyebrow
 * "Marcel Duchamp" label, the plate image framed in a thin pane-edge,
 * the title in italic serif, and a thin gold-dim rule at the bottom.
 */

import { useMemo } from 'react';
import Image from 'next/image';
import * as HoverCard from '@radix-ui/react-hover-card';

import { duchampArtworks } from '@/lib/duchamp-artworks';

interface ArtworkCardProps {
  artworkSlug: string;
  children: React.ReactNode;
}

export function ArtworkCard({ artworkSlug, children }: ArtworkCardProps) {
  const artwork = useMemo(() => {
    for (const period of duchampArtworks) {
      const found = period.works.find((work) => {
        const fileSlug = work.filename.replace(/\.(jpg|jpeg|png)$/i, '');
        const titleSlug = work.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return fileSlug === artworkSlug || titleSlug === artworkSlug;
      });
      if (found) return found;
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
        <span className="cursor-help">{children}</span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-[420px] p-0 shadow-2xl outline-none"
          sideOffset={5}
        >
          <div className="pane--solid" style={{ position: 'relative' }}>
            <div
              style={{
                padding: '14px 20px 10px',
                borderBottom: '1px solid var(--pane-edge)',
              }}
            >
              <span
                className="eyebrow eyebrow--gold"
                style={{ fontSize: 10, letterSpacing: '0.2em' }}
              >
                Marcel Duchamp
              </span>
            </div>

            <div style={{ padding: '14px 20px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  border: '1px solid var(--pane-edge)',
                  background: 'var(--ink)',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={imagePath}
                  alt={artwork.title}
                  fill
                  sizes="420px"
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div
              style={{
                padding: '6px 20px 14px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: 'var(--paper)',
                  lineHeight: 1.25,
                  margin: 0,
                }}
              >
                {artwork.title}
              </h3>
              {artwork.year && (
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--paper-dimmer)',
                    letterSpacing: '0.1em',
                    marginTop: 6,
                  }}
                >
                  {artwork.year}
                </p>
              )}
            </div>

            <div
              style={{
                height: 1,
                background:
                  'linear-gradient(90deg, transparent, var(--gold-dim) 20%, var(--gold) 50%, var(--gold-dim) 80%, transparent)',
              }}
            />
          </div>

          <HoverCard.Arrow style={{ fill: 'var(--ink-2)' }} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
