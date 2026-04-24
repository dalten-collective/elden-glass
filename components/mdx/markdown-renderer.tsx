import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { ArtworkCard } from '@/components/artworks/artwork-card';
import { EldenOrrery } from '@/components/astrology/elden-orrery';
import {
  AsideInline,
  AttestCard,
  Cap,
  Correspondence,
  Crackline,
  DropCap,
  Eyebrow,
  Lead,
  MarginNote,
  Pane,
  Plate,
  PullQuote,
  Ref,
  Spec,
} from '@/components/delay';
import { ItemCard } from '@/components/items/item-card';
import { TitleCard } from '@/components/title-cards/title-card-inline';
import { HashVerification } from '@/components/verification/hash-verification';
import { cn } from '@/lib/utils';
import { Callout } from './callout';
import { CalloutRow } from './callout-row';
import { ConceptCard } from './concept-card';
import { DefinitionItem } from './definition-item';
import { EvidenceGroup } from './evidence-group';
import { EvidencePoint } from './evidence-point';
import { FloatImage } from './float-image';
import { GoldText } from './gold-text';
import { LinkPreview } from './link-preview';
import { MagnifierImage } from './magnifier-image';
import { ManuscriptDisplay } from './manuscript-display';
import { Quote } from './quote';
import { remarkSearchBlocks } from '@/lib/search-blocks';
import { RuneFigure, RuneGrid } from './rune-figure';
import { SearchTargetFlash } from './search-block-client';

const mdxComponents = {
  FloatImage,
  ItemCard,
  TitleCard,
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
  RuneFigure,
  RuneGrid,
  EldenOrrery,
  GoldText,
  // Delay-in-Glass primitives available to MDX authors. Named components
  // coexist with the older set above; authors can mix freely while content
  // migrates to the new voice.
  AsideInline,
  AttestCard,
  Cap,
  Correspondence,
  Crackline,
  DropCap,
  Eyebrow,
  Lead,
  MarginNote,
  Pane,
  Plate,
  PullQuote,
  Ref,
  Spec,
};

const mdxOptions = {
  remarkPlugins: [remarkGfm, remarkSearchBlocks],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        // Append an anchor link after each heading. The default behavior
        // wraps heading text in an anchor, which would swallow clicks on
        // title-card terms rendered inside headings.
        behavior: 'append',
        properties: {
          className: ['heading-anchor'],
          'aria-label': 'Link to this heading',
        },
        content: {
          type: 'text',
          value: '#',
        },
      },
    ],
  ],
} as NonNullable<MDXRemoteProps['options']>['mdxOptions'];

interface MarkdownRendererProps {
  source: string;
  className?: string;
}

/**
 * Renders repository MDX content with the site's registered component set
 * and search-addressable paragraph/list anchors.
 */
export function MarkdownRenderer({ source, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-lg prose-invert max-w-none', className)}>
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{ mdxOptions, parseFrontmatter: false }}
      />
      <SearchTargetFlash />
    </div>
  );
}
