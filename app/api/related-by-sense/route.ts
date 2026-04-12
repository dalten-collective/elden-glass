import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { TitleCard } from '@/types/title-cards';

const TITLE_CARDS_PATH = join(process.cwd(), 'data/title-cards.json');
const SENSE_INDEX_PATH = join(process.cwd(), 'data/sense-index.json');

interface RelatedResult {
  sense: string;
  senseLabel: string;
  cards: Array<{
    id: string;
    title: string;
    category?: string;
  }>;
}

// Parse sense key for display
function getSenseLabel(senseKey: string): string {
  const match = senseKey.match(/^(.+)\.(n|v|a|r|s)\.(\d+)$/);
  if (!match) return senseKey;

  const posLabels: Record<string, string> = {
    n: 'noun',
    v: 'verb',
    a: 'adj',
    r: 'adv',
    s: 'adj'
  };

  return `${match[1]} (${posLabels[match[2]] || match[2]})`;
}

export async function GET(request: NextRequest) {
  const cardId = request.nextUrl.searchParams.get('id');

  if (!cardId) {
    return NextResponse.json({ error: 'Card ID required' }, { status: 400 });
  }

  try {
    // Load cards
    if (!existsSync(TITLE_CARDS_PATH)) {
      return NextResponse.json({ related: [] });
    }
    const cardsData = JSON.parse(readFileSync(TITLE_CARDS_PATH, 'utf-8'));
    const cards: TitleCard[] = cardsData.cards || cardsData;

    // Find the target card
    const targetCard = cards.find(c => c.id === cardId);
    if (!targetCard || !targetCard.senses || targetCard.senses.length === 0) {
      return NextResponse.json({ related: [] });
    }

    // Load sense index
    if (!existsSync(SENSE_INDEX_PATH)) {
      return NextResponse.json({ related: [] });
    }
    const senseIndex: Record<string, string[]> = JSON.parse(
      readFileSync(SENSE_INDEX_PATH, 'utf-8')
    );

    // Build card lookup
    const cardById = new Map(cards.map(c => [c.id, c]));

    // Find related cards for each sense
    const results: RelatedResult[] = [];

    for (const sense of targetCard.senses) {
      const relatedIds = senseIndex[sense] || [];
      const relatedCards = relatedIds
        .filter(id => id !== cardId)
        .map(id => cardById.get(id))
        .filter((c): c is TitleCard => c !== undefined)
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          title: c.title,
          category: c.category
        }));

      if (relatedCards.length > 0) {
        results.push({
          sense,
          senseLabel: getSenseLabel(sense),
          cards: relatedCards
        });
      }
    }

    // Sort by number of related cards
    results.sort((a, b) => b.cards.length - a.cards.length);

    // Take top 6 senses
    return NextResponse.json({ related: results.slice(0, 6) });
  } catch (error) {
    console.error('Error finding related cards:', error);
    return NextResponse.json({ related: [] });
  }
}
