'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, X } from 'lucide-react';

import type { DuchampArtwork } from '@/types/duchamp-artworks';

interface WorkDetailModalProps {
  artwork: DuchampArtwork | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MetaPairProps {
  label: string;
  children: React.ReactNode;
}

function MetaPair({ label, children }: MetaPairProps) {
  return (
    <div className="space-y-1">
      <dt className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-[var(--accent-gold)]">
        {label}
      </dt>
      <dd className="font-serif text-sm leading-relaxed text-[var(--text-primary)]">
        {children}
      </dd>
    </div>
  );
}

export function WorkDetailModal({ artwork, open, onOpenChange }: WorkDetailModalProps) {
  if (!artwork) {
    return null;
  }

  const imagePath = `/images/duchamp/paintings/${artwork.filename}`;

  const hasMeta =
    artwork.medium ||
    artwork.dimensions ||
    artwork.collection ||
    artwork.currentLocation ||
    artwork.sourceUrl;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-[rgba(0,0,0,0.82)] backdrop-blur-md" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[100] grid h-[min(85vh,44rem)] w-[min(96vw,64rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-sm border border-[rgb(201_169_97/0.2)] outline-none md:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)] md:grid-rows-1"
          style={{
            background: 'linear-gradient(135deg, #15120e 0%, #1c1813 50%, #15120e 100%)',
            boxShadow:
              '0 30px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,169,97,0.08), inset 0 1px 1px rgba(201,169,97,0.08)',
          }}
        >
          <DialogPrimitive.Close
            aria-label="Close artwork details"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[rgb(201_169_97/0.25)] bg-[rgba(10,8,6,0.75)] text-[var(--text-secondary)] backdrop-blur-sm transition-colors hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </DialogPrimitive.Close>

          <div
            className="relative flex min-h-0 items-center justify-center p-4 sm:p-6 md:p-8"
            style={{
              background:
                'radial-gradient(ellipse at center, #0d0b09 0%, #05040400 70%), linear-gradient(135deg, #0a0807 0%, #0f0c09 100%)',
              boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)',
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src={imagePath}
                alt={artwork.title}
                fill
                sizes="(max-width: 768px) 96vw, 55vw"
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                unoptimized
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-y-auto border-t border-[rgb(201_169_97/0.12)] md:border-l md:border-t-0">
            <div className="space-y-1.5 border-b border-[rgb(201_169_97/0.12)] px-6 pb-5 pt-6">
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--accent-gold)]">
                Marcel Duchamp
              </p>
              <DialogPrimitive.Title className="font-serif text-xl leading-tight text-[var(--text-primary)] sm:text-[1.45rem]">
                {artwork.title}
              </DialogPrimitive.Title>
              {artwork.year && (
                <p className="font-serif text-sm italic text-[var(--text-tertiary)]">
                  {artwork.year}
                </p>
              )}
            </div>

            {hasMeta && (
              <dl className="space-y-4 border-b border-[rgb(201_169_97/0.12)] px-6 py-5">
                {artwork.medium && <MetaPair label="Medium">{artwork.medium}</MetaPair>}
                {artwork.dimensions && (
                  <MetaPair label="Dimensions">{artwork.dimensions}</MetaPair>
                )}
                {artwork.collection && (
                  <MetaPair label="Collection">{artwork.collection}</MetaPair>
                )}
                {artwork.currentLocation && (
                  <MetaPair label="Location">{artwork.currentLocation}</MetaPair>
                )}
                {artwork.sourceUrl && (
                  <MetaPair label="Source">
                    <a
                      href={artwork.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--accent-gold)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      External record
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </MetaPair>
                )}
              </dl>
            )}

            {artwork.note && (
              <blockquote className="relative border-b border-[rgb(201_169_97/0.12)] px-6 py-5">
                <span
                  aria-hidden
                  className="absolute left-6 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-[var(--accent-gold)] opacity-60"
                />
                <p className="pl-4 font-serif text-sm italic leading-relaxed text-[var(--text-secondary)]">
                  {artwork.note}
                </p>
              </blockquote>
            )}

            {artwork.articleSlug && (
              <div className="mt-auto px-6 py-5">
                <Link
                  href={`/${artwork.articleSlug}` as never}
                  onClick={() => onOpenChange(false)}
                  className="group inline-flex w-full items-center justify-between gap-3 rounded-sm border border-[rgb(201_169_97/0.35)] bg-[rgba(201,169,97,0.04)] px-4 py-3 font-serif text-sm text-[var(--accent-gold)] transition-all hover:border-[var(--accent-gold)] hover:bg-[rgba(201,169,97,0.1)] hover:text-[var(--text-primary)]"
                >
                  <span>Read full article</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
