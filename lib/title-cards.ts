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
