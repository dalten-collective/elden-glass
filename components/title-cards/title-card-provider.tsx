'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BookText, Link2 } from 'lucide-react';
import { TitleCardCreationModal } from './title-card-creation-modal';
import { TitleCardAssignModal } from './title-card-assign-modal';
import { TitleCardDisplay } from './title-card-display';
import type { TitleCard } from '@/types/title-cards';

interface TitleCardContextType {
  isCreationMode: boolean;
  toggleCreationMode: () => void;
  isAssignMode: boolean;
  toggleAssignMode: () => void;
  cards: TitleCard[];
  refreshCards: () => Promise<void>;
  selectedText: string;
  setSelectedText: (text: string) => void;
  showCardById: (cardId: string) => void;
}

const TitleCardContext = createContext<TitleCardContextType>({
  isCreationMode: false,
  toggleCreationMode: () => {},
  isAssignMode: false,
  toggleAssignMode: () => {},
  cards: [],
  refreshCards: async () => {},
  selectedText: '',
  setSelectedText: () => {},
  showCardById: () => {},
});

export function useTitleCards() {
  return useContext(TitleCardContext);
}

export function TitleCardProvider({ children }: { children: React.ReactNode }) {
  const [isCreationMode, setIsCreationMode] = useState(false);
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [cards, setCards] = useState<TitleCard[]>([]);
  const [selectedText, setSelectedText] = useState('');

  const toggleCreationMode = () => {
    setIsCreationMode((prev) => !prev);
    // Turn off assign mode when turning on creation mode
    if (!isCreationMode) setIsAssignMode(false);
  };

  const toggleAssignMode = () => {
    setIsAssignMode((prev) => !prev);
    // Turn off creation mode when turning on assign mode
    if (!isAssignMode) setIsCreationMode(false);
  };

  // Show a specific card by ID (dispatches custom event for TitleCardDisplay to handle)
  const showCardById = (cardId: string) => {
    const event = new CustomEvent('showTitleCard', {
      detail: { cardId },
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  const refreshCards = useCallback(async () => {
    try {
      // The rollover system needs every card in memory so any data-card-id
      // attribute in any MDX paragraph can be resolved client-side. The
      // paginated /api/title-cards endpoint caps `limit` at 100 for the
      // /gatherer browse UI, so we use the dedicated unpaginated endpoint
      // instead. See app/api/title-cards/all/route.ts for the why.
      const response = await fetch('/api/title-cards/all');
      if (response.ok) {
        const data = await response.json();
        const allCards: TitleCard[] = Array.isArray(data?.cards) ? data.cards : [];

        // Create bidirectional grace connections
        const cardsWithBidirectionalConnections = makeBidirectionalConnections(allCards);

        setCards(cardsWithBidirectionalConnections);
      }
    } catch (error) {
      console.error('Failed to fetch title cards:', error);
    }
  }, []);

  // Helper function to ensure all grace connections are bidirectional
  const makeBidirectionalConnections = (cards: TitleCard[]): TitleCard[] => {
    // Create a mutable copy of the cards
    const processedCards = cards.map((card) => ({
      ...card,
      connections: card.connections ? [...card.connections] : undefined,
    }));

    // For each card with connections
    for (let i = 0; i < processedCards.length; i++) {
      const card = processedCards[i];
      if (!card.connections) continue;

      // For each connection this card has
      for (let j = 0; j < card.connections.length; j++) {
        const connection = card.connections[j];

        // Find the connected card
        const connectedCardIndex = processedCards.findIndex((c) => c.id === connection.cardId);
        if (connectedCardIndex === -1) continue;

        const connectedCard = processedCards[connectedCardIndex];

        // Check if the connected card already has a reverse connection
        if (!connectedCard.connections) {
          connectedCard.connections = [];
        }

        const hasReverseConnection = connectedCard.connections.some(
          (conn) => conn.cardId === card.id
        );

        // If no reverse connection exists, add it
        if (!hasReverseConnection) {
          connectedCard.connections.push({
            cardId: card.id,
            label: card.title,
          });
        }
      }
    }

    return processedCards;
  };

  // Preload GIF images for faster display
  const preloadGifs = (cardsToPreload: TitleCard[]) => {
    const gifUrls: string[] = [];

    for (const card of cardsToPreload) {
      // Check main image
      if (card.image && card.image.toLowerCase().endsWith('.gif')) {
        gifUrls.push(card.image);
      }
      // Check images array if present
      if (card.images) {
        for (const img of card.images) {
          if (img && img.toLowerCase().endsWith('.gif')) {
            gifUrls.push(img);
          }
        }
      }
    }

    // Preload each unique GIF
    const uniqueUrls = Array.from(new Set(gifUrls));
    console.log(`[TitleCards] Preloading ${uniqueUrls.length} GIF(s)`);

    for (const url of uniqueUrls) {
      const img = new Image();
      img.src = url;
    }
  };

  // Load cards on mount
  useEffect(() => {
    refreshCards();
  }, [refreshCards]);

  // Preload GIFs when cards change
  useEffect(() => {
    if (cards.length > 0) {
      preloadGifs(cards);
    }
  }, [cards]);

  // Handle text selection when in creation or assign mode
  useEffect(() => {
    if (!isCreationMode && !isAssignMode) return;

    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text) {
        setSelectedText(text);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [isCreationMode, isAssignMode]);

  return (
    <TitleCardContext.Provider
      value={{
        isCreationMode,
        toggleCreationMode,
        isAssignMode,
        toggleAssignMode,
        cards,
        refreshCards,
        selectedText,
        setSelectedText,
        showCardById,
      }}
    >
      {children}
      <TitleCardCreationModal isOpen={isCreationMode} onClose={() => setIsCreationMode(false)} />
      <TitleCardAssignModal isOpen={isAssignMode} onClose={() => setIsAssignMode(false)} />
      <TitleCardDisplay cards={cards} />
    </TitleCardContext.Provider>
  );
}

export function TitleCardToggle() {
  const { isCreationMode, toggleCreationMode } = useTitleCards();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={toggleCreationMode}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        isCreationMode
          ? 'bg-purple-500 text-white hover:bg-purple-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title="Toggle title card creation mode (Ctrl+Shift+T)"
    >
      <BookText size={18} />
      <span className="hidden md:inline">Title Cards</span>
    </button>
  );
}

export function TitleCardAssignToggle() {
  const { isAssignMode, toggleAssignMode } = useTitleCards();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={toggleAssignMode}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        isAssignMode
          ? 'bg-amber-500 text-white hover:bg-amber-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title="Assign selected text to existing title card"
    >
      <Link2 size={18} />
      <span className="hidden md:inline">Assign Card</span>
    </button>
  );
}
