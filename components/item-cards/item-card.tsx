'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Copy,
  Database,
  ExternalLink,
  Maximize2,
  Minus,
  Pin,
  PinOff,
  Square,
  X,
} from 'lucide-react';

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

type PopFrameRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type DragState = {
  startX: number;
  startY: number;
  startRect: PopFrameRect;
};

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

type ResizeState = DragState & {
  edge: ResizeEdge;
};

type ZoomPlace =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'full'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

const zoomButtons: Array<{
  icon: typeof Maximize2;
  label: string;
  place: ZoomPlace;
}> = [
  { icon: ArrowUpLeft, label: 'Top-left quarter', place: 'top-left' },
  { icon: ArrowUp, label: 'Top half', place: 'top' },
  { icon: ArrowUpRight, label: 'Top-right quarter', place: 'top-right' },
  { icon: ArrowLeft, label: 'Left half', place: 'left' },
  { icon: Square, label: 'Full screen', place: 'full' },
  { icon: ArrowRight, label: 'Right half', place: 'right' },
  { icon: ArrowDownLeft, label: 'Bottom-left quarter', place: 'bottom-left' },
  { icon: ArrowDown, label: 'Bottom half', place: 'bottom' },
  { icon: ArrowDownRight, label: 'Bottom-right quarter', place: 'bottom-right' },
];

const CARD_WIDTH = 380;
const CARD_FALLBACK_HEIGHT = 430;
const CARD_MIN_WIDTH = 300;
const CARD_MIN_HEIGHT = 210;
const VIEWPORT_MARGIN = 16;
const CURSOR_OFFSET = 14;
const TITLE_BAR_HEIGHT = 30;
const MINIMIZED_WIDTH = 340;

let topPopFrameZIndex = 90;

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

function rectFromPoint(point: ViewportPoint): PopFrameRect {
  const position = getPreviewPosition(point);
  return {
    left: position.left,
    top: position.top,
    width: Math.min(CARD_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2),
    height: Math.min(CARD_FALLBACK_HEIGHT, window.innerHeight - VIEWPORT_MARGIN * 2),
  };
}

function clampRect(rect: PopFrameRect): PopFrameRect {
  const maxWidth = Math.max(CARD_MIN_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
  const maxHeight = Math.max(CARD_MIN_HEIGHT, window.innerHeight - VIEWPORT_MARGIN * 2);
  const width = Math.min(Math.max(rect.width, CARD_MIN_WIDTH), maxWidth);
  const height = Math.min(Math.max(rect.height, CARD_MIN_HEIGHT), maxHeight);

  return {
    width,
    height,
    left: Math.min(
      Math.max(rect.left, VIEWPORT_MARGIN),
      window.innerWidth - width - VIEWPORT_MARGIN
    ),
    top: Math.min(
      Math.max(rect.top, VIEWPORT_MARGIN),
      window.innerHeight - height - VIEWPORT_MARGIN
    ),
  };
}

function clampPosition(rect: PopFrameRect): PopFrameRect {
  return {
    ...rect,
    left: Math.min(Math.max(rect.left, 0), window.innerWidth - rect.width),
    top: Math.min(Math.max(rect.top, 0), window.innerHeight - rect.height),
  };
}

function minimizedRectFrom(rect: PopFrameRect): PopFrameRect {
  return clampPosition({
    left: 0,
    top: window.innerHeight - TITLE_BAR_HEIGHT,
    width: Math.min(Math.max(rect.width, MINIMIZED_WIDTH), window.innerWidth - VIEWPORT_MARGIN * 2),
    height: TITLE_BAR_HEIGHT,
  });
}

function maximizedRect(): PopFrameRect {
  return {
    left: VIEWPORT_MARGIN,
    top: VIEWPORT_MARGIN,
    width: window.innerWidth - VIEWPORT_MARGIN * 2,
    height: window.innerHeight - VIEWPORT_MARGIN * 2,
  };
}

function zoomedRect(place: ZoomPlace): PopFrameRect {
  const left = VIEWPORT_MARGIN;
  const top = VIEWPORT_MARGIN;
  const width = window.innerWidth - VIEWPORT_MARGIN * 2;
  const height = window.innerHeight - VIEWPORT_MARGIN * 2;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  switch (place) {
    case 'top-left':
      return { left, top, width: halfWidth, height: halfHeight };
    case 'top':
      return { left, top, width, height: halfHeight };
    case 'top-right':
      return { left: left + halfWidth, top, width: halfWidth, height: halfHeight };
    case 'left':
      return { left, top, width: halfWidth, height };
    case 'right':
      return { left: left + halfWidth, top, width: halfWidth, height };
    case 'bottom-left':
      return { left, top: top + halfHeight, width: halfWidth, height: halfHeight };
    case 'bottom':
      return { left, top: top + halfHeight, width, height: halfHeight };
    case 'bottom-right':
      return {
        left: left + halfWidth,
        top: top + halfHeight,
        width: halfWidth,
        height: halfHeight,
      };
    case 'full':
      return maximizedRect();
  }
}

/**
 * Renders an explicit read-only MDX item-card reference.
 */
export function ItemCard({ id, children }: ItemCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState<ViewportPoint | null>(null);
  const [rect, setRect] = useState<PopFrameRect | null>(null);
  const [savedRect, setSavedRect] = useState<PopFrameRect | null>(null);
  const [pinned, setPinned] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [manuallySized, setManuallySized] = useState(false);
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  const [zIndex, setZIndex] = useState(topPopFrameZIndex);
  const [card, setCard] = useState<ItemCardRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const zoomMenuCloseTimerRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);

  const bringToFront = useCallback(function bringToFront() {
    topPopFrameZIndex += 1;
    setZIndex(topPopFrameZIndex);
  }, []);

  const clearCloseTimer = useCallback(function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const clearZoomMenuCloseTimer = useCallback(function clearZoomMenuCloseTimer() {
    if (zoomMenuCloseTimerRef.current === null) {
      return;
    }

    window.clearTimeout(zoomMenuCloseTimerRef.current);
    zoomMenuCloseTimerRef.current = null;
  }, []);

  function openZoomMenu() {
    clearZoomMenuCloseTimer();
    setZoomMenuOpen(true);
  }

  function scheduleZoomMenuClose() {
    clearZoomMenuCloseTimer();
    zoomMenuCloseTimerRef.current = window.setTimeout(() => setZoomMenuOpen(false), 220);
  }

  function openPreview(point: ViewportPoint) {
    clearCloseTimer();
    setAnchorPoint(point);
    setRect((currentRect) => currentRect ?? rectFromPoint(point));
    bringToFront();
    setMounted(true);
    setOpen(true);
  }

  function renderedRect(): PopFrameRect | null {
    const viewportRect = previewRef.current?.getBoundingClientRect();
    if (!viewportRect) {
      return null;
    }

    return {
      left: viewportRect.left,
      top: viewportRect.top,
      width: viewportRect.width,
      height: viewportRect.height,
    };
  }

  function restoreRect(rectToRestore: PopFrameRect | null, fallback: PopFrameRect | null) {
    return rectToRestore ? clampRect(rectToRestore) : fallback;
  }

  function closePreview() {
    if (pinned) {
      return;
    }

    clearCloseTimer();
    setOpen(false);
  }

  const closePopFrame = useCallback(
    function closePopFrame() {
      clearCloseTimer();
      setOpen(false);
      setPinned(false);
      setMinimized(false);
      setMaximized(false);
      setManuallySized(false);
      setZoomMenuOpen(false);
    },
    [clearCloseTimer]
  );

  function scheduleClose() {
    if (pinned) {
      return;
    }

    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(closePreview, 120);
  }

  const pinPopFrame = useCallback(
    function pinPopFrame() {
      clearCloseTimer();
      setPinned(true);
      bringToFront();
    },
    [bringToFront, clearCloseTimer]
  );

  const togglePin = useCallback(
    function togglePin() {
      clearCloseTimer();
      setPinned((current) => !current);
      bringToFront();
    },
    [bringToFront, clearCloseTimer]
  );

  const toggleMaximize = useCallback(
    function toggleMaximize() {
      pinPopFrame();
      setMinimized(false);
      setManuallySized(true);
      setMaximized((currentlyMaximized) => {
        if (currentlyMaximized) {
          setRect((currentRect) => restoreRect(savedRect, currentRect));
          setSavedRect(null);
          return false;
        }

        setRect((currentRect) => {
          const currentViewportRect = renderedRect() ?? currentRect;
          if (currentViewportRect) {
            setSavedRect(currentViewportRect);
          }
          return maximizedRect();
        });
        return true;
      });
    },
    [pinPopFrame, savedRect]
  );

  const zoomToPlace = useCallback(
    function zoomToPlace(place: ZoomPlace) {
      pinPopFrame();
      setMinimized(false);
      setManuallySized(true);
      setMaximized(place === 'full');
      setRect((currentRect) => {
        const currentViewportRect = renderedRect() ?? currentRect;
        if (currentViewportRect && !maximized) {
          setSavedRect(currentViewportRect);
        }
        return zoomedRect(place);
      });
    },
    [maximized, pinPopFrame]
  );

  const toggleMinimize = useCallback(
    function toggleMinimize() {
      pinPopFrame();
      setMaximized(false);
      setManuallySized(true);
      setMinimized((currentlyMinimized) => {
        if (currentlyMinimized) {
          setRect((currentRect) => restoreRect(savedRect, currentRect));
          setSavedRect(null);
          return false;
        }

        setRect((currentRect) => {
          const currentViewportRect = renderedRect() ?? currentRect;
          if (currentViewportRect) {
            setSavedRect(currentViewportRect);
            return minimizedRectFrom(currentViewportRect);
          }

          return currentRect;
        });
        return true;
      });
    },
    [pinPopFrame, savedRect]
  );

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
      setRect(null);
      setSavedRect(null);
      setManuallySized(false);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
      clearZoomMenuCloseTimer();
    };
  }, [clearCloseTimer, clearZoomMenuCloseTimer]);

  useLayoutEffect(() => {
    if (!mounted || !anchorPoint || !previewRef.current || pinned) {
      return;
    }

    const rect = previewRef.current.getBoundingClientRect();
    const position = getPreviewPosition(anchorPoint, rect.width, rect.height);
    setRect((currentRect) =>
      currentRect
        ? { ...currentRect, left: position.left, top: position.top }
        : {
            left: position.left,
            top: position.top,
            width: Math.min(rect.width || CARD_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2),
            height: Math.min(
              rect.height || CARD_FALLBACK_HEIGHT,
              window.innerHeight - VIEWPORT_MARGIN * 2
            ),
          }
    );
  }, [anchorPoint, card, error, mounted, pinned]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    function reposition() {
      if (maximized) {
        setRect(maximizedRect());
        return;
      }

      if (minimized) {
        setRect((currentRect) => (currentRect ? minimizedRectFrom(currentRect) : currentRect));
        return;
      }

      setRect((currentRect) => (currentRect ? clampRect(currentRect) : currentRect));
    }

    window.addEventListener('resize', reposition);
    if (!pinned) {
      window.addEventListener('scroll', reposition, true);
    }

    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [maximized, minimized, mounted, pinned]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey) {
        return;
      }

      if (event.key === 'Escape') {
        if (pinned) {
          setPinned(false);
          setMinimized(false);
          setMaximized(false);
          return;
        }

        closePopFrame();
      }

      if (!pinned) {
        return;
      }

      if (event.key === 'q') {
        zoomToPlace('top-left');
      } else if (event.key === 'w') {
        zoomToPlace('top');
      } else if (event.key === 'e') {
        zoomToPlace('top-right');
      } else if (event.key === 'a') {
        zoomToPlace('left');
      } else if (event.key === 'd') {
        zoomToPlace('right');
      } else if (event.key === 'z') {
        zoomToPlace('bottom-left');
      } else if (event.key === 's') {
        zoomToPlace('bottom');
      } else if (event.key === 'x') {
        zoomToPlace('bottom-right');
      } else if (event.key === 'f') {
        toggleMaximize();
      } else if (event.key === 't') {
        toggleMinimize();
      } else if (event.key === 'c') {
        togglePin();
      } else if (event.key === 'r' && (maximized || minimized)) {
        setRect((currentRect) => restoreRect(savedRect, currentRect));
        setSavedRect(null);
        setManuallySized(false);
        setMaximized(false);
        setMinimized(false);
      }
    }

    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [
    closePopFrame,
    maximized,
    minimized,
    open,
    pinned,
    savedRect,
    toggleMaximize,
    toggleMinimize,
    togglePin,
    zoomToPlace,
  ]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const dragState = dragStateRef.current;
      if (dragState) {
        const nextRect = clampRect({
          ...dragState.startRect,
          left: dragState.startRect.left + event.clientX - dragState.startX,
          top: dragState.startRect.top + event.clientY - dragState.startY,
        });
        setRect(nextRect);
        return;
      }

      const resizeState = resizeStateRef.current;
      if (!resizeState) {
        return;
      }

      const deltaX = event.clientX - resizeState.startX;
      const deltaY = event.clientY - resizeState.startY;
      const nextRect = { ...resizeState.startRect };

      if (resizeState.edge.includes('e')) {
        nextRect.width = resizeState.startRect.width + deltaX;
      }
      if (resizeState.edge.includes('s')) {
        nextRect.height = resizeState.startRect.height + deltaY;
      }
      if (resizeState.edge.includes('w')) {
        nextRect.left = resizeState.startRect.left + deltaX;
        nextRect.width = resizeState.startRect.width - deltaX;
      }
      if (resizeState.edge.includes('n')) {
        nextRect.top = resizeState.startRect.top + deltaY;
        nextRect.height = resizeState.startRect.height - deltaY;
      }

      setRect(clampRect(nextRect));
    }

    function handlePointerUp() {
      dragStateRef.current = null;
      resizeStateRef.current = null;
      document.documentElement.classList.remove('item-card-popframe-dragging');
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

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

    if (open) {
      pinPopFrame();
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
    setPinned(true);
  }

  function startDrag(event: MouseEvent<HTMLDivElement>) {
    if (!rect || minimized || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    pinPopFrame();
    setMaximized(false);
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startRect: savedRect ?? rect,
    };
    if (maximized && savedRect) {
      setRect(savedRect);
      setSavedRect(null);
    }
    document.documentElement.classList.add('item-card-popframe-dragging');
  }

  function startResize(edge: ResizeEdge, event: MouseEvent<HTMLButtonElement>) {
    if (!rect || !pinned || minimized || maximized || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    bringToFront();
    setManuallySized(true);
    resizeStateRef.current = {
      edge,
      startX: event.clientX,
      startY: event.clientY,
      startRect: previewRef.current?.getBoundingClientRect() ?? rect,
    };
    document.documentElement.classList.add('item-card-popframe-dragging');
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
        rect &&
        createPortal(
          <div
            ref={previewRef}
            role={pinned ? 'dialog' : 'tooltip'}
            aria-hidden={!open ? true : undefined}
            aria-label={card ? `${card.title} item card popframe` : 'Item card popframe'}
            inert={!open}
            className={`item-card-popover fixed ${
              visible ? 'item-card-popover--visible' : ''
            } ${pinned ? 'item-card-popover--pinned' : ''} ${
              minimized ? 'item-card-popover--minimized' : ''
            } ${maximized ? 'item-card-popover--maximized' : ''}`}
            style={{
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: manuallySized ? rect.height : undefined,
              zIndex,
            }}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
            onMouseDown={bringToFront}
          >
            <div className="item-card-popover__title-bar" onMouseDown={startDrag}>
              <div className="item-card-popover__actions" aria-label="Item card popframe controls">
                <TitleBarButton label="Close item card popframe" onClick={closePopFrame}>
                  <X />
                </TitleBarButton>
                <div
                  className={`item-card-popover__control item-card-popover__control--zoom ${
                    zoomMenuOpen ? 'item-card-popover__control--open' : ''
                  }`}
                  onMouseEnter={openZoomMenu}
                  onMouseLeave={scheduleZoomMenuClose}
                  onFocus={openZoomMenu}
                  onBlur={scheduleZoomMenuClose}
                >
                  <TitleBarButton
                    label={maximized ? 'Restore item card popframe' : 'Maximize item card popframe'}
                    onClick={toggleMaximize}
                    disabled={minimized}
                  >
                    {maximized ? <Copy /> : <Square />}
                  </TitleBarButton>
                  <div
                    className="item-card-popover__submenu"
                    aria-label="Zoom item card popframe"
                    onMouseEnter={openZoomMenu}
                    onMouseLeave={scheduleZoomMenuClose}
                  >
                    {zoomButtons.map(({ icon: Icon, label, place }) => (
                      <TitleBarButton key={place} label={label} onClick={() => zoomToPlace(place)}>
                        <Icon />
                      </TitleBarButton>
                    ))}
                  </div>
                </div>
                <TitleBarButton
                  label={
                    minimized ? 'Unminimize item card popframe' : 'Minimize item card popframe'
                  }
                  onClick={toggleMinimize}
                >
                  {minimized ? <Square /> : <Minus />}
                </TitleBarButton>
                <TitleBarButton
                  label={pinned ? 'Unpin item card popframe' : 'Pin item card popframe'}
                  onClick={togglePin}
                  disabled={minimized}
                >
                  {pinned ? <PinOff /> : <Pin />}
                </TitleBarButton>
              </div>
              <p className="item-card-popover__title">{card?.title ?? children}</p>
              <div className="item-card-popover__right-slot" aria-hidden="true" />
            </div>

            {!minimized && (
              <div className="item-card-popover__scroll">
                {card ? (
                  <ItemCardPreview card={card} />
                ) : (
                  <ItemCardStatus message={error ?? 'Loading...'} />
                )}
              </div>
            )}

            {pinned && !minimized && !maximized && (
              <>
                {(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const).map((edge) => (
                  <button
                    key={edge}
                    type="button"
                    aria-label={`Resize item card popframe ${edge}`}
                    className={`item-card-popover__resize item-card-popover__resize--${edge}`}
                    onMouseDown={(event) => startResize(edge, event)}
                  />
                ))}
              </>
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

function TitleBarButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="item-card-popover__button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {children}
    </button>
  );
}

function ItemCardPreview({ card }: { card: ItemCardRecord }) {
  const image = card.image ?? card.images?.[0];
  const [imageFailed, setImageFailed] = useState(false);
  const classification = [card.section, card.category, card.subcategory]
    .filter(Boolean)
    .join(' / ');

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <div className="item-card-preview">
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

        <p className="item-card-preview__description">
          {card.description ?? 'No description has been recorded for this card yet.'}
        </p>

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
