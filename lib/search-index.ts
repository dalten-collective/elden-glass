import {
  allInitialThesisDocs,
  allTldrDocs,
  allLivingThesisDocs,
  allBibliographyDocs,
  allAboutDocs,
  allVocabDocs,
} from 'contentlayer/generated';
import titleCardsData from '../data/title-cards.json';

export interface SearchResult {
  id: string;
  sentence: string;
  context: string; // Surrounding text for preview
  page: string;
  pageTitle: string;
  textToFind: string; // The exact text to search for on the page
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

  const allDocs = [
    ...allInitialThesisDocs.map((doc) => ({
      ...doc,
      page: '/initial-thesis',
      pageTitle: doc.title,
    })),
    ...allTldrDocs.map((doc) => ({ ...doc, page: '/tldr', pageTitle: doc.title })),
    ...allLivingThesisDocs.map((doc) => ({ ...doc, page: '/living-thesis', pageTitle: doc.title })),
    ...allBibliographyDocs.map((doc) => ({ ...doc, page: '/bibliography', pageTitle: doc.title })),
    ...allAboutDocs.map((doc) => ({ ...doc, page: '/about', pageTitle: doc.title })),
    ...allVocabDocs.map((doc) => ({
      ...doc,
      page: `/bachelor-machines/terms`,
      pageTitle: doc.title,
    })),
  ];

  for (const doc of allDocs) {
    // Extract plain text from markdown (remove markdown syntax)
    const plainText = doc.body.raw
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]+`/g, '') // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/[#*_~]/g, '') // Remove markdown formatting
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .replace(/\n\n+/g, ' ') // Replace multiple newlines with space
      .trim();

    const sentences = extractSentences(plainText);

    for (const sentence of sentences) {
      // Get some context (previous and next sentence if available)
      const sentenceIndex = sentences.indexOf(sentence);
      const contextParts = [];
      if (sentenceIndex > 0) contextParts.push(sentences[sentenceIndex - 1]);
      contextParts.push(sentence);
      if (sentenceIndex < sentences.length - 1) contextParts.push(sentences[sentenceIndex + 1]);

      const context = contextParts.join(' ').slice(0, 200) + '...';

      index.push({
        id: `${doc.page}-${idCounter++}`,
        sentence,
        context,
        page: doc.page,
        pageTitle: doc.pageTitle,
        textToFind: sentence.slice(0, 50), // First 50 chars for finding
      });
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
        textToFind: card.term,
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
