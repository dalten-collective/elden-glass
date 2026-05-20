'use client';

import { useEffect, useState } from 'react';
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
      <dt className="eyebrow eyebrow--gold">{label}</dt>
      <dd className="font-serif text-sm leading-relaxed text-[var(--paper)]">{children}</dd>
    </div>
  );
}

export function WorkDetailModal({ artwork, open, onOpenChange }: WorkDetailModalProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [artwork?.id]);

  if (!artwork) {
    return null;
  }

  const imagePath = getDuchampArtworkImage(artwork);

  const hasMeta =
    artwork.artwork.medium ||
    artwork.artwork.dimensions ||
    artwork.artwork.collection ||
    artwork.artwork.currentLocation ||
    artwork.artwork.sourceUrl;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-[color-mix(in_srgb,var(--ink)_82%,transparent)] backdrop-blur-md" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[100] grid h-[min(85vh,44rem)] w-[min(96vw,64rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--gold)_20%,var(--pane-edge))] bg-[linear-gradient(135deg,var(--ink-2)_0%,var(--ink-3)_50%,var(--ink-2)_100%)] shadow-2xl outline-none md:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)] md:grid-rows-1"
        >
          <DialogPrimitive.Close
            aria-label="Close artwork details"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--gold)_25%,transparent)] bg-[color-mix(in_srgb,var(--ink)_75%,transparent)] text-[var(--paper-dim)] backdrop-blur-sm transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </DialogPrimitive.Close>

          <div className="relative flex min-h-0 items-center justify-center bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--ink-3)_80%,var(--ink))_0%,transparent_70%),linear-gradient(135deg,var(--ink)_0%,var(--ink-2)_100%)] p-4 shadow-inner sm:p-6 md:p-8">
            {imagePath && !imageFailed ? (
              <div className="relative h-full w-full">
                <Image
                  src={imagePath}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 768px) 96vw, 55vw"
                  className="object-contain drop-shadow-2xl"
                  unoptimized={imagePath.startsWith('/')}
                  onError={() => setImageFailed(true)}
                />
              </div>
            ) : (
              <p className="font-serif text-base italic text-[var(--paper-dimmer)]">
                Image not available
              </p>
            )}
          </div>

          <div className="flex min-h-0 flex-col overflow-y-auto border-t border-[var(--pane-edge)] md:border-l md:border-t-0">
            <div className="space-y-1.5 border-b border-[var(--pane-edge)] px-6 pb-5 pt-6">
              <p className="eyebrow eyebrow--gold">Marcel Duchamp</p>
              <DialogPrimitive.Title className="font-serif text-xl leading-tight text-[var(--paper)] sm:text-[1.45rem]">
                {artwork.title}
              </DialogPrimitive.Title>
              {artwork.artwork.year && (
                <p className="font-serif text-sm italic text-[var(--paper-dimmer)]">
                  {artwork.artwork.year}
                </p>
              )}
            </div>

            {hasMeta && (
              <dl className="space-y-4 border-b border-[var(--pane-edge)] px-6 py-5">
                {artwork.artwork.medium && (
                  <MetaPair label="Medium">{artwork.artwork.medium}</MetaPair>
                )}
                {artwork.artwork.dimensions && (
                  <MetaPair label="Dimensions">{artwork.artwork.dimensions}</MetaPair>
                )}
                {artwork.artwork.collection && (
                  <MetaPair label="Collection">{artwork.artwork.collection}</MetaPair>
                )}
                {artwork.artwork.currentLocation && (
                  <MetaPair label="Location">{artwork.artwork.currentLocation}</MetaPair>
                )}
                {artwork.artwork.sourceUrl && (
                  <MetaPair label="Source">
                    <a
                      href={artwork.artwork.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dig-link inline-flex items-center gap-1.5 transition-colors hover:text-[var(--paper)]"
                    >
                      External record
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </MetaPair>
                )}
              </dl>
            )}

            {artwork.description && (
              <blockquote className="relative border-b border-[var(--pane-edge)] px-6 py-5">
                <span
                  aria-hidden
                  className="absolute left-6 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-[var(--gold)] opacity-60"
                />
                <p className="pl-4 font-serif text-sm italic leading-relaxed text-[var(--paper-dim)]">
                  {artwork.description}
                </p>
              </blockquote>
            )}

            {artwork.artwork.articleSlug && (
              <div className="mt-auto px-6 py-5">
                <Link
                  href={`/${artwork.artwork.articleSlug}` as never}
                  onClick={() => onOpenChange(false)}
                  className="group inline-flex w-full items-center justify-between gap-3 rounded-sm border border-[color-mix(in_srgb,var(--gold)_35%,transparent)] bg-[color-mix(in_srgb,var(--gold)_4%,transparent)] px-4 py-3 font-serif text-sm text-[var(--gold)] transition-all hover:border-[var(--gold)] hover:bg-[color-mix(in_srgb,var(--gold)_10%,transparent)] hover:text-[var(--paper)]"
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

function getDuchampArtworkImage(artwork: DuchampArtwork): string | null {
  return (
    artwork.image ??
    (artwork.artwork.filename ? `/images/duchamp/paintings/${artwork.artwork.filename}` : null)
  );
}
