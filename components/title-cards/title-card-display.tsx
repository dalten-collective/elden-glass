'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ExternalLink, Eye } from 'lucide-react';
import { GifPlayer } from '@/components/gif-player';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardDetailModal } from '@/components/title-cards/card-detail-modal';
import type { TitleCard } from '@/types/title-cards';

interface TitleCardDisplayProps {
  cards: TitleCard[];
}

interface HoverState {
  card: TitleCard;
  x: number;
  y: number;
}

// Helper to check if a URL is a GIF
const isGif = (url: string | undefined | null): boolean => {
  if (!url) return false;
  return url.toLowerCase().endsWith('.gif');
};

export function TitleCardDisplay({ cards }: TitleCardDisplayProps) {
  const router = useRouter();
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const [connectedCards, setConnectedCards] = useState<TitleCard[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  // When set, shows the read-only CardDetailModal for the given card.
  const [detailCard, setDetailCard] = useState<TitleCard | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 1024px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigate to Gatherer with the card's term as search
  const navigateToGatherer = useCallback(
    (card: TitleCard) => {
      router.push(`/gatherer?q=${encodeURIComponent(card.term || card.title)}`);
      setHoverState(null);
      setConnectedCards([]);
    },
    [router]
  );

  // Adjust zoom level based on number of connected cards
  useEffect(() => {
    // Start at 1, reduce by 0.08 for each connected card (min 0.65)
    const newZoom = Math.max(0.65, 1 - connectedCards.length * 0.08);
    setZoomLevel(newZoom);
  }, [connectedCards.length]);

  useEffect(() => {
    // Don't highlight text when there are no cards
    if (cards.length === 0) return;

    // Helper to show card popup
    const showCardPopup = (target: HTMLElement, cardIdAttr: string) => {
      // Support comma-separated card IDs for showing multiple cards
      const cardIds = cardIdAttr.split(',').map((id) => id.trim());
      const primaryCard = cards.find((c) => c.id === cardIds[0]);

      if (primaryCard) {
        const rect = target.getBoundingClientRect();
        setHoverState({
          card: primaryCard,
          x: rect.left + rect.width / 2,
          y: rect.bottom + 8,
        });

        // If multiple card IDs, show additional cards as connected
        if (cardIds.length > 1) {
          const additionalCards = cardIds
            .slice(1)
            .map((id) => cards.find((c) => c.id === id))
            .filter((c): c is TitleCard => c !== undefined);
          setConnectedCards(additionalCards);
        } else {
          setConnectedCards([]);
        }
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      // Skip hover behavior on mobile - we use click instead
      if (isMobile) return;

      const target = e.target as HTMLElement;

      // Check if hovering over a highlighted term
      if (target.classList.contains('title-card-term')) {
        const cardIdAttr = target.getAttribute('data-card-id');
        if (!cardIdAttr) return;
        showCardPopup(target, cardIdAttr);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      // Skip hover behavior on mobile
      if (isMobile) return;

      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;

      // Don't hide if moving to the card itself
      if (relatedTarget && cardRef.current?.contains(relatedTarget)) {
        return;
      }

      if (target.classList.contains('title-card-term')) {
        timeoutRef.current = setTimeout(() => {
          setHoverState(null);
        }, 200);
      }
    };

    const handleCardMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleCardMouseLeave = () => {
      // Skip on mobile
      if (isMobile) return;
      setHoverState(null);
      setConnectedCards([]);
      setZoomLevel(1);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // On mobile: clicking a title-card-term shows the popup
      if (isMobile && target.classList.contains('title-card-term')) {
        e.preventDefault();
        e.stopPropagation();
        const cardIdAttr = target.getAttribute('data-card-id');
        if (cardIdAttr) {
          // If popup is already showing for this card, close it
          const cardIds = cardIdAttr.split(',').map((id) => id.trim());
          if (hoverState?.card.id === cardIds[0]) {
            setHoverState(null);
            setConnectedCards([]);
          } else {
            showCardPopup(target, cardIdAttr);
          }
        }
        return;
      }

      // Close popup if clicking anywhere that's not the card or a term
      if (!target.classList.contains('title-card-term') && !cardRef.current?.contains(target)) {
        setHoverState(null);
        setConnectedCards([]);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);

    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('mouseenter', handleCardMouseEnter);
      cardElement.addEventListener('mouseleave', handleCardMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
      if (cardElement) {
        cardElement.removeEventListener('mouseenter', handleCardMouseEnter);
        cardElement.removeEventListener('mouseleave', handleCardMouseLeave);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cards, isMobile, hoverState?.card.id]);

  // Listen for programmatic card show requests (from search)
  useEffect(() => {
    const handleShowTitleCard = (e: CustomEvent<{ cardId: string }>) => {
      const card = cards.find((c) => c.id === e.detail.cardId);
      if (card) {
        // Position card in center of viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        setHoverState({
          card,
          x: viewportWidth / 2,
          y: viewportHeight / 3,
        });
        setConnectedCards([]);
      }
    };

    window.addEventListener('showTitleCard', handleShowTitleCard as EventListener);
    return () => {
      window.removeEventListener('showTitleCard', handleShowTitleCard as EventListener);
    };
  }, [cards]);

  // Title-card terms are opted into explicitly by the author via
  // <span className="title-card-term ... text-amber-400" data-card-id="...">
  // in the MDX. An earlier version of this component auto-scanned every text
  // node under <main> for word-boundary matches against every card term and
  // wrapped them in a grey cursor-help span, which duplicated author intent
  // and produced two visually distinct classes of "rollover term" on the
  // same page. The author's hand-placed spans are now the single source of
  // truth, and rollovers are driven entirely by the mouseover/click
  // handlers above keyed on the .title-card-term class.

  // Calculate safe position to prevent card from going off-screen
  const [safeX, setSafeX] = useState(0);
  const [safeY, setSafeY] = useState(0);

  useEffect(() => {
    if (!hoverState || !cardRef.current) return;

    const { x, y } = hoverState;
    const cardRect = cardRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 16; // Padding from viewport edges

    let adjustedX = x;
    let adjustedY = y;

    // Horizontal adjustment
    const halfWidth = cardRect.width / 2;
    if (x - halfWidth < padding) {
      // Too far left
      adjustedX = halfWidth + padding;
    } else if (x + halfWidth > viewportWidth - padding) {
      // Too far right
      adjustedX = viewportWidth - halfWidth - padding;
    }

    // Vertical adjustment
    if (y + cardRect.height > viewportHeight - padding) {
      // Too far down - position above the trigger point instead
      adjustedY = y - cardRect.height - 16;
    }
    if (adjustedY < padding) {
      // Too far up
      adjustedY = padding;
    }

    setSafeX(adjustedX);
    setSafeY(adjustedY);
  }, [hoverState]);

  // Render nothing if no hover state AND no editing card
  if (!hoverState && !detailCard) return null;

  const card = hoverState?.card;
  const x = hoverState?.x ?? 0;
  const y = hoverState?.y ?? 0;

  // Helper to render images
  const renderImages = (images: string[], baseTitle: string) => {
    const imageElements = [];
    for (let i = 0; i < images.length; i++) {
      const imgSrc = images[i];
      imageElements.push(
        <div
          key={i}
          className="relative w-28 h-28 rounded overflow-hidden border border-[var(--border-subtle)]"
        >
          {isGif(imgSrc) ? (
            <GifPlayer
              src={imgSrc}
              alt={`${baseTitle} - Image ${i + 1}`}
              className="w-full h-full object-contain"
              skipMs={2000}
              durationMs={18000}
            />
          ) : (
            <Image
              src={imgSrc}
              alt={`${baseTitle} - Image ${i + 1}`}
              fill
              className="object-contain"
            />
          )}
        </div>
      );
    }
    return imageElements;
  };

  // Helper to render mini card images
  const renderMiniImages = (images: string[], baseTitle: string) => {
    const imageElements = [];
    for (let i = 0; i < images.length; i++) {
      const imgSrc = images[i];
      imageElements.push(
        <div key={i} className="relative w-16 h-16 rounded overflow-hidden">
          {isGif(imgSrc) ? (
            <GifPlayer
              src={imgSrc}
              alt={`${baseTitle} ${i + 1}`}
              className="w-full h-full object-contain"
              skipMs={2000}
              durationMs={18000}
            />
          ) : (
            <Image src={imgSrc} alt={`${baseTitle} ${i + 1}`} fill className="object-contain" />
          )}
        </div>
      );
    }
    return imageElements;
  };

  // Helper to render links
  const renderLinks = (links: Array<{ label: string; url: string }>) => {
    const linkElements = [];
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      linkElements.push(
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[var(--accent-gold)] hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          {link.label}
        </a>
      );
    }
    return linkElements;
  };

  // Helper to render SVG connection lines
  const renderConnectionLines = (connections: Array<{ cardId: string; label?: string }>) => {
    const lineElements = [];
    for (let i = 0; i < connections.length; i++) {
      const x1 = '50%';
      const y1 = 0;
      const spacing = 100 / (connections.length + 1);
      const x2 = `${spacing * (i + 1)}%`;
      const y2 = '100%';
      lineElements.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--accent-gold)"
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="2,2"
        />
      );
    }
    return lineElements;
  };

  // Helper to render connection buttons
  const renderConnectionButtons = (connections: Array<{ cardId: string; label?: string }>) => {
    const buttonElements = [];
    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i];
      const connectedCard = cards.find((c) => c.id === connection.cardId);
      if (!connectedCard) continue;

      buttonElements.push(
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            // Add to connected cards if not already there
            if (!connectedCards.find((c) => c.id === connectedCard.id)) {
              setConnectedCards((prev) => [...prev, connectedCard]);
            }
          }}
          className="group relative flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--accent-gold)]/30 hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 transition-all shadow"
          title={`Follow grace to: ${connectedCard.title}`}
        >
          {/* Glowing effect on hover */}
          <span className="absolute inset-0 rounded-full bg-[var(--accent-gold)] opacity-0 group-hover:opacity-20 blur-sm transition-opacity" />
          <span className="text-[var(--accent-gold)] text-sm leading-none relative">✦</span>
          <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)] relative font-medium">
            {connection.label || connectedCard.title}
          </span>
        </button>
      );
    }
    return buttonElements;
  };

  // Helper to render regular connection buttons (larger version)
  const renderRegularConnectionButtons = (
    connections: Array<{ cardId: string; label?: string }>
  ) => {
    const buttonElements = [];
    for (let i = 0; i < connections.length; i++) {
      const connection = connections[i];
      const connectedCard = cards.find((c) => c.id === connection.cardId);
      if (!connectedCard) continue;

      buttonElements.push(
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            // Add to connected cards if not already there
            if (!connectedCards.find((c) => c.id === connectedCard.id)) {
              setConnectedCards((prev) => [...prev, connectedCard]);
            }
          }}
          className="group flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--accent-gold)]/30 hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10 transition-all"
          title={`Follow grace to: ${connectedCard.title}`}
        >
          <span className="text-[var(--accent-gold)] text-lg leading-none">✦</span>
          <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-gold)]">
            {connection.label || connectedCard.title}
          </span>
        </button>
      );
    }
    return buttonElements;
  };

  // Helper to render connected mini cards
  const renderConnectedCards = () => {
    const cardElements = [];
    for (let idx = 0; idx < connectedCards.length; idx++) {
      const connectedCard = connectedCards[idx];
      const connectedIsDLC = connectedCard.source === 'dlc';
      const connectedBorderColor = connectedIsDLC
        ? 'border-[var(--accent-red)]/50'
        : 'border-[var(--accent-gold)]/50';
      cardElements.push(
        <div key={connectedCard.id} className="relative">
          {/* Connection line */}
          <div className="absolute -left-3 top-1/2 w-3 h-0.5 bg-[var(--accent-gold)] opacity-30" />
          {/* Mini card */}
          <Card className={`shadow-xl border ${connectedBorderColor} max-w-xs`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-[var(--accent-gold)] flex items-center justify-between">
                <span>{connectedCard.title}</span>
                <button
                  onClick={() => setConnectedCards((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-[var(--text-tertiary)] hover:text-[var(--accent-gold)] ml-2"
                  title="Close"
                >
                  ×
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {connectedCard.image && (
                <div className="relative w-full h-24 rounded overflow-hidden">
                  {isGif(connectedCard.image) ? (
                    <GifPlayer
                      src={connectedCard.image}
                      alt={connectedCard.title}
                      className="w-full h-full object-contain"
                      skipMs={2000}
                      durationMs={18000}
                    />
                  ) : (
                    <Image
                      src={connectedCard.image}
                      alt={connectedCard.title}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              )}
              {connectedCard.isSplit && connectedCard.images && (
                <div className="flex gap-1 justify-center">
                  {renderMiniImages(connectedCard.images, connectedCard.title)}
                </div>
              )}
              <p className="text-[10px] text-[var(--text-secondary)] line-clamp-3">
                {connectedCard.description}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
    return cardElements;
  };

  // Check if this is a split card with multiple images
  if (card?.isSplit && card.images && card.images.length > 0) {
    // Get header card if it's a titlecard type
    let headerCard: TitleCard | undefined;
    if (card.headerPopup?.type === 'titlecard' && card.headerPopup.titleCardId) {
      headerCard = cards.find((c) => c.id === card.headerPopup!.titleCardId);
    }

    const splitIsDLC = card.source === 'dlc';
    const splitBorderColor = splitIsDLC
      ? 'border-[var(--accent-red)]'
      : 'border-[var(--accent-gold)]';

    return (
      <>
        {/* View-only card detail modal */}
        {detailCard && <CardDetailModal card={detailCard} onClose={() => setDetailCard(null)} />}
        <div
          ref={cardRef}
          className="fixed z-50 pointer-events-auto origin-top"
          style={{
            left: `${safeX}px`,
            top: `${safeY}px`,
            transform: `translateX(-50%) scale(${zoomLevel})`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center gap-2">
              {/* Header Popup */}
              {card.headerPopup && (
                <div className="relative">
                  <Card className={`shadow-2xl border-2 ${splitBorderColor} max-w-md`}>
                    <CardContent className="p-4">
                      {card.headerPopup.type === 'titlecard' && headerCard && (
                        <>
                          <CardTitle className="text-sm text-[var(--accent-gold)] mb-2">
                            {headerCard.title}
                          </CardTitle>
                          {headerCard.image && (
                            <div className="relative w-full h-32 rounded overflow-hidden mb-2">
                              {isGif(headerCard.image) ? (
                                <GifPlayer
                                  src={headerCard.image}
                                  alt={headerCard.title}
                                  className="w-full h-full object-contain"
                                  skipMs={2000}
                                  durationMs={18000}
                                />
                              ) : (
                                <Image
                                  src={headerCard.image}
                                  alt={headerCard.title}
                                  fill
                                  className="object-contain"
                                />
                              )}
                            </div>
                          )}
                          <p className="text-xs text-[var(--text-secondary)]">
                            {headerCard.description}
                          </p>
                        </>
                      )}

                      {card.headerPopup.type === 'note' && (
                        <>
                          {card.headerPopup.title && (
                            <CardTitle className="text-sm text-[var(--accent-gold)] mb-2">
                              {card.headerPopup.title}
                            </CardTitle>
                          )}
                          <p className="text-xs text-[var(--text-secondary)]">
                            {card.headerPopup.note}
                          </p>
                        </>
                      )}

                      {card.headerPopup.type === 'image' && (
                        <>
                          {card.headerPopup.title && (
                            <CardTitle className="text-sm text-[var(--accent-gold)] mb-2">
                              {card.headerPopup.title}
                            </CardTitle>
                          )}
                          {card.headerPopup.imageUrl && (
                            <div className="relative w-full h-32 rounded overflow-hidden">
                              {isGif(card.headerPopup.imageUrl) ? (
                                <GifPlayer
                                  src={card.headerPopup.imageUrl}
                                  alt={card.headerPopup.title || 'Image'}
                                  className="w-full h-full object-contain"
                                  skipMs={2000}
                                  durationMs={18000}
                                />
                              ) : (
                                <Image
                                  src={card.headerPopup.imageUrl}
                                  alt={card.headerPopup.title || 'Image'}
                                  fill
                                  className="object-contain"
                                />
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {card.headerPopup.type === 'webpage' && (
                        <a
                          href={card.headerPopup.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:opacity-80 transition"
                        >
                          {card.headerPopup.title && (
                            <CardTitle className="text-sm text-[var(--accent-gold)] mb-2 flex items-center gap-1">
                              {card.headerPopup.title}
                              <ExternalLink className="h-3 w-3" />
                            </CardTitle>
                          )}
                          {card.headerPopup.imageUrl && (
                            <div className="relative w-full h-32 rounded overflow-hidden">
                              {isGif(card.headerPopup.imageUrl) ? (
                                <GifPlayer
                                  src={card.headerPopup.imageUrl}
                                  alt={card.headerPopup.title || 'Webpage preview'}
                                  className="w-full h-full object-contain"
                                  skipMs={2000}
                                  durationMs={18000}
                                />
                              ) : (
                                <Image
                                  src={card.headerPopup.imageUrl}
                                  alt={card.headerPopup.title || 'Webpage preview'}
                                  fill
                                  className="object-contain"
                                />
                              )}
                            </div>
                          )}
                        </a>
                      )}
                    </CardContent>
                  </Card>
                  {/* Visual connector line */}
                  <div className="absolute left-1/2 -bottom-2 w-0.5 h-4 bg-[var(--accent-gold)] transform -translate-x-1/2" />
                </div>
              )}

              {/* Split Card - Multiple Images Side-by-Side */}
              <Card
                className={`shadow-2xl border-2 ${splitBorderColor} max-w-xl ${isMobile ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
                onClick={isMobile ? () => navigateToGatherer(card) : undefined}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-[var(--accent-gold)]">
                      {card.title}
                    </CardTitle>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailCard(card);
                      }}
                      className="p-1 hover:bg-[var(--accent-gold)]/20 rounded transition-colors"
                      title="View card"
                    >
                      <Eye className="h-3 w-3 text-[var(--accent-gold)]" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Description first */}
                  <p className="text-xs text-[var(--text-secondary)]">{card.description}</p>
                  {/* Images displayed side-by-side */}
                  <div className="flex gap-1.5 justify-center">
                    {renderImages(card.images, card.title)}
                  </div>
                  {/* Category/subcategory after images */}
                  {card.category && (
                    <div className="text-[10px] text-[var(--text-secondary)] italic font-serif">
                      {card.category}
                      {card.subcategory && ` - ${card.subcategory}`}
                    </div>
                  )}
                  {card.links && card.links.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                      {renderLinks(card.links)}
                    </div>
                  )}

                  {/* Guidance of Grace Connections */}
                  {card.connections && card.connections.length > 0 && (
                    <div className="pt-2 border-t border-[var(--border-subtle)] relative">
                      <div className="text-[10px] text-[var(--accent-gold)] mb-2 font-semibold tracking-wide">
                        Guided by Grace
                      </div>
                      {/* Visual connection container */}
                      <div className="relative min-h-[60px]">
                        {/* Connection lines (SVG overlay) */}
                        <svg
                          className="absolute inset-0 pointer-events-none"
                          style={{ width: '100%', height: '100%' }}
                        >
                          {renderConnectionLines(card.connections)}
                        </svg>
                        {/* Connection buttons */}
                        <div className="flex flex-wrap gap-1.5 justify-center pt-6">
                          {renderConnectionButtons(card.connections)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile tap hint */}
                  {isMobile && (
                    <div className="pt-2 mt-2 border-t border-[var(--border-subtle)] text-center">
                      <span className="text-[10px] text-[var(--accent-gold)] opacity-70">
                        Tap to view in Gatherer →
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Connected Cards via Grace */}
            {renderConnectedCards()}
          </div>
        </div>
      </>
    );
  }

  // Regular single card display - only render if card exists
  if (!card) {
    // Only modal to show, no hover card
    return detailCard ? (
      <CardDetailModal card={detailCard} onClose={() => setDetailCard(null)} />
    ) : null;
  }

  const isDLC = card.source === 'dlc';
  const borderColor = isDLC ? 'border-[var(--accent-red)]' : 'border-[var(--accent-gold)]';

  return (
    <>
      {/* View-only card detail modal */}
      {detailCard && <CardDetailModal card={detailCard} onClose={() => setDetailCard(null)} />}
      <div
        ref={cardRef}
        className="fixed z-50 pointer-events-auto origin-top"
        style={{
          left: `${safeX}px`,
          top: `${safeY}px`,
          transform: `translateX(-50%) scale(${zoomLevel})`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="flex gap-3 items-start">
          <Card
            className={`shadow-2xl border-2 ${borderColor} max-w-sm ${isMobile ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
            onClick={isMobile ? () => navigateToGatherer(card) : undefined}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[var(--accent-gold)]">{card.title}</CardTitle>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailCard(card);
                  }}
                  className="p-1 hover:bg-[var(--accent-gold)]/20 rounded transition-colors"
                  title="View card"
                >
                  <Eye className="h-4 w-4 text-[var(--accent-gold)]" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Description first */}
              <p className="text-sm text-[var(--text-secondary)]">{card.description}</p>
              {/* Image after description */}
              {card.image && (
                <div className="relative w-full h-48 rounded overflow-hidden">
                  {isGif(card.image) ? (
                    <GifPlayer
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-contain"
                      skipMs={2000}
                      durationMs={18000}
                    />
                  ) : (
                    <Image src={card.image} alt={card.title} fill className="object-contain" />
                  )}
                </div>
              )}
              {/* Category/Subcategory after image */}
              {card.category && (
                <div className="text-xs text-[var(--text-secondary)] italic font-serif">
                  {card.category}
                  {card.subcategory && ` - ${card.subcategory}`}
                </div>
              )}
              {card.links && card.links.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                  {renderLinks(card.links)}
                </div>
              )}

              {/* Guidance of Grace Connections */}
              {card.connections && card.connections.length > 0 && (
                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <div className="text-xs text-[var(--accent-gold)] mb-2 font-semibold tracking-wide">
                    Guided by Grace
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {renderRegularConnectionButtons(card.connections)}
                  </div>
                </div>
              )}

              {/* Mobile tap hint */}
              {isMobile && (
                <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] text-center">
                  <span className="text-xs text-[var(--accent-gold)] opacity-70">
                    Tap to view in Gatherer →
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connected Cards via Grace */}
          {renderConnectedCards()}
        </div>
      </div>
    </>
  );
}
