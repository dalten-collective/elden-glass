import { getContentPageBySlug, getCritiqueBySlug } from '@/lib/content';
import {
  getRouteCatalog,
  type RouteCatalogEntry,
  type RouteCatalogSource,
} from '@/lib/route-catalog';

export const LLM_ARTICLE_PAGE_SIZE_CHARS = 30_000;

export type LlmRouteKind = 'content' | 'interactive' | 'index';
export type LlmRouteFormat = 'mdx' | null;
export type LlmRouteSource = RouteCatalogSource;

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

type InternalLlmRouteEntry = LlmRouteEntry & Pick<RouteCatalogEntry, 'sourceSlug'>;

export type LlmReadableDocument = {
  path: string;
  title: string;
  summary: string;
  format: 'mdx';
  updated: string | null;
  content: string;
};

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
  return getRouteCatalog()
    .filter((entry) => !entry.external)
    .map(
      (entry): InternalLlmRouteEntry => ({
        path: entry.path,
        title: entry.title,
        summary: entry.summary,
        kind: entry.kind,
        readable: entry.readable,
        format: entry.format,
        sourceType: entry.sourceType,
        sourceSlug: entry.sourceSlug,
        updated: entry.updated,
      })
    );
}

function stripInternalRouteFields(entry: InternalLlmRouteEntry): LlmRouteEntry {
  const { sourceSlug: _sourceSlug, ...publicEntry } = entry;
  return publicEntry;
}
