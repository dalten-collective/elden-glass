'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Link2 } from 'lucide-react';
import { useTitleCards } from './title-card-provider';
import { Button } from '@/components/ui/button';
import type { TitleCard } from '@/types/title-cards';

interface TitleCardAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TitleCardAssignModal({ isOpen, onClose }: TitleCardAssignModalProps) {
  const { selectedText, cards, refreshCards } = useTitleCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<TitleCard | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedCard(null);
    }
  }, [isOpen]);

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery.toLowerCase();
    return cards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.term.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query)
    );
  }, [cards, searchQuery]);

  const handleAssign = async () => {
    if (!selectedCard || !selectedText.trim()) return;

    setIsSaving(true);
    try {
      // Get current aliases or empty array
      const currentAliases = selectedCard.aliases || [];

      // Check if this term is already the main term or an alias
      const normalizedText = selectedText.trim().toLowerCase();
      if (selectedCard.term.toLowerCase() === normalizedText) {
        alert('This text is already the main term for this card.');
        setIsSaving(false);
        return;
      }
      if (currentAliases.some((a) => a.toLowerCase() === normalizedText)) {
        alert('This text is already an alias for this card.');
        setIsSaving(false);
        return;
      }

      // Add the new alias
      const newAliases = [...currentAliases, normalizedText];

      // Update the card via PATCH
      const response = await fetch('/api/title-cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCard.id,
          aliases: newAliases,
        }),
      });

      if (response.ok) {
        await refreshCards();
        onClose();
      } else {
        const error = await response.json();
        alert(`Failed to assign: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error assigning card:', error);
      alert('Failed to assign card. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[var(--bg-secondary)] rounded-lg shadow-2xl border border-[var(--border-emphasis)] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-[var(--accent-gold)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Assign to Title Card
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[rgb(var(--bg-primary-rgb)/0.5)] transition-colors"
          >
            <X className="h-5 w-5 text-[var(--text-tertiary)]" />
          </button>
        </div>

        {/* Selected Text */}
        <div className="px-4 py-3 bg-[rgb(var(--accent-gold-rgb)/0.1)] border-b border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
            Selected Text
          </p>
          <p className="text-[var(--accent-gold)] font-medium">&quot;{selectedText}&quot;</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title cards..."
              className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--bg-primary-rgb)/0.5)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Card List */}
        <div className="flex-1 overflow-y-auto p-2 min-h-[200px] max-h-[40vh]">
          {filteredCards.length === 0 ? (
            <p className="text-center text-[var(--text-tertiary)] py-8">No cards found</p>
          ) : (
            <div className="space-y-1">
              {filteredCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCard?.id === card.id
                      ? 'bg-[rgb(var(--accent-gold-rgb)/0.2)] border border-[var(--accent-gold)]'
                      : 'hover:bg-[rgb(var(--bg-primary-rgb)/0.5)] border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text-primary)] truncate">
                        {card.title}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                        Term: {card.term}
                        {card.aliases && card.aliases.length > 0 && (
                          <span className="ml-2">
                            (+{card.aliases.length} alias{card.aliases.length > 1 ? 'es' : ''})
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                    {selectedCard?.id === card.id && (
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--accent-gold)] mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedCard || isSaving} className="gap-2">
            {isSaving ? 'Assigning...' : 'Assign as Alias'}
          </Button>
        </div>
      </div>
    </div>
  );
}
