'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';
import { ShareButtons } from '@/components/ui/share-buttons';
import { Eyebrow, Pane, Spec } from '@/components/delay';

import type { ItemCard } from '@/types/item-cards';

// Helper to check if a URL is a GIF.
const isGif = (url: string | undefined | null): boolean => {
  if (!url) return false;
  return url.toLowerCase().endsWith('.gif');
};

interface CardDetailModalProps {
  card: ItemCard;
  onClose: () => void;
}

/**
 * Read-only modal for viewing a full item card. Previously this modal
 * supported an inline edit flow (Edit button in the header, input fields,
 * debounced auto-save, PATCH to /api/item-cards). That entire path was
 * removed — the modal is now purely informational and is reached via the
 * "View card" button on the rollover.
 */
export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [card.image]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--ink)_75%,transparent)] p-4 lg:left-[300px]"
      onClick={onClose}
    >
      <Pane
        solid
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border-2 border-[var(--gold)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--pane-edge)] bg-[var(--ink-2)] p-4">
          <h2 className="font-serif text-2xl text-[var(--gold)]">Card Details</h2>
          <button
            onClick={onClose}
            className="dig-icon-button rounded p-2 hover:bg-[var(--ink)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Image */}
          {card.image && !imageFailed && (
            <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded bg-[var(--ink)]">
              {isGif(card.image) ? (
                // Native img for GIFs in modal — better performance than
                // next/image for animated assets at this size.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image}
                  alt={card.title}
                  className="max-w-full max-h-full object-contain"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                  onError={() => setImageFailed(true)}
                />
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <Eyebrow className="mb-2 block">Title</Eyebrow>
            <div>
              <p className="text-lg font-semibold text-[var(--gold)]">{card.title}</p>
              {card.category && (
                <p className="mt-1 font-serif text-xs italic text-[var(--paper-dim)]">
                  {card.category}
                  {card.subcategory && ` - ${card.subcategory}`}
                </p>
              )}
            </div>
          </div>

          {/* Term */}
          <div>
            <Eyebrow className="mb-2 block">Term</Eyebrow>
            <p>
              <Spec className="uppercase tracking-wider">{card.term}</Spec>
            </p>
          </div>

          {/* Category */}
          <div>
            <Eyebrow className="mb-2 block">Section</Eyebrow>
            <p className="text-sm text-[var(--paper-dim)]">{card.section || 'N/A'}</p>
          </div>

          <div>
            <Eyebrow className="mb-2 block">Category</Eyebrow>
            <p className="text-sm text-[var(--paper-dim)]">{card.category || 'N/A'}</p>
          </div>

          {/* Subcategory */}
          <div>
            <Eyebrow className="mb-2 block">Subcategory</Eyebrow>
            <p className="text-sm text-[var(--paper-dim)]">{card.subcategory || 'N/A'}</p>
          </div>

          {/* Description */}
          <div>
            <Eyebrow className="mb-2 block">Description</Eyebrow>
            <p className="text-sm text-[var(--paper-dim)]">{card.description}</p>
          </div>

          {/* Links */}
          <div>
            <Eyebrow className="mb-2 block">Links</Eyebrow>
            {card.links && card.links.length > 0 ? (
              <div className="space-y-2">
                {card.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dig-link flex items-center gap-2 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-[var(--paper-dimmer)]">No links</p>
            )}
          </div>

          {/* Connections */}
          <div>
            <Eyebrow className="mb-2 block">Connections</Eyebrow>
            {card.connections && card.connections.length > 0 ? (
              <div className="space-y-2">
                {card.connections.map((connection, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--gold)]">✦</span>
                    <span className="text-[var(--paper-dim)]">
                      {connection.label || connection.linkedTitle || connection.cardId}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-[var(--paper-dimmer)]">No connections</p>
            )}
          </div>

          {/* Share */}
          <div className="border-t border-[var(--pane-edge)] pt-4">
            <ShareButtons
              title={`${card.title} - Elden Glass`}
              description={
                card.description
                  ? card.description.slice(0, 200) + (card.description.length > 200 ? '...' : '')
                  : ''
              }
              variant="default"
              className="share-buttons"
            />
          </div>

          {/* Metadata */}
          <div className="space-y-2 border-t border-[var(--pane-edge)] pt-4">
            <div className="flex justify-between text-xs text-[var(--paper-dimmer)]">
              <span>ID:</span>
              <Spec>{card.id}</Spec>
            </div>
            <div className="flex justify-between text-xs text-[var(--paper-dimmer)]">
              <span>Created:</span>
              <span>{new Date(card.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-[var(--paper-dimmer)]">
              <span>Updated:</span>
              <span>{new Date(card.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Pane>
    </div>
  );
}
