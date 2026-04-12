'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
}

export function LinkPreview({ href, children }: LinkPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = async (e: React.MouseEvent) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setPreviewPosition({ x: e.clientX, y: e.clientY });

    // Determine image URL immediately
    let url: string | null = null;

    if (href.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      url = href;
    } else if (href.includes('wikipedia.org')) {
      // For Wikipedia links, try to fetch preview image via API
      try {
        const pageName = href.split('/wiki/')[1];
        if (pageName) {
          const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${pageName}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data.thumbnail?.source) {
            url = data.thumbnail.source;
          }
        }
      } catch (error) {
        console.error('Failed to fetch Wikipedia preview:', error);
      }
    } else if (href.includes('metmuseum.org')) {
      url = '/images/large-glass.jpg';
    } else if (href.includes('moma.org/collection/works/32786')) {
      url = '/images/top-inscription-milky-way.jpg';
    }

    if (url) {
      setImageUrl(url);
      setShowPreview(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPreviewPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    // Delay hiding to allow moving to preview
    hideTimeoutRef.current = setTimeout(() => {
      setShowPreview(false);
    }, 300);
  };

  const handlePreviewMouseEnter = () => {
    // Cancel hiding when mouse enters preview
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handlePreviewMouseLeave = () => {
    // Hide immediately when leaving preview
    setShowPreview(false);
  };

  const isExternal = href.startsWith('http');

  return (
    <>
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-gold)] hover:underline relative"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </a>
      ) : (
        <Link
          href={href as any}
          className="text-[var(--accent-gold)] hover:underline relative"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </Link>
      )}

      {showPreview && imageUrl && (
        <div
          className="fixed z-50"
          style={{
            left: `${previewPosition.x + 20}px`,
            top: `${previewPosition.y - 100}px`,
          }}
          onMouseEnter={handlePreviewMouseEnter}
          onMouseLeave={handlePreviewMouseLeave}
        >
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg shadow-xl overflow-hidden">
            <div className="relative w-64 h-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Link preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  setShowPreview(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
