import fs from 'fs';
import path from 'path';

import {
  titleCardDatabaseSchema,
  type TitleCard,
  type TitleCardDatabase,
} from '@/types/title-cards';

const TITLE_CARDS_PATH = path.join(process.cwd(), 'data', 'title-cards.json');

export type PublicTitleCard = Omit<TitleCard, 'axes' | 'senses'>;

/**
 * Reads and validates the canonical checked-in item-card database.
 */
export function readTitleCardDatabase(): TitleCardDatabase {
  const data = fs.readFileSync(TITLE_CARDS_PATH, 'utf-8');
  const parsed = JSON.parse(data) as unknown;
  const result = titleCardDatabaseSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error(`Invalid item-card database: ${result.error.message}`);
  }

  return result.data;
}

/**
 * Returns all item cards from the checked-in database.
 */
export function getTitleCards(): TitleCard[] {
  return readTitleCardDatabase().cards;
}

/**
 * Finds a title card by its stable card id.
 */
export function getTitleCardById(id: string): TitleCard | null {
  return getTitleCards().find((card) => card.id === id) ?? null;
}

/**
 * Removes internal semantic fields from title-card API responses.
 */
export function toPublicTitleCard(card: TitleCard): PublicTitleCard {
  const { axes: _axes, senses: _senses, ...publicCard } = card;
  return publicCard;
}

function normalizeSearchText(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, ' ');
}

function includesQuery(value: string | null | undefined, query: string): boolean {
  return value ? normalizeSearchText(value).includes(query) : false;
}

/**
 * Scores a title card for search ranking.
 */
export function scoreTitleCardMatch(card: TitleCard, query: string): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return 0;
  }

  let score = 0;
  const title = normalizeSearchText(card.title);
  const term = normalizeSearchText(card.term);
  const aliases = card.aliases?.map(normalizeSearchText) ?? [];

  if (title === normalizedQuery) score += 10000;
  if (term === normalizedQuery) score += 9500;
  if (aliases.some((alias) => alias === normalizedQuery)) score += 9000;

  if (title.startsWith(normalizedQuery)) score += 8000;
  if (term.startsWith(normalizedQuery)) score += 7500;
  if (aliases.some((alias) => alias.startsWith(normalizedQuery))) score += 7000;

  if (title.includes(normalizedQuery)) score += 6000;
  if (term.includes(normalizedQuery)) score += 5500;
  if (aliases.some((alias) => alias.includes(normalizedQuery))) score += 5000;

  if (includesQuery(card.category, normalizedQuery)) score += 1500;
  if (includesQuery(card.subcategory, normalizedQuery)) score += 1200;
  if (includesQuery(card.section, normalizedQuery)) score += 1000;
  if (includesQuery(card.description, normalizedQuery)) score += 500;

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  for (const word of queryWords) {
    if (title.split(/\s+/).includes(word)) score += 250;
    if (term.split(/\s+/).includes(word)) score += 200;
    if (aliases.some((alias) => alias.split(/\s+/).includes(word))) score += 150;
    if (includesQuery(card.description, word)) score += 25;
  }

  return score;
}
