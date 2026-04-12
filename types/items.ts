/**
 * Elden Ring Item Types
 * Based on ERDB API structure
 */

export interface EldenRingItem {
  id: number;
  name: string;
  description?: string;
  summary?: string;
  category: ItemCategory;
  icon?: string;
  cardImage?: string; // Full in-game item card screenshot

  // Additional metadata
  effects?: string;
  weight?: number;
  maxHeld?: number;
  maxStored?: number;

  // For Great Runes and special items
  isGreatRune?: boolean;
  relatedTo?: string[];
}

export type ItemCategory =
  | 'goods'
  | 'key-items'
  | 'weapons'
  | 'armor'
  | 'talismans'
  | 'sorceries'
  | 'incantations'
  | 'ashes-of-war'
  | 'spirit-ashes'
  | 'crafting-materials'
  | 'info-items'
  | 'consumables'
  | 'remembrances'
  | 'spells';

export interface ItemCardProps {
  itemName: string;
  children: React.ReactNode;
  category?: ItemCategory;
}
