/**
 * Semantic relationships library
 *
 * Uses sense tags from WordNet to find related cards by meaning.
 */

import { TitleCard } from '@/types/title-cards';

// Sense -> CardIds index
let senseIndex: Record<string, string[]> | null = null;

// Load sense index lazily
async function loadSenseIndex(): Promise<Record<string, string[]>> {
  if (senseIndex) return senseIndex;

  try {
    const response = await fetch('/api/sense-index');
    if (response.ok) {
      senseIndex = await response.json();
      return senseIndex!;
    }
  } catch (e) {
    console.error('Failed to load sense index:', e);
  }

  return {};
}

// Parse sense key into components
export function parseSenseKey(senseKey: string): { word: string; pos: string; num: number } | null {
  const match = senseKey.match(/^(.+)\.(n|v|a|r|s)\.(\d+)$/);
  if (!match) return null;
  return { word: match[1], pos: match[2], num: parseInt(match[3], 10) };
}

// Get human-readable label for a sense
export function getSenseLabel(senseKey: string): string {
  const parsed = parseSenseKey(senseKey);
  if (!parsed) return senseKey;

  const posLabels: Record<string, string> = {
    n: '(noun)',
    v: '(verb)',
    a: '(adj)',
    r: '(adv)',
    s: '(sat adj)',
  };

  return `${parsed.word} ${posLabels[parsed.pos] || ''}`.trim();
}

// Get emoji for sense category
export function getSenseEmoji(senseKey: string): string {
  const word = senseKey.split('.')[0].toLowerCase();

  // Common sense categories
  const emojiMap: Record<string, string> = {
    // Abstract
    concept: '💭',
    idea: '💡',
    thought: '🧠',

    // People
    person: '👤',
    character: '🎭',
    queen: '👑',
    king: '🤴',
    god: '✨',
    deity: '✨',
    warrior: '⚔️',
    knight: '🛡️',

    // Objects
    weapon: '⚔️',
    sword: '🗡️',
    armor: '🛡️',
    ring: '💍',
    glass: '🔮',
    machine: '⚙️',

    // Places
    location: '📍',
    place: '🗺️',
    area: '🌍',
    tree: '🌳',

    // Actions
    suspended: '⛓️',
    broken: '💔',
    shattered: '💔',

    // Magic
    magic: '✨',
    sorcery: '🔮',
    spell: '🪄',

    // Default by POS
    default_n: '📦',
    default_v: '▶️',
    default_a: '🏷️',
  };

  if (emojiMap[word]) return emojiMap[word];

  const parsed = parseSenseKey(senseKey);
  if (parsed) {
    const defaultKey = `default_${parsed.pos}`;
    if (emojiMap[defaultKey]) return emojiMap[defaultKey];
  }

  return '•';
}

/**
 * Find cards related to a given card by shared senses
 */
export async function findRelatedBySense(
  card: TitleCard,
  allCards: TitleCard[],
  maxResults: number = 10
): Promise<{ sense: string; cards: TitleCard[] }[]> {
  if (!card.senses || card.senses.length === 0) {
    return [];
  }

  const index = await loadSenseIndex();
  const cardById = new Map(allCards.map((c) => [c.id, c]));

  const senseResults: { sense: string; cards: TitleCard[] }[] = [];

  for (const sense of card.senses) {
    const relatedIds = index[sense] || [];
    const relatedCards = relatedIds
      .filter((id) => id !== card.id)
      .map((id) => cardById.get(id))
      .filter((c): c is TitleCard => c !== undefined)
      .slice(0, 5);

    if (relatedCards.length > 0) {
      senseResults.push({ sense, cards: relatedCards });
    }
  }

  // Sort by number of related cards (most connections first)
  senseResults.sort((a, b) => b.cards.length - a.cards.length);

  return senseResults.slice(0, maxResults);
}

/**
 * Find cards by sense intersection (cards sharing multiple senses)
 */
export function findBySenseIntersection(
  senses: string[],
  allCards: TitleCard[],
  minShared: number = 2,
  maxResults: number = 20
): { card: TitleCard; sharedSenses: string[]; score: number }[] {
  const results: { card: TitleCard; sharedSenses: string[]; score: number }[] = [];

  const senseSet = new Set(senses);

  for (const card of allCards) {
    if (!card.senses) continue;

    const sharedSenses = card.senses.filter((s) => senseSet.has(s));

    if (sharedSenses.length >= minShared) {
      results.push({
        card,
        sharedSenses,
        score: sharedSenses.length / Math.max(senses.length, card.senses.length),
      });
    }
  }

  // Sort by score (Jaccard-like similarity)
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

/**
 * Group cards by their primary sense categories
 */
export function groupBySenseCategory(cards: TitleCard[]): Map<string, TitleCard[]> {
  const groups = new Map<string, TitleCard[]>();

  for (const card of cards) {
    if (!card.senses || card.senses.length === 0) continue;

    // Use first sense as primary category
    const primarySense = card.senses[0];
    const word = primarySense.split('.')[0];

    if (!groups.has(word)) {
      groups.set(word, []);
    }
    groups.get(word)!.push(card);
  }

  return groups;
}
