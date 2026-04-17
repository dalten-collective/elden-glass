'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, X } from 'lucide-react';

import type { DuchampArtwork } from '@/types/duchamp-artworks';

interface WorkDetailModalProps {
  artwork: DuchampArtwork | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MetadataRowProps {
  label: string;
  children: React.ReactNode;
}

/**
 * Renders a single metadata row when an artwork field is present.
 */
function MetadataRow({ label, children }: MetadataRowProps) {
  return (
    <div className="grid gap-2 border-b border-[var(--border-subtle)] py-3 sm:grid-cols-[9rem,1fr] sm:gap-4">
      <dt className="text-sm font-medium uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-[var(--text-secondary)]">{children}</dd>
    </div>
  );
}

/**
 * Displays a focus-trapped modal with the available metadata for one artwork.
 */
export function WorkDetailModal({ artwork, open, onOpenChange }: WorkDetailModalProps) {
  if (!artwork) {
    return null;
  }

  const imagePath = `/images/duchamp/paintings/${artwork.filename}`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-[rgba(0,0,0,0.78)] backdrop-blur-sm" />

        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[100] flex max-h-[90vh] w-[min(92vw,60rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[var(--border-emphasis)] bg-[var(--bg-secondary)] shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] px-6 py-5">
            <div className="space-y-1">
              <DialogPrimitive.Title className="font-serif text-2xl text-[var(--accent-gold)]">
                {artwork.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-[var(--text-tertiary)]">
                {artwork.year
                  ? `Artwork detail view for ${artwork.title} (${artwork.year}).`
                  : `Artwork detail view for ${artwork.title}.`}
              </DialogPrimitive.Description>
              {artwork.year && <p className="text-sm text-[var(--text-secondary)]">{artwork.year}</p>}
            </div>

            <DialogPrimitive.Close className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]">
              <X className="h-5 w-5" />
              <span className="sr-only">Close artwork details</span>
            </DialogPrimitive.Close>
          </div>

          <div className="overflow-y-auto px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
              <div className="relative min-h-[20rem] overflow-hidden rounded-xl bg-[var(--bg-primary)]">
                <Image
                  src={imagePath}
                  alt={artwork.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="flex flex-col">
                <dl>
                  {artwork.medium && <MetadataRow label="Medium">{artwork.medium}</MetadataRow>}
                  {artwork.dimensions && (
                    <MetadataRow label="Dimensions">{artwork.dimensions}</MetadataRow>
                  )}
                  {artwork.collection && (
                    <MetadataRow label="Collection">{artwork.collection}</MetadataRow>
                  )}
                  {artwork.currentLocation && (
                    <MetadataRow label="Location">{artwork.currentLocation}</MetadataRow>
                  )}
                  {artwork.sourceUrl && (
                    <MetadataRow label="Source">
                      <a
                        href={artwork.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[var(--accent-gold)] transition-colors hover:text-[var(--text-primary)] hover:underline"
                      >
                        View source
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </MetadataRow>
                  )}
                </dl>

                {artwork.note && (
                  <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4">
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                      Note
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {artwork.note}
                    </p>
                  </div>
                )}

                {artwork.articleSlug && (
                  <div className="mt-6">
                    <Link
                      href={`/${artwork.articleSlug}`}
                      className="inline-flex items-center gap-2 text-base font-medium text-[var(--accent-gold)] transition-colors hover:text-[var(--text-primary)] hover:underline"
                    >
                      Read full article →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
