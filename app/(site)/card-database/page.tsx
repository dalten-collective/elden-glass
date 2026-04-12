'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Trash2, Edit3 } from 'lucide-react';
import type { TitleCard } from '@/types/title-cards';
import { CardDetailModal } from '@/components/title-cards/card-detail-modal';

const SECTIONS = [
  'Works of Marcel Duchamp',
  'The Large Glass',
  'The Readymades',
  'Elden Ring',
  'Animations',
];

export default function CardDatabasePage() {
  const [cards, setCards] = useState<TitleCard[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>('Works of Marcel Duchamp');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TitleCard | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await fetch('/api/title-cards');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Loaded cards:', data);
        setCards(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load cards:', error);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, []);

  const handleDelete = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card? This cannot be undone.')) {
      return;
    }

    setDeletingId(cardId);
    try {
      const response = await fetch(`/api/title-cards?id=${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      // Remove the card from the local state
      setCards(cards.filter(card => card.id !== cardId));
    } catch (error) {
      console.error('Failed to delete card:', error);
      alert('Failed to delete card. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCardClick = (card: TitleCard) => {
    if (!deleteMode) {
      setSelectedCard(card);
    }
  };

  // Group cards by section
  const cardsBySection = cards.reduce((acc, card) => {
    const section = card.section || 'Uncategorized';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(card);
    return acc;
  }, {} as Record<string, TitleCard[]>);

  // Filter cards if a section is selected
  const displayedSections = selectedSection
    ? { [selectedSection]: cardsBySection[selectedSection] || [] }
    : cardsBySection;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading cards...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[var(--accent-gold)] hover:underline mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
              <h1 className="text-4xl font-serif text-[var(--accent-gold)] mb-2">
                Card Database
              </h1>
              <p className="text-[var(--text-secondary)]">
                Visual spoiler of all title cards organized by section
              </p>
            </div>
            <button
              onClick={() => setDeleteMode(!deleteMode)}
              className={`px-4 py-2 rounded border transition-colors ${
                deleteMode
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                  : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                {deleteMode ? 'Exit Delete Mode' : 'Delete Mode'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Section Filter */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] sticky top-0 z-10" spellCheck={false}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((section) => {
              const count = cardsBySection[section]?.length || 0;
              return (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={`px-4 py-2 rounded border transition-colors ${
                    selectedSection === section
                      ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)]'
                      : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
                  }`}
                  spellCheck={false}
                >
                  {section} ({count})
                </button>
              );
            })}
            {Object.keys(cardsBySection)
              .filter((s) => !SECTIONS.includes(s))
              .map((section) => {
                const count = cardsBySection[section]?.length || 0;
                return (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section)}
                    className={`px-4 py-2 rounded border transition-colors ${
                      selectedSection === section
                        ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)]'
                        : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)]'
                    }`}
                    spellCheck={false}
                  >
                    {section} ({count})
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {Object.entries(displayedSections).map(([section, sectionCards]) => (
          <div key={section} className="mb-12">
            <h2 className="text-2xl font-serif text-[var(--accent-gold)] mb-6 border-b border-[var(--border-subtle)] pb-2">
              {section}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sectionCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className="bg-[var(--bg-secondary)] border-2 border-[var(--border-subtle)] rounded-lg overflow-hidden hover:border-[var(--accent-gold)] transition-all shadow-lg relative cursor-pointer"
                >
                  {/* Delete button - only show in delete mode */}
                  {deleteMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(card.id);
                      }}
                      disabled={deletingId === card.id}
                      className="absolute top-2 right-2 z-10 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      title="Delete card"
                    >
                      {deletingId === card.id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}

                  {card.image && (
                    <div className="relative w-full h-48 bg-[var(--bg-primary)]">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-[var(--accent-gold)] title-card-term cursor-help" data-card-id={card.id}>
                        {card.title}
                      </h3>
                      {card.isSplit && (
                        <span className="text-xs bg-[var(--accent-gold)] text-black px-2 py-1 rounded">
                          SPLIT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">
                      {card.term}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-3">
                      {card.description}
                    </p>
                    {card.links && card.links.length > 0 && (
                      <div className="border-t border-[var(--border-subtle)] pt-2">
                        {card.links.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-[var(--accent-gold)] hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {sectionCards.length === 0 && (
              <p className="text-[var(--text-tertiary)] italic">
                No cards in this section yet.
              </p>
            )}
          </div>
        ))}

        {Object.keys(displayedSections).length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)] text-lg">
              No title cards created yet. Start by creating some cards!
            </p>
          </div>
        )}
      </div>

      {/* Card Detail Modal — read-only view */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
