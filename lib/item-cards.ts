import fs from 'fs';
import path from 'path';

import { itemCardDatabaseSchema, type ItemCard, type ItemCardDatabase } from '@/types/item-cards';

const ITEM_CARDS_PATH = path.join(process.cwd(), 'data', 'item-cards.json');

export type PublicItemCard = Omit<ItemCard, 'axes' | 'senses'>;

/**
 * Reads and validates the canonical checked-in item-card database.
 */
export function readItemCardDatabase(): ItemCardDatabase {
  const data = fs.readFileSync(ITEM_CARDS_PATH, 'utf-8');
  const parsed = JSON.parse(data) as unknown;
  const result = itemCardDatabaseSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error(`Invalid item-card database: ${result.error.message}`);
  }

  return result.data;
}

/**
 * Returns all item cards from the checked-in database.
 */
export function getItemCards(): ItemCard[] {
  return readItemCardDatabase().cards;
}

/**
 * Finds an item card by its stable card id.
 */
export function getItemCardById(id: string): ItemCard | null {
  return getItemCards().find((card) => card.id === id) ?? null;
}

/**
 * Removes internal semantic fields from item-card API responses.
 */
export function toPublicItemCard(card: ItemCard): PublicItemCard {
  const { axes: _axes, senses: _senses, ...publicCard } = card;
  return publicCard;
}
