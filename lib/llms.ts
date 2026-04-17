import {
  allContentPagesSorted,
  getContentPageBySlug,
  getCritiqueBySlug,
  getCritiques,
} from '@/lib/content';

export const LLM_ARTICLE_PAGE_SIZE_CHARS = 30_000;

export type LlmRouteKind = 'content' | 'interactive' | 'index';
export type LlmRouteFormat = 'mdx' | null;
export type LlmRouteSource = 'contentPage' | 'critique' | 'bespoke';

export type LlmRouteEntry = {
  path: string;
  title: string;
  summary: string;
  kind: LlmRouteKind;
  readable: boolean;
  format: LlmRouteFormat;
  sourceType: LlmRouteSource;
  updated: string | null;
};

type InternalLlmRouteEntry = LlmRouteEntry & {
  sourceSlug?: string;
};

export type LlmReadableDocument = {
  path: string;
  title: string;
  summary: string;
  format: 'mdx';
  updated: string | null;
  content: string;
};

const staticLlmRoutes: InternalLlmRouteEntry[] = [
  {
    path: '/',
    title: 'Home',
    summary:
      'Landing page introducing the Elden Glass thesis and pointing readers toward the main research documents.',
    kind: 'index',
    readable: false,
    format: null,
    sourceType: 'bespoke',
    updated: null,
  },
  {
    path: '/critiques',
    title: 'Critiques & Responses',
    summary:
      'Index page listing critique dossiers and response essays about prior Elden Ring scholarship.',
    kind: 'index',
    readable: false,
    format: null,
    sourceType: 'bespoke',
    updated: null,
  },
  {
    path: '/gatherer',
    title: 'Elden Ring Item Cards',
    summary:
      'Interactive database and search interface for Elden Ring title cards and related structured item data.',
    kind: 'interactive',
    readable: false,
    format: null,
    sourceType: 'bespoke',
    updated: null,
  },
  {
    path: '/search',
    title: 'Search',
    summary: 'Interactive full-site search interface for the research corpus.',
    kind: 'interactive',
    readable: false,
    format: null,
    sourceType: 'bespoke',
    updated: null,
  },
  {
    path: '/xenotext',
    title: 'Xenotext',
    summary:
      'Interactive xenotext cipher and transformation engine with client-side state and visualization.',
    kind: 'interactive',
    readable: false,
    format: null,
    sourceType: 'bespoke',
    updated: null,
  },
  {
    path: '/duchamp/duchamp-works',
    title: "Duchamp's Works",
    summary:
      'Interactive catalogue raisonne view of Duchamp artworks with modal detail browsing rather than article text.',
    kind: 'interactive',
    readable: false,
    format: null,
    sourceType: 'bespoke',
    updated: null,
  },
];

/**
 * Returns the canonical LLM-facing inventory of human-readable site routes.
 */
export function getLlmRoutes(): LlmRouteEntry[] {
  return getInternalLlmRoutes().map(stripInternalRouteFields);
}

/**
 * Resolves one LLM catalog entry by its canonical absolute path.
 */
export function getLlmRouteByPath(routePath: string): LlmRouteEntry | null {
  const match = getInternalLlmRoutes().find((entry) => entry.path === routePath);
  return match ? stripInternalRouteFields(match) : null;
}

/**
 * Resolves a readable MDX-backed document for article pagination.
 */
export function getLlmReadableDocument(routePath: string): LlmReadableDocument | null {
  const route = getInternalLlmRoutes().find((entry) => entry.path === routePath);

  if (!route || !route.readable || !route.format || !route.sourceSlug) {
    return null;
  }

  if (route.sourceType === 'contentPage') {
    const doc = getContentPageBySlug(route.sourceSlug);

    if (!doc) {
      return null;
    }

    return {
      path: route.path,
      title: doc.title,
      summary: doc.summary,
      format: 'mdx',
      updated: doc.updated,
      content: doc.body.raw,
    };
  }

  if (route.sourceType === 'critique') {
    const critique = getCritiqueBySlug(route.sourceSlug);

    if (!critique) {
      return null;
    }

    return {
      path: route.path,
      title: critique.title,
      summary: critique.summary,
      format: 'mdx',
      updated: critique.updated,
      content: critique.body.raw,
    };
  }

  return null;
}

/**
 * Splits raw MDX into stable article pages of at most the configured size.
 */
export function paginateLlmDocument(content: string, maxChars = LLM_ARTICLE_PAGE_SIZE_CHARS) {
  if (content.length <= maxChars) {
    return [content];
  }

  const blocks = content.split(/\n\s*\n/g);
  const pages: string[] = [];
  let currentPage = '';

  // Keep paragraph-scale chunks together when possible, but hard-split any
  // single block that exceeds the page size on its own.
  for (const block of blocks) {
    if (!block) {
      continue;
    }

    const candidate = currentPage ? `${currentPage}\n\n${block}` : block;

    if (candidate.length <= maxChars) {
      currentPage = candidate;
      continue;
    }

    if (currentPage) {
      pages.push(currentPage);
      currentPage = '';
    }

    if (block.length <= maxChars) {
      currentPage = block;
      continue;
    }

    for (let index = 0; index < block.length; index += maxChars) {
      pages.push(block.slice(index, index + maxChars));
    }
  }

  if (currentPage) {
    pages.push(currentPage);
  }

  return pages.length ? pages : [''];
}

/**
 * Builds the full internal route inventory, including resolver-only fields.
 */
function getInternalLlmRoutes(): InternalLlmRouteEntry[] {
  const contentEntries: InternalLlmRouteEntry[] = allContentPagesSorted().map((doc) => ({
    path: doc.url,
    title: doc.title,
    summary: doc.summary,
    kind: 'content',
    readable: true,
    format: 'mdx',
    sourceType: 'contentPage',
    sourceSlug: doc.slug,
    updated: doc.updated,
  }));
  const critiqueEntries: InternalLlmRouteEntry[] = getCritiques().map((critique) => ({
    path: `/critiques/${critique.slug}`,
    title: critique.title,
    summary: critique.summary,
    kind: 'content',
    readable: true,
    format: 'mdx',
    sourceType: 'critique',
    sourceSlug: critique.slug,
    updated: critique.updated,
  }));

  return [...staticLlmRoutes, ...contentEntries, ...critiqueEntries].sort((left, right) =>
    left.path.localeCompare(right.path)
  );
}

function stripInternalRouteFields(entry: InternalLlmRouteEntry): LlmRouteEntry {
  const { sourceSlug: _sourceSlug, ...publicEntry } = entry;
  return publicEntry;
}
