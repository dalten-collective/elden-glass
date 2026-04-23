import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface RuneGridProps {
  children: ReactNode;
  columns?: 2 | 3;
}

interface RuneFigureProps {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
  imagePadding?: 'sm' | 'md';
}

/**
 * Compact comparison grid for rune/item icon taxonomies inside MDX essays.
 */
export function RuneGrid({ children, columns = 3 }: RuneGridProps) {
  return (
    <div className={cn('my-6 grid gap-3', columns === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
      {children}
    </div>
  );
}

/**
 * Semantic figure for compact rune/item icon plates with searchable captions.
 */
export function RuneFigure({
  src,
  alt,
  children,
  className,
  imagePadding = 'sm',
}: RuneFigureProps) {
  return (
    <figure className={cn('m-0', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- MDX rune figures render static local item icons. */}
      <img
        src={src}
        alt={alt}
        className={cn('w-full rounded bg-black/20', imagePadding === 'md' ? 'p-3' : 'p-2')}
      />
      <figcaption className="mt-1 text-center text-xs text-gray-400 [&>p]:m-0">
        {children}
      </figcaption>
    </figure>
  );
}
