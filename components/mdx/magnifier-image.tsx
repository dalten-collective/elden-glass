'use client';

import { useState, useRef } from 'react';

interface MagnifierImageProps {
  src: string;
  alt: string;
  className?: string;
  magnifierSize?: number;
  zoomLevel?: number;
}

export function MagnifierImage({
  src,
  alt,
  className = '',
  magnifierSize = 200,
  zoomLevel = 2.5,
}: MagnifierImageProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;

    const elem = imgRef.current;
    const { top, left, width, height } = elem.getBoundingClientRect();

    // Calculate cursor position relative to image
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate the position on the source image
    const imgX = (x / width) * elem.naturalWidth;
    const imgY = (y / height) * elem.naturalHeight;

    setImagePosition({ x: imgX, y: imgY });
    setMagnifierPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- Needs direct ref access for magnifier calculations */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
        style={{ cursor: 'crosshair' }}
      />

      {/* Magnifier popup */}
      {showMagnifier && (
        <div
          className="fixed z-[9999] pointer-events-none border-2 border-[var(--accent-gold)] rounded-lg shadow-2xl overflow-hidden bg-[var(--bg-elevated)]"
          style={{
            left: `${magnifierPosition.x + 20}px`,
            top: `${magnifierPosition.y + 20}px`,
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
          }}
        >
          <div
            style={{
              backgroundImage: `url('${src}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imgRef.current?.naturalWidth ? imgRef.current.naturalWidth * zoomLevel : 0}px ${
                imgRef.current?.naturalHeight ? imgRef.current.naturalHeight * zoomLevel : 0
              }px`,
              backgroundPosition: `-${imagePosition.x * zoomLevel - magnifierSize / 2}px -${
                imagePosition.y * zoomLevel - magnifierSize / 2
              }px`,
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      )}
    </>
  );
}
