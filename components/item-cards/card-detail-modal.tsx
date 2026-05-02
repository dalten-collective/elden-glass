'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ExternalLink } from 'lucide-react';
import { ShareButtons } from '@/components/ui/share-buttons';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 lg:left-[300px]"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-secondary)] border-2 border-[var(--accent-gold)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] p-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif text-[var(--accent-gold)]">Card Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-primary)] rounded transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Image */}
          {card.image && !imageFailed && (
            <div className="relative w-full h-64 rounded bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Title
            </label>
            <div>
              <p className="text-lg font-semibold text-[var(--accent-gold)]">{card.title}</p>
              {card.category && (
                <p className="text-xs text-[var(--text-secondary)] italic mt-1 font-serif">
                  {card.category}
                  {card.subcategory && ` - ${card.subcategory}`}
                </p>
              )}
            </div>
          </div>

          {/* Term */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Term
            </label>
            <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider">
              {card.term}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Section
            </label>
            <p className="text-sm text-[var(--text-secondary)]">{card.section || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Category
            </label>
            <p className="text-sm text-[var(--text-secondary)]">{card.category || 'N/A'}</p>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Subcategory
            </label>
            <p className="text-sm text-[var(--text-secondary)]">{card.subcategory || 'N/A'}</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Description
            </label>
            <p className="text-sm text-[var(--text-secondary)]">{card.description}</p>
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Links
            </label>
            {card.links && card.links.length > 0 ? (
              <div className="space-y-2">
                {card.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--accent-gold)] hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)] italic">No links</p>
            )}
          </div>

          {/* Connections */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Connections
            </label>
            {card.connections && card.connections.length > 0 ? (
              <div className="space-y-2">
                {card.connections.map((connection, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--accent-gold)]">✦</span>
                    <span className="text-[var(--text-secondary)]">
                      {connection.label || connection.linkedTitle || connection.cardId}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)] italic">No connections</p>
            )}
          </div>

          {/* Share */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
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
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
            <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
              <span>ID:</span>
              <span className="font-mono">{card.id}</span>
            </div>
            <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
              <span>Created:</span>
              <span>{new Date(card.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
              <span>Updated:</span>
              <span>{new Date(card.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
