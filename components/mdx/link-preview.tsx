'use client';

import { useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

type PreviewPosition = {
  left: number;
  top: number;
};

interface LinkPreviewProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: ReactNode;
}

const PREVIEW_WIDTH = 360;
const PREVIEW_HEIGHT = 260;
const VIEWPORT_MARGIN = 16;
const CURSOR_OFFSET = 18;

function getPreviewPosition(x: number, y: number): PreviewPosition {
  if (typeof window === 'undefined') {
    return { left: x + CURSOR_OFFSET, top: y + CURSOR_OFFSET };
  }

  const fitsRight = x + CURSOR_OFFSET + PREVIEW_WIDTH <= window.innerWidth - VIEWPORT_MARGIN;
  const fitsBelow = y + CURSOR_OFFSET + PREVIEW_HEIGHT <= window.innerHeight - VIEWPORT_MARGIN;

  return {
    left: fitsRight
      ? x + CURSOR_OFFSET
      : Math.max(VIEWPORT_MARGIN, x - PREVIEW_WIDTH - CURSOR_OFFSET),
    top: fitsBelow
      ? y + CURSOR_OFFSET
      : Math.max(VIEWPORT_MARGIN, window.innerHeight - PREVIEW_HEIGHT - VIEWPORT_MARGIN),
  };
}

function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function isImageUrl(href: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(href);
}

function getHostname(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

export function LinkPreview({ href = '', children, className, ...props }: LinkPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<PreviewPosition | null>(null);
  const [frameFailed, setFrameFailed] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const external = isExternalUrl(href);
  const previewable = external;
  const imagePreview = isImageUrl(href);
  const hostname = external ? getHostname(href) : null;

  function clearHideTimer() {
    if (!hideTimeoutRef.current) return;
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = null;
  }

  function openPreview(x: number, y: number) {
    if (!previewable) return;
    clearHideTimer();
    setFrameFailed(false);
    setPosition(getPreviewPosition(x, y));
    setShowPreview(true);
  }

  function closePreview(force = false) {
    if (pinned && !force) return;
    clearHideTimer();
    setPinned(false);
    setShowPreview(false);
  }

  function scheduleClose() {
    if (pinned) return;
    clearHideTimer();
    hideTimeoutRef.current = setTimeout(() => closePreview(), 180);
  }

  const sharedClassName = ['text-[var(--accent-gold)] hover:underline relative', className]
    .filter(Boolean)
    .join(' ');

  const sharedHandlers = previewable
    ? {
        onMouseEnter: (event: React.MouseEvent<HTMLAnchorElement>) => {
          props.onMouseEnter?.(event);
          openPreview(event.clientX, event.clientY);
        },
        onFocus: (event: React.FocusEvent<HTMLAnchorElement>) => {
          props.onFocus?.(event);
          const rect = event.currentTarget.getBoundingClientRect();
          openPreview(rect.left, rect.bottom);
        },
        onMouseLeave: (event: React.MouseEvent<HTMLAnchorElement>) => {
          props.onMouseLeave?.(event);
          scheduleClose();
        },
        onBlur: (event: React.FocusEvent<HTMLAnchorElement>) => {
          props.onBlur?.(event);
          scheduleClose();
        },
        onClick: props.onClick,
      }
    : {};

  const link = external ? (
    <a
      {...props}
      href={href}
      target={props.target ?? '_blank'}
      rel={props.rel ?? 'noopener noreferrer'}
      className={sharedClassName}
      {...sharedHandlers}
    >
      {children}
    </a>
  ) : (
    <Link href={href || '#'} className={sharedClassName} {...sharedHandlers}>
      {children}
    </Link>
  );

  return (
    <>
      {link}
      {showPreview &&
        position &&
        createPortal(
          <aside
            className={`external-link-preview ${pinned ? 'external-link-preview--pinned' : ''}`}
            style={{ left: position.left, top: position.top }}
            onMouseEnter={clearHideTimer}
            onMouseLeave={scheduleClose}
          >
            <div className="external-link-preview__toolbar">
              <span className="external-link-preview__eyebrow">External page</span>
              <button
                type="button"
                className="external-link-preview__close"
                onClick={() => closePreview(true)}
                aria-label="Close external page preview"
              >
                ×
              </button>
            </div>
            <div className="external-link-preview__body">
              <div className="external-link-preview__meta">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>{hostname}</span>
              </div>
              <p className="external-link-preview__title">{children}</p>
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={href}
                  alt="External link preview"
                  className="external-link-preview__image"
                />
              ) : frameFailed ? (
                <p className="external-link-preview__fallback">
                  This site blocks embedded previews. Open the source page to read it.
                </p>
              ) : (
                <iframe
                  src={href}
                  title={`Preview of ${hostname ?? href}`}
                  className="external-link-preview__frame"
                  loading="lazy"
                  sandbox="allow-same-origin"
                  onError={() => setFrameFailed(true)}
                />
              )}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link-preview__open"
              >
                Open source page
              </a>
            </div>
          </aside>,
          document.body
        )}
    </>
  );
}
