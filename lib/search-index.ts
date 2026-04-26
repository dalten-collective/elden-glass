import MiniSearch, { type SearchResult as MiniSearchResult } from 'minisearch';

import { allContentPagesSorted, getCritiques, type ContentPage, type Critique } from './content';
import { getRouteCatalog } from './route-catalog';
import { extractSearchableBlocks } from './search-blocks';
import { getTitleCards, type PublicTitleCard } from './title-cards';
import type { TitleCard } from '@/types/title-cards';

export type SearchDocumentKind = 'content' | 'critique' | 'custom-page' | 'item-card';

export interface SearchDocument {
  id: string;
  kind: SearchDocumentKind;
  title: string;
  pageTitle: string;
  summary: string;
  context: string;
  body: string;
  headings: string;
  section: string;
  category: string;
  subcategory: string;
  aliases: string;
  term: string;
  url: string;
  targetId?: string;
  sourceId?: string;
}

export interface SearchResult {
  id: string;
  sentence: string;
  context: string;
  page: string;
  pageTitle: string;
  targetId?: string;
  type?: 'content' | 'titlecard';
  cardId?: string;
}

type SearchIndex = {
  documents: SearchDocument[];
  byId: Map<string, SearchDocument>;
  miniSearch: MiniSearch<SearchDocument>;
};

type ItemCardSearchResult = {
  card: TitleCard;
  score: number;
};

const SEARCH_FIELDS = [
  'title',
  'summary',
  'headings',
  'body',
  'section',
  'category',
  'aliases',
  'term',
];
const STORE_FIELDS = [
  'kind',
  'title',
  'pageTitle',
  'summary',
  'context',
  'body',
  'section',
  'category',
  'subcategory',
  'url',
  'targetId',
  'sourceId',
];

const BASE_SEARCH_OPTIONS = {
  boost: {
    title: 8,
    term: 7,
    aliases: 6,
    summary: 4,
    headings: 4,
    section: 2,
    category: 2,
    body: 1,
  },
  prefix: true,
  fuzzy: 0.18,
  weights: {
    prefix: 0.7,
    fuzzy: 0.45,
  },
};

let cachedIndex: SearchIndex | null = null;

/**
 * Returns the normalized search documents used by all search surfaces.
 */
export function getSearchDocuments(): SearchDocument[] {
  return getSearchIndex().documents;
}

/**
 * Searches prose/content surfaces and excludes item-card records.
 */
export function searchContent(query: string, limit = 10): SearchResult[] {
  return searchDocuments(query, ['content', 'critique', 'custom-page'], limit).map(toSearchResult);
}

/**
 * Searches normalized documents by kind using the shared MiniSearch index.
 */
export function searchDocuments(
  query: string,
  kinds: SearchDocumentKind[],
  limit = 10
): SearchDocument[] {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  const allowedKinds = new Set(kinds);
  const { miniSearch, byId } = getSearchIndex();

  return miniSearch
    .search(normalizedQuery, {
      ...BASE_SEARCH_OPTIONS,
      filter: (result) => allowedKinds.has(result.kind as SearchDocumentKind),
    })
    .map((result) => ({ result, document: byId.get(String(result.id)) }))
    .filter((entry): entry is { result: MiniSearchResult; document: SearchDocument } =>
      Boolean(entry.document)
    )
    .sort((left, right) => compareSearchResults(normalizedQuery, left, right))
    .slice(0, limit)
    .map(({ document }) => document);
}

/**
 * Searches item cards through the same normalized MiniSearch index.
 */
export function searchItemCards(query: string, limit = Number.POSITIVE_INFINITY): TitleCard[] {
  return searchItemCardsWithScores(query, limit).map(({ card }) => card);
}

/**
 * Searches item cards and keeps the MiniSearch score for callers that need it.
 */
export function searchItemCardsWithScores(
  query: string,
  limit = Number.POSITIVE_INFINITY
): ItemCardSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  const cardsById = new Map(getTitleCards().map((card) => [card.id, card]));
  const { miniSearch } = getSearchIndex();

  return miniSearch
    .search(normalizedQuery, {
      ...BASE_SEARCH_OPTIONS,
      filter: (result) => result.kind === 'item-card',
    })
    .map((result) => ({ result, card: cardsById.get(String(result.sourceId)) }))
    .filter((entry): entry is { result: MiniSearchResult; card: TitleCard } => Boolean(entry.card))
    .sort((left, right) => compareItemCardResults(normalizedQuery, left, right))
    .slice(0, limit)
    .map(({ result, card }) => ({ card, score: result.score }));
}

function getSearchIndex(): SearchIndex {
  if (cachedIndex) {
    return cachedIndex;
  }

  const documents = buildSearchDocuments();
  const miniSearch = new MiniSearch<SearchDocument>({
    fields: SEARCH_FIELDS,
    storeFields: STORE_FIELDS,
    searchOptions: BASE_SEARCH_OPTIONS,
  });

  miniSearch.addAll(documents);

  cachedIndex = {
    documents,
    byId: new Map(documents.map((document) => [document.id, document])),
    miniSearch,
  };

  return cachedIndex;
}

function buildSearchDocuments(): SearchDocument[] {
  return [
    ...allContentPagesSorted().flatMap(contentPageToSearchDocuments),
    ...getCritiques().flatMap(critiqueToSearchDocuments),
    ...getCustomPageSearchDocuments(),
    ...getTitleCards().map(titleCardToSearchDocument),
  ];
}

function contentPageToSearchDocuments(page: ContentPage): SearchDocument[] {
  const base = {
    kind: 'content' as const,
    title: page.title,
    pageTitle: page.title,
    summary: page.summary,
    context: page.summary,
    headings: page.headings.map((heading) => heading.text).join(' '),
    section: '',
    category: '',
    subcategory: '',
    aliases: '',
    term: '',
    url: page.url,
    sourceId: page.slug,
  };

  return [
    {
      ...base,
      id: `content:${page.slug}:page`,
      body: page.summary,
    },
    ...extractSearchableBlocks(page.body.raw).map((block, index) => ({
      ...base,
      id: `content:${page.slug}:${index}:${block.id}`,
      summary: '',
      body: block.text,
      targetId: block.id,
    })),
  ];
}

function critiqueToSearchDocuments(critique: Critique): SearchDocument[] {
  const base = {
    kind: 'critique' as const,
    title: critique.title,
    pageTitle: critique.title,
    summary: critique.summary,
    context: critique.summary,
    headings: '',
    section: 'Critiques',
    category: critique.targetTitle,
    subcategory: '',
    aliases: '',
    term: '',
    url: `/critiques/${critique.slug}`,
    sourceId: critique.slug,
  };

  return [
    {
      ...base,
      id: `critique:${critique.slug}:page`,
      body: critique.summary,
    },
    ...extractSearchableBlocks(critique.body.raw).map((block, index) => ({
      ...base,
      id: `critique:${critique.slug}:${index}:${block.id}`,
      summary: '',
      body: block.text,
      targetId: block.id,
    })),
  ];
}

function getCustomPageSearchDocuments(): SearchDocument[] {
  return getRouteCatalog()
    .filter(
      (entry) =>
        !entry.external && entry.sourceType !== 'contentPage' && entry.sourceType !== 'critique'
    )
    .map((entry) => ({
      id: `custom-page:${entry.path}`,
      kind: 'custom-page' as const,
      title: entry.title,
      pageTitle: entry.title,
      summary: entry.summary,
      context: entry.summary,
      body: entry.summary,
      headings: '',
      section: entry.kind,
      category: entry.sourceType,
      subcategory: '',
      aliases: '',
      term: '',
      url: entry.path,
      sourceId: entry.path,
    }));
}

function titleCardToSearchDocument(card: TitleCard): SearchDocument {
  const publicCard = card as PublicTitleCard;

  return {
    id: `item-card:${publicCard.id}`,
    kind: 'item-card',
    title: publicCard.title,
    pageTitle: publicCard.section || 'Item Cards',
    summary: publicCard.description ?? '',
    context: publicCard.description ?? '',
    body: publicCard.description ?? '',
    headings: '',
    section: publicCard.section ?? '',
    category: publicCard.category ?? '',
    subcategory: publicCard.subcategory ?? '',
    aliases: publicCard.aliases?.join(' ') ?? '',
    term: publicCard.term,
    url: `/gatherer?card=${encodeURIComponent(publicCard.id)}`,
    sourceId: publicCard.id,
  };
}

function toSearchResult(document: SearchDocument): SearchResult {
  return {
    id: document.id,
    sentence:
      document.kind === 'custom-page'
        ? document.title
        : snippetFromText(document.body || document.title),
    context: snippetFromText(document.context || document.summary || document.body),
    page: document.url,
    pageTitle: document.pageTitle,
    targetId: document.targetId,
    type: 'content',
  };
}

function compareSearchResults(
  query: string,
  left: { result: MiniSearchResult; document: SearchDocument },
  right: { result: MiniSearchResult; document: SearchDocument }
): number {
  return (
    relevanceTier(right.document, query) - relevanceTier(left.document, query) ||
    right.result.score - left.result.score ||
    left.document.title.localeCompare(right.document.title)
  );
}

function compareItemCardResults(
  query: string,
  left: { result: MiniSearchResult; card: TitleCard },
  right: { result: MiniSearchResult; card: TitleCard }
): number {
  return (
    titleCardRelevanceTier(right.card, query) - titleCardRelevanceTier(left.card, query) ||
    right.result.score - left.result.score ||
    left.card.title.localeCompare(right.card.title)
  );
}

function relevanceTier(document: SearchDocument, query: string): number {
  const title = normalizeSearchText(document.title);
  const summary = normalizeSearchText(document.summary);
  const isPageLevelDocument = !document.targetId;

  if (title === query && isPageLevelDocument) return 500;
  if (title === query) return 400;
  if (title.startsWith(query)) return 300;
  if (title.includes(query)) return 200;
  if (summary.includes(query)) return 100;
  return 0;
}

function titleCardRelevanceTier(card: TitleCard, query: string): number {
  const title = normalizeSearchText(card.title);
  const term = normalizeSearchText(card.term);
  const aliases = card.aliases?.map(normalizeSearchText) ?? [];

  if (title === query) return 700;
  if (term === query) return 650;
  if (aliases.some((alias) => alias === query)) return 600;
  if (title.startsWith(query)) return 500;
  if (term.startsWith(query)) return 450;
  if (aliases.some((alias) => alias.startsWith(query))) return 400;
  if (title.includes(query)) return 300;
  if (term.includes(query)) return 250;
  if (aliases.some((alias) => alias.includes(query))) return 200;
  return 0;
}

function normalizeSearchText(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

function snippetFromText(value: string): string {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= 220) {
    return normalized;
  }

  return `${normalized.slice(0, 217)}...`;
}
