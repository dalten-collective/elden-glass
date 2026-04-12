'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { ShareButtons } from '@/components/ui/share-buttons';

import type { TitleCard } from '@/types/title-cards';

// Helper to check if a URL is a GIF.
const isGif = (url: string | undefined | null): boolean => {
  if (!url) return false;
  return url.toLowerCase().endsWith('.gif');
};

interface CardDetailModalProps {
  card: TitleCard;
  onClose: () => void;
}

/**
 * Read-only modal for viewing a full title card. Previously this modal
 * supported an inline edit flow (Edit button in the header, input fields,
 * debounced auto-save, PATCH to /api/title-cards). That entire path was
 * removed — the modal is now purely informational and is reached via the
 * "View card" button on the rollover.
 */
export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const [allCards, setAllCards] = useState<TitleCard[]>([]);
  const [relatedBySense, setRelatedBySense] = useState<Array<{
    sense: string;
    senseLabel: string;
    cards: Array<{ id: string; title: string; category?: string }>;
  }>>([]);

  // Fetch other cards so we can resolve connection titles when a
  // connection entry was saved without an explicit label. We still use
  // /api/title-cards (the paginated endpoint) because we only need
  // enough cards to resolve this card's connections, not a full lookup
  // table — the TitleCardProvider is responsible for the full set.
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/title-cards');
        if (response.ok) {
          const data = await response.json();
          setAllCards(data.filter((c: TitleCard) => c.id !== card.id));
        }
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      }
    };
    fetchCards();
  }, [card.id]);

  // Fetch semantically related cards (same WordNet sense keys).
  useEffect(() => {
    const fetchRelated = async () => {
      if (!card.senses || card.senses.length === 0) {
        setRelatedBySense([]);
        return;
      }
      try {
        const response = await fetch(`/api/related-by-sense?id=${card.id}`);
        if (response.ok) {
          const data = await response.json();
          setRelatedBySense(data.related || []);
        }
      } catch (error) {
        console.error('Failed to fetch related cards:', error);
        setRelatedBySense([]);
      }
    };
    fetchRelated();
  }, [card.id, card.senses]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-secondary)] border-2 border-[var(--accent-gold)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] p-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif text-[var(--accent-gold)]">
            Card Details
          </h2>
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
          {card.image && (
            <div className="relative w-full h-64 rounded bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
              {isGif(card.image) ? (
                // Native img for GIFs in modal — better performance than
                // next/image for animated assets at this size.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image}
                  alt={card.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain"
                  unoptimized
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
                  {card.category}{card.subcategory && ` - ${card.subcategory}`}
                </p>
              )}
            </div>
          </div>

          {/* Term */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Term
            </label>
            <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider">{card.term}</p>
          </div>

          {/* Category */}
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

          {/* Guidance of Grace Connections */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Guidance of Grace Connections
            </label>
            {card.connections && card.connections.length > 0 ? (
              <div className="space-y-2">
                {card.connections.map((connection, index) => {
                  const connectedCard = allCards.find((c) => c.id === connection.cardId);
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-[var(--accent-gold)]">✦</span>
                      <span className="text-[var(--text-secondary)]">
                        {connection.label || connectedCard?.title || 'Unknown Card'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)] italic">No connections</p>
            )}
          </div>

          {/* Related by Meaning (Semantic Connections) */}
          {relatedBySense.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Related by Meaning
              </label>
              <div className="space-y-3">
                {relatedBySense.map((senseGroup) => (
                  <div key={senseGroup.sense} className="pl-2 border-l-2 border-purple-400/30">
                    <div className="text-xs text-purple-300 mb-1 font-mono">
                      {senseGroup.senseLabel}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {senseGroup.cards.map((relatedCard) => (
                        <span
                          key={relatedCard.id}
                          className="inline-flex items-center px-2 py-0.5 text-xs bg-purple-500/10 text-purple-200 rounded border border-purple-500/20 hover:bg-purple-500/20 cursor-default"
                          title={relatedCard.category || 'No category'}
                        >
                          {relatedCard.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Semantic Tags */}
          {card.senses && card.senses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Semantic Tags
              </label>
              <div className="flex flex-wrap gap-1">
                {card.senses.slice(0, 8).map((sense) => (
                  <span
                    key={sense}
                    className="inline-flex items-center px-2 py-0.5 text-xs bg-[var(--bg-primary)] text-[var(--text-tertiary)] rounded border border-[var(--border-subtle)] font-mono"
                  >
                    {sense}
                  </span>
                ))}
                {card.senses.length > 8 && (
                  <span className="text-xs text-[var(--text-tertiary)]">
                    +{card.senses.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <ShareButtons
              title={`${card.title} - Elden Glass`}
              description={card.description.slice(0, 200) + (card.description.length > 200 ? '...' : '')}
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
