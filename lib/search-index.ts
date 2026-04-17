import * as contentlayerGenerated from 'contentlayer/generated';
import type { ContentPage } from './content';
import titleCardsData from '../data/title-cards.json';
import { extractSearchableBlocks } from './search-blocks';

const allContentPages =
  (
    contentlayerGenerated as typeof contentlayerGenerated & {
      allContentPages?: ContentPage[];
    }
  ).allContentPages ?? [];

export interface SearchResult {
  id: string;
  sentence: string;
  context: string; // Surrounding text for preview
  page: string;
  pageTitle: string;
  targetId?: string; // The block anchor to navigate to on the page
  type?: 'content' | 'titlecard'; // Type of result
  cardId?: string; // For title cards, the card ID
}

function extractSentences(text: string): string[] {
  // Split by sentence endings, keeping the punctuation
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.map((s) => s.trim()).filter((s) => s.length > 20); // Filter out very short sentences
}

function buildSearchIndex(): SearchResult[] {
  const index: SearchResult[] = [];
  let idCounter = 0;

  const allDocs = allContentPages.map((doc) => ({
    ...doc,
    page: doc.url,
    pageTitle: doc.title,
  }));

  for (const doc of allDocs) {
    const blocks = extractSearchableBlocks(doc.body.raw);

    for (const block of blocks) {
      const sentences = extractSentences(block.text);
      const searchableSentences = sentences.length
        ? sentences
        : [block.text].filter((text) => text.length > 20);

      for (let sentenceIndex = 0; sentenceIndex < searchableSentences.length; sentenceIndex++) {
        const sentence = searchableSentences[sentenceIndex];

        // Get some context (previous and next sentence if available)
        const contextParts = [];
        if (sentenceIndex > 0) contextParts.push(searchableSentences[sentenceIndex - 1]);
        contextParts.push(sentence);
        if (sentenceIndex < searchableSentences.length - 1) {
          contextParts.push(searchableSentences[sentenceIndex + 1]);
        }

        const context = contextParts.join(' ').slice(0, 200) + '...';

        index.push({
          id: `${doc.page}-${block.id}-${idCounter++}`,
          sentence,
          context,
          page: doc.page,
          pageTitle: doc.pageTitle,
          targetId: block.id,
        });
      }
    }
  }

  return index;
}

// Build index once
let searchIndex: SearchResult[] | null = null;

export function getSearchIndex(): SearchResult[] {
  if (!searchIndex) {
    searchIndex = buildSearchIndex();
  }
  return searchIndex;
}

// Search title cards and return matching results
function searchTitleCards(query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  const cards = (
    titleCardsData as {
      cards: Array<{
        id: string;
        term: string;
        title: string;
        description: string;
        section?: string;
        category?: string;
        source?: string;
      }>;
    }
  ).cards;

  for (const card of cards) {
    const lowerTerm = card.term.toLowerCase();
    const lowerTitle = card.title.toLowerCase();

    // Check if query matches term or title
    if (lowerTerm.includes(lowerQuery) || lowerTitle.includes(lowerQuery)) {
      results.push({
        id: `titlecard-${card.id}`,
        sentence: card.title,
        context: card.description.slice(0, 150) + '...',
        page: '', // Title cards don't navigate to a page directly
        pageTitle: card.section || 'Vocabulary',
        type: 'titlecard',
        cardId: card.id,
      });
    }
  }

  return results;
}

export function searchContent(query: string, limit = 10): SearchResult[] {
  if (!query || query.length < 2) return [];

  const index = getSearchIndex();
  const lowerQuery = query.toLowerCase();

  // First, get matching title cards (these go first)
  const titleCardResults = searchTitleCards(query);

  // Score each content result based on relevance
  const scored = index.map((result) => {
    const lowerSentence = result.sentence.toLowerCase();
    let score = 0;

    // Exact match gets highest score
    if (lowerSentence.includes(lowerQuery)) {
      score += 100;
      // Bonus for match at the beginning
      if (lowerSentence.startsWith(lowerQuery)) {
        score += 50;
      }
    }

    // Word-by-word matching
    const queryWords = lowerQuery.split(/\s+/);
    const sentenceWords = lowerSentence.split(/\s+/);

    for (const word of queryWords) {
      if (sentenceWords.some((sw) => sw.includes(word))) {
        score += 10;
      }
    }

    return { result: { ...result, type: 'content' as const }, score };
  });

  // Filter out zero scores and sort by score
  const contentResults = scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result);

  // Combine: title cards first, then content results
  const combined = [...titleCardResults, ...contentResults];

  return combined.slice(0, limit);
}
