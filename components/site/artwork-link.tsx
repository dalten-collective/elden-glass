'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ArtworkLinkProps {
  title: string;
  year?: string;
  imagePath: string;
}

export function ArtworkLink({ title, year, imagePath }: ArtworkLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className={cn(
          'px-3 py-1.5 text-[0.75rem] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors cursor-default',
          'border-l-2 border-transparent hover:border-[var(--accent-gold)]'
        )}
      >
        <span className="font-medium">{title}</span>
        {year && <span className="text-[var(--text-tertiary)] ml-1.5">({year})</span>}
      </div>

      {/* Floating image preview */}
      {isHovered && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${mousePosition.x + 20}px`,
            top: `${mousePosition.y - 100}px`,
          }}
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg shadow-2xl p-2 max-w-[300px]">
            <div className="relative w-full h-[250px]">
              <Image
                src={imagePath}
                alt={title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-[0.7rem] text-[var(--text-tertiary)] mt-2 text-center">
              {title} {year && `(${year})`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
