'use client';

import {
  createContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useContext,
  useEffect,
} from 'react';
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
import { GoldText } from './gold-text';
import { EldenOrrery } from '@/components/astrology/elden-orrery';
import { getNextSearchBlockId, normalizeSearchBlockText } from '@/lib/search-blocks';

type SearchBlockContextValue = {
  seenCounts: Map<string, number>;
  insideListItem: boolean;
};

const SearchBlockContext = createContext<SearchBlockContextValue | null>(null);

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
  EldenOrrery,
  GoldText,
  p: AddressableParagraph,
  li: AddressableListItem,
};

interface MarkdownRendererProps {
  code: string;
  className?: string;
}

export function MarkdownRenderer({ code, className }: MarkdownRendererProps) {
  const Component = useMDXComponent(code);
  const searchBlockContext: SearchBlockContextValue = {
    seenCounts: new Map<string, number>(),
    insideListItem: false,
  };

  useFlashTargetedSearchBlock();

  return (
    <SearchBlockContext.Provider value={searchBlockContext}>
      <div className={cn('prose prose-lg prose-invert max-w-none', className)}>
        <Component components={components} />
      </div>
    </SearchBlockContext.Provider>
  );
}

function AddressableParagraph({ children, ...props }: ComponentPropsWithoutRef<'p'>) {
  const context = useContext(SearchBlockContext);

  if (!context || context.insideListItem) {
    return <p {...props}>{children}</p>;
  }

  const id = getSearchBlockId(children, context);
  return (
    <p {...props} id={id} data-search-block={id ? 'true' : undefined}>
      {children}
    </p>
  );
}

function AddressableListItem({ children, ...props }: ComponentPropsWithoutRef<'li'>) {
  const context = useContext(SearchBlockContext);
  const id = context ? getSearchBlockId(children, context) : undefined;

  return (
    <SearchBlockContext.Provider
      value={{
        seenCounts: context?.seenCounts ?? new Map<string, number>(),
        insideListItem: true,
      }}
    >
      <li {...props} id={id} data-search-block={id ? 'true' : undefined}>
        {children}
      </li>
    </SearchBlockContext.Provider>
  );
}

function getSearchBlockId(children: ReactNode, context: SearchBlockContextValue) {
  const text = normalizeSearchBlockText(extractText(children));

  if (!text) {
    return undefined;
  }

  return getNextSearchBlockId(text, context.seenCounts);
}

function extractText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join(' ');
  }

  if (typeof node === 'object' && 'props' in node) {
    return extractText(node.props.children);
  }

  return '';
}

function useFlashTargetedSearchBlock() {
  useEffect(() => {
    let timeoutId: number | undefined;

    const flashTarget = () => {
      const hash = window.location.hash;
      const targetId = hash.startsWith('#') ? decodeURIComponent(hash.slice(1)) : '';

      if (!targetId) {
        return;
      }

      const target = document.getElementById(targetId);
      if (!target || target.dataset.searchBlock !== 'true') {
        return;
      }

      target.classList.remove('search-target-flash');
      void target.getBoundingClientRect();
      target.classList.add('search-target-flash');

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        target.classList.remove('search-target-flash');
      }, 4000);
    };

    const frameId = window.requestAnimationFrame(flashTarget);
    window.addEventListener('hashchange', flashTarget);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('hashchange', flashTarget);
      window.clearTimeout(timeoutId);
    };
  }, []);
}
