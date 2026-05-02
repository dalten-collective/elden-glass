'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Database, ExternalLink, Pin, X } from 'lucide-react';

import { captureItemCardOpen } from '@/lib/analytics/browser-capture';
import type { ItemCard as ItemCardRecord } from '@/types/item-cards';

type ItemCardProps = {
  id: string;
  children: ReactNode;
};

type ItemCardResponse = {
  card?: ItemCardRecord;
  error?: string;
};

type ViewportPoint = {
  x: number;
  y: number;
};

type PreviewPosition = {
  left: number;
  top: number;
};

const CARD_WIDTH = 300;
const CARD_FALLBACK_HEIGHT = 320;
const VIEWPORT_MARGIN = 16;
const CURSOR_OFFSET = 14;

function isGif(url: string | undefined): boolean {
  return url?.toLowerCase().endsWith('.gif') ?? false;
}

function getPreviewPosition(
  point: ViewportPoint,
  width = CARD_WIDTH,
  height = CARD_FALLBACK_HEIGHT
): PreviewPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const fitsRight = point.x + CURSOR_OFFSET + width <= viewportWidth - VIEWPORT_MARGIN;
  const fitsBelow = point.y + CURSOR_OFFSET + height <= viewportHeight - VIEWPORT_MARGIN;

  return {
    left: fitsRight
      ? point.x + CURSOR_OFFSET
      : Math.max(VIEWPORT_MARGIN, point.x - width - CURSOR_OFFSET),
    top: fitsBelow
      ? point.y + CURSOR_OFFSET
      : Math.max(VIEWPORT_MARGIN, viewportHeight - height - VIEWPORT_MARGIN),
  };
}

/**
 * Renders an explicit read-only MDX item-card reference.
 */
export function ItemCard({ id, children }: ItemCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState<ViewportPoint | null>(null);
  const [position, setPosition] = useState<PreviewPosition | null>(null);
  const [card, setCard] = useState<ItemCardRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function openPreview(point: ViewportPoint) {
    clearCloseTimer();
    setAnchorPoint(point);
    setPosition(getPreviewPosition(point));
    setMounted(true);
    setOpen(true);
  }

  function closePreview(force = false) {
    if (pinned && !force) {
      return;
    }

    clearCloseTimer();
    setPinned(false);
    setOpen(false);
  }

  function scheduleClose() {
    if (pinned) {
      return;
    }

    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(closePreview, 120);
  }

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (open) {
      return;
    }

    const timer = window.setTimeout(() => {
      setMounted(false);
      setAnchorPoint(null);
      setPosition(null);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    return clearCloseTimer;
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        clearCloseTimer();
        setPinned(false);
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted || !anchorPoint || !previewRef.current) {
      return;
    }

    const rect = previewRef.current.getBoundingClientRect();
    setPosition(getPreviewPosition(anchorPoint, rect.width, rect.height));
  }, [anchorPoint, card, error, mounted]);

  useEffect(() => {
    if (!mounted || !anchorPoint) {
      return;
    }

    const currentAnchorPoint = anchorPoint;

    function reposition() {
      const rect = previewRef.current?.getBoundingClientRect();
      setPosition(
        getPreviewPosition(
          currentAnchorPoint,
          rect?.width ?? CARD_WIDTH,
          rect?.height ?? CARD_FALLBACK_HEIGHT
        )
      );
    }

    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);

    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [anchorPoint, mounted]);

  useEffect(() => {
    if (!open || card || error) {
      return;
    }

    const controller = new AbortController();

    async function loadCard() {
      try {
        const response = await fetch(`/api/item-cards/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as ItemCardResponse;

        if (!response.ok || !data.card) {
          setError(data.error ?? 'Item card unavailable');
          return;
        }

        setCard(data.card);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') {
          return;
        }

        setError('Item card unavailable');
      }
    }

    loadCard();

    return () => controller.abort();
  }, [card, error, id, open]);

  function handleEnter(event: MouseEvent<HTMLButtonElement>) {
    openPreview({ x: event.clientX, y: event.clientY });
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (open && pinned) {
      closePreview(true);
      return;
    }

    captureItemCardOpen({
      cardId: id,
      cardSection: card?.section ?? null,
      cardCategory: card?.category ?? null,
      cardSubcategory: card?.subcategory ?? null,
      source: 'mdx_inline',
    });
    setPinned(true);
    openPreview({ x: event.clientX, y: event.clientY });
  }

  return (
    <>
      <button
        type="button"
        className="item-card-trigger"
        onMouseEnter={handleEnter}
        onMouseLeave={scheduleClose}
        onFocus={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          openPreview({ x: rect.left, y: rect.bottom });
        }}
        onBlur={scheduleClose}
        onClick={handleClick}
      >
        {children}
      </button>
      {mounted &&
        position &&
        createPortal(
          <div
            ref={previewRef}
            role={pinned ? 'dialog' : 'tooltip'}
            aria-hidden={!open ? true : undefined}
            aria-label={card ? `${card.title} item card preview` : 'Item card preview'}
            inert={!open}
            className={`item-card-popover fixed z-[90] w-[min(300px,calc(100vw-32px))] ${
              visible ? 'item-card-popover--visible' : ''
            } ${pinned ? 'item-card-popover--pinned' : ''}`}
            style={{
              left: position.left,
              top: position.top,
            }}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          >
            {card ? (
              <ItemCardPreview
                card={card}
                pinned={pinned}
                onPin={() => setPinned(true)}
                onClose={() => closePreview(true)}
              />
            ) : (
              <ItemCardStatus message={error ?? 'Loading...'} />
            )}
          </div>,
          document.body
        )}
    </>
  );
}

function ItemCardStatus({ message }: { message: string }) {
  return <div className="item-card-status">{message}</div>;
}

function ItemCardPreview({
  card,
  pinned,
  onPin,
  onClose,
}: {
  card: ItemCardRecord;
  pinned: boolean;
  onPin: () => void;
  onClose: () => void;
}) {
  const image = card.image ?? card.images?.[0];
  const [imageFailed, setImageFailed] = useState(false);
  const classification = [card.section, card.category, card.subcategory]
    .filter(Boolean)
    .join(' / ');
  const hasConnections = Boolean(card.connections?.length);
  const hasLinks = Boolean(card.links?.length);
  const hasAxes = Boolean(card.axes?.length);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <div className="item-card-preview">
      <div className="item-card-preview__toolbar">
        <span className="item-card-preview__eyebrow">Item card</span>
        <div className="item-card-preview__toolbar-actions">
          {!pinned && (
            <button
              type="button"
              className="item-card-preview__icon-button"
              onClick={onPin}
              aria-label="Pin item card preview"
              title="Pin preview"
            >
              <Pin className="h-3.5 w-3.5" />
            </button>
          )}
          {pinned && (
            <button
              type="button"
              className="item-card-preview__icon-button"
              onClick={onClose}
              aria-label="Close item card preview"
              title="Close preview"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {image && !imageFailed && (
        <div className="item-card-preview__media">
          {isGif(image) ? (
            // Native img keeps animated cards cheap in this small preview.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={card.title}
              className="item-card-preview__image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <Image
              src={image}
              alt={card.title}
              fill
              className="object-contain"
              unoptimized
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
      )}

      <div className="item-card-preview__body">
        <div className="item-card-preview__header">
          <p className="item-card-preview__title">{card.title}</p>
          {classification && <p className="item-card-preview__meta">{classification}</p>}
        </div>

        <p className="item-card-preview__description line-clamp-5">
          {card.description ?? 'No description has been recorded for this card yet.'}
        </p>

        <dl className="item-card-preview__facts" aria-label="Item card metadata">
          <div>
            <dt>Term</dt>
            <dd>{card.term}</dd>
          </div>
          <div>
            <dt>ID</dt>
            <dd>{card.id}</dd>
          </div>
          {hasAxes && (
            <div>
              <dt>Axes</dt>
              <dd>{card.axes?.join(' · ')}</dd>
            </div>
          )}
        </dl>

        {(hasConnections || hasLinks) && (
          <div className="item-card-preview__context">
            {hasConnections && (
              <div>
                <p className="item-card-preview__context-label">Connections</p>
                <ul>
                  {card.connections?.slice(0, 3).map((connection) => (
                    <li
                      key={`${connection.cardId}-${connection.label ?? connection.linkedTitle ?? ''}`}
                    >
                      {connection.label || connection.linkedTitle || connection.cardId}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hasLinks && (
              <div>
                <p className="item-card-preview__context-label">References</p>
                <ul>
                  {card.links?.slice(0, 2).map((link) => (
                    <li key={link.url}>{link.label}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="item-card-preview__actions">
          <a
            href={`/gatherer?card=${encodeURIComponent(card.id)}&q=${encodeURIComponent(
              card.term || card.title
            )}`}
            className="item-card-preview__link"
          >
            <Database className="h-3.5 w-3.5" />
            Open Item Card
          </a>
          {card.links?.slice(0, 1).map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="item-card-preview__link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
