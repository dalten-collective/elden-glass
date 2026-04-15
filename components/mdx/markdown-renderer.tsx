'use client';

import { cn } from '@/lib/utils';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { FloatImage } from './float-image';
import { ItemCard } from '@/components/items/item-card';
import { ArtworkCard } from '@/components/artworks/artwork-card';
import { LinkPreview } from './link-preview';
import { MagnifierImage } from './magnifier-image';
import { DefinitionItem } from './definition-item';
import { HashVerification } from '@/components/verification/hash-verification';
import { ManuscriptDisplay } from './manuscript-display';
import { EvidencePoint } from './evidence-point';
import { EvidenceGroup } from './evidence-group';
import { Callout } from './callout';
import { CalloutRow } from './callout-row';
import { Quote } from './quote';
import { ConceptCard } from './concept-card';

const components = {
  FloatImage,
  ItemCard,
  ArtworkCard,
  LinkPreview,
  MagnifierImage,
  DefinitionItem,
  HashVerification,
  ManuscriptDisplay,
  EvidencePoint,
  EvidenceGroup,
  Callout,
  CalloutRow,
  Quote,
  ConceptCard,
};

interface MarkdownRendererProps {
  code: string;
  className?: string;
}

export function MarkdownRenderer({ code, className }: MarkdownRendererProps) {
  const Component = useMDXComponent(code);
  return (
    <div className={cn('prose prose-lg prose-invert max-w-none', className)}>
      <Component components={components} />
    </div>
  );
}
