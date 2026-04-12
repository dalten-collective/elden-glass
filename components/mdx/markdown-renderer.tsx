'use client';

import { cn } from '@/lib/utils';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { FloatImage } from './float-image';
import { ItemCard } from '@/components/items/item-card';
import { ArtworkCard } from '@/components/artworks/artwork-card';
import { LinkPreview } from './link-preview';
import { MagnifierImage } from './magnifier-image';
import { DefinitionItem } from './definition-item';

const components = {
  FloatImage,
  ItemCard,
  ArtworkCard,
  LinkPreview,
  MagnifierImage,
  DefinitionItem,
};

interface MarkdownRendererProps {
  code: string;
  className?: string;
}

export function MarkdownRenderer({ code, className }: MarkdownRendererProps) {
  const Component = useMDXComponent(code);
  return (
    <div className={cn('prose prose-invert max-w-none', className)}>
      <Component components={components} />
    </div>
  );
}
