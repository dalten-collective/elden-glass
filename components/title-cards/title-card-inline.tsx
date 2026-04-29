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
import { Database, ExternalLink } from 'lucide-react';

import { captureItemCardOpen } from '@/lib/analytics/browser-capture';
import type { TitleCard as TitleCardRecord } from '@/types/title-cards';

type TitleCardProps = {
  id: string;
  children: ReactNode;
};

type TitleCardResponse = {
  card?: TitleCardRecord;
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

const CARD_WIDTH = 340;
const CARD_FALLBACK_HEIGHT = 360;
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
 * Renders an explicit read-only MDX title-card reference.
 */
export function TitleCard({ id, children }: TitleCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState<ViewportPoint | null>(null);
  const [position, setPosition] = useState<PreviewPosition | null>(null);
  const [card, setCard] = useState<TitleCardRecord | null>(null);
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

  function closePreview() {
    clearCloseTimer();
    setOpen(false);
  }

  function scheduleClose() {
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
        const response = await fetch(`/api/title-cards/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as TitleCardResponse;

        if (!response.ok || !data.card) {
          setError(data.error ?? 'Title card unavailable');
          return;
        }

        setCard(data.card);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') {
          return;
        }

        setError('Title card unavailable');
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

    if (open) {
      closePreview();
      return;
    }

    captureItemCardOpen({
      cardId: id,
      cardSection: card?.section ?? null,
      cardCategory: card?.category ?? null,
      cardSubcategory: card?.subcategory ?? null,
      source: 'mdx_inline',
    });
    openPreview({ x: event.clientX, y: event.clientY });
  }

  return (
    <>
      <button
        type="button"
        className="inline cursor-pointer border-0 bg-transparent p-0 align-baseline [font:inherit] text-[var(--accent-gold)] underline decoration-[var(--gold-dim)] decoration-1 underline-offset-4 hover:text-[var(--gold-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]"
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
            aria-hidden={!open}
            inert={!open}
            className={`fixed z-[90] w-[min(340px,calc(100vw-32px))] rounded-md border border-[var(--border-emphasis)] bg-[var(--bg-secondary)] p-0 text-left shadow-2xl ${
              visible ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            style={{
              left: position.left,
              top: position.top,
              transitionProperty: 'opacity',
              transitionDuration: '120ms',
              transitionTimingFunction: 'ease-out',
              willChange: 'opacity',
            }}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          >
            {card ? (
              <TitleCardPreview card={card} />
            ) : (
              <TitleCardStatus message={error ?? 'Loading...'} />
            )}
          </div>,
          document.body
        )}
    </>
  );
}

function TitleCardStatus({ message }: { message: string }) {
  return <div className="p-4 text-sm text-[var(--text-secondary)]">{message}</div>;
}

function TitleCardPreview({ card }: { card: TitleCardRecord }) {
  const image = card.image ?? card.images?.[0];
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <div className="overflow-hidden rounded-md">
      {image && !imageFailed && (
        <div className="relative flex h-36 items-center justify-center bg-[var(--bg-primary)]">
          {isGif(image) ? (
            // Native img keeps animated cards cheap in this small preview.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={card.title}
              className="max-h-full max-w-full object-contain"
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

      <div className="space-y-3 p-4">
        <div>
          <p className="font-serif text-lg leading-tight text-[var(--accent-gold)]">{card.title}</p>
          {(card.category || card.subcategory) && (
            <p className="mt-1 text-xs italic text-[var(--text-tertiary)]">
              {[card.category, card.subcategory].filter(Boolean).join(' - ')}
            </p>
          )}
        </div>

        <p className="line-clamp-4 text-sm leading-relaxed text-[var(--text-secondary)]">
          {card.description}
        </p>

        <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-3">
          <a
            href={`/gatherer?card=${encodeURIComponent(card.id)}&q=${encodeURIComponent(
              card.term || card.title
            )}`}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-gold)] hover:underline"
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
              className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-gold)] hover:underline"
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
