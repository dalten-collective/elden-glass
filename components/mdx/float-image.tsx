import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface FloatImageProps {
  src: string;
  alt?: string;
  align?: 'left' | 'right' | 'center';
  width?: number;
  children?: ReactNode;
}

export function FloatImage({ src, alt, align = 'center', width = 320, children }: FloatImageProps) {
  const floatClasses =
    align === 'left'
      ? 'lg:float-left lg:mr-8'
      : align === 'right'
        ? 'lg:float-right lg:ml-8'
        : 'mx-auto';

  return (
    <figure
      className={cn(
        'float-image my-8 w-full overflow-hidden rounded-xl border border-[var(--border-emphasis)] bg-[var(--bg-secondary)] shadow-panel',
        floatClasses
      )}
      style={{ maxWidth: width }}
    >
      <img src={src} alt={alt || ''} className="block h-auto w-full" />
      {children && (
        <figcaption className="px-4 py-3 text-sm text-[var(--text-secondary)] [&>p]:my-0">
          {children}
        </figcaption>
      )}
    </figure>
  );
}
