import path from 'path';

import {
  allContentPagesSorted,
  getCritiques,
  type ContentPage,
  type Critique,
} from '@/lib/content';
import {
  CONTENT_PAGES_DIR,
  getOrderedContentEntries,
  readLayoutConfig,
  type LayoutLink,
} from '@/lib/content-tree';

export type RouteCatalogKind = 'content' | 'interactive' | 'index';
export type RouteCatalogFormat = 'mdx' | null;
export type RouteCatalogSource = 'contentPage' | 'critique' | 'layoutLink' | 'bespoke';

export type RouteCatalogEntry = {
  path: string;
  title: string;
  summary: string;
  kind: RouteCatalogKind;
  readable: boolean;
  format: RouteCatalogFormat;
  sourceType: RouteCatalogSource;
  sourceSlug?: string;
  updated: string | null;
  external: boolean;
  sitemap: boolean;
  sitemapPriority: number;
};

const BESPOKE_ROUTES: RouteCatalogEntry[] = [
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
    external: false,
    sitemap: true,
    sitemapPriority: 1,
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
    external: false,
    sitemap: true,
    sitemapPriority: 0.5,
  },
  {
    path: '/contents',
    title: 'Contents',
    summary:
      'HTML index of every readable page on Elden Glass, built for browser-based LLM agents and direct site traversal.',
    kind: 'index',
    readable: false,
    format: null,
    sourceType: 'bespoke',
    updated: null,
    external: false,
    sitemap: true,
    sitemapPriority: 0.5,
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
    external: false,
    sitemap: true,
    sitemapPriority: 0.5,
  },
];

/**
 * Builds the canonical route catalog from MDX frontmatter, critique
 * frontmatter, layout.json injected links, and the few app routes that do not
 * belong to authored content.
 */
export function getRouteCatalog(): RouteCatalogEntry[] {
  return dedupeCatalogEntries([
    ...BESPOKE_ROUTES,
    ...getContentPageEntries(allContentPagesSorted()),
    ...getCritiqueEntries(getCritiques()),
    ...getLayoutLinkEntries(CONTENT_PAGES_DIR),
  ]).sort((left, right) => left.path.localeCompare(right.path));
}

/**
 * Returns a path-keyed lookup for consumers that already have a navigation
 * tree and need catalog metadata for each link.
 */
export function getRouteCatalogIndex(): Map<string, RouteCatalogEntry> {
  return new Map(getRouteCatalog().map((entry) => [entry.path, entry]));
}

function getContentPageEntries(pages: ContentPage[]): RouteCatalogEntry[] {
  return pages.map((page) => ({
    path: page.url,
    title: page.title,
    summary: page.summary,
    kind: 'content',
    readable: true,
    format: 'mdx',
    sourceType: 'contentPage',
    sourceSlug: page.slug,
    updated: page.seoUpdated ?? page.updated,
    external: false,
    sitemap: true,
    sitemapPriority: isPrimaryContentSlug(page.slug) ? 1 : 0.7,
  }));
}

function getCritiqueEntries(critiques: Critique[]): RouteCatalogEntry[] {
  return critiques.map((critique) => ({
    path: `/critiques/${critique.slug}`,
    title: critique.title,
    summary: critique.summary,
    kind: 'content',
    readable: true,
    format: 'mdx',
    sourceType: 'critique',
    sourceSlug: critique.slug,
    updated: critique.updated,
    external: false,
    sitemap: true,
    sitemapPriority: 0.7,
  }));
}

function getLayoutLinkEntries(directoryPath: string): RouteCatalogEntry[] {
  const layout = readLayoutConfig(directoryPath);
  const entries: RouteCatalogEntry[] = [];

  for (const link of Object.values(layout.links)) {
    if (!link.hidden) {
      entries.push(layoutLinkToCatalogEntry(link));
    }
  }

  for (const entry of getOrderedContentEntries(directoryPath)) {
    if (entry.kind === 'directory') {
      entries.push(...getLayoutLinkEntries(path.join(directoryPath, entry.name)));
    }
  }

  return entries;
}

function layoutLinkToCatalogEntry(link: LayoutLink): RouteCatalogEntry {
  return {
    path: link.href,
    title: link.label,
    summary: link.summary,
    kind: link.kind,
    readable: false,
    format: null,
    sourceType: 'layoutLink',
    updated: null,
    external: link.external === true,
    sitemap: link.external !== true,
    sitemapPriority: 0.5,
  };
}

function dedupeCatalogEntries(entries: RouteCatalogEntry[]): RouteCatalogEntry[] {
  const byPath = new Map<string, RouteCatalogEntry>();

  for (const entry of entries) {
    const existing = byPath.get(entry.path);

    if (existing) {
      throw new Error(
        `Duplicate route catalog entry for ${entry.path} from ${existing.sourceType} and ${entry.sourceType}`
      );
    }

    byPath.set(entry.path, entry);
  }

  return Array.from(byPath.values());
}

function isPrimaryContentSlug(slug: string): boolean {
  return ['living-thesis', 'master-list', 'tldr', 'initial-thesis'].includes(slug);
}
