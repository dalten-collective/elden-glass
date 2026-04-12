import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { TitleCardDatabase } from '@/types/title-cards';

const titleCardsPath = path.join(process.cwd(), 'data', 'title-cards.json');

/**
 * Unpaginated title-card lookup for the rollover system.
 *
 * Why this exists separately from `/api/title-cards`:
 *
 * The paginated `/api/title-cards` endpoint is designed for the /gatherer
 * browsing UI, where a user is flipping through a grid of cards and the
 * server caps `limit` at 100 to keep each page cheap. The TitleCardProvider,
 * on the other hand, needs every card in memory at once so that the
 * document-level mouseover handler can resolve any `data-card-id` attribute
 * in any rendered MDX paragraph to a card payload. Trying to share one
 * endpoint between the two conflated those use cases and silently truncated
 * the rollover lookups to the first 100 cards of ~3,800, breaking every
 * title-card rollover on every content page.
 *
 * This endpoint returns the full card set with no pagination and no
 * filtering. Consumers should load it once per page and use it as a
 * client-side lookup table.
 */
export async function GET() {
  try {
    const data = fs.readFileSync(titleCardsPath, 'utf-8');
    const db: TitleCardDatabase = JSON.parse(data);
    return NextResponse.json({ cards: db.cards });
  } catch (error) {
    console.error('Error reading title cards:', error);
    return NextResponse.json({ cards: [] }, { status: 500 });
  }
}
