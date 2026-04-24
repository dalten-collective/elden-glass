import { NextResponse } from 'next/server';

import { getTitleCardById, toPublicTitleCard } from '@/lib/title-cards';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Returns one read-only title card by id.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const card = getTitleCardById(id);

  if (!card) {
    return NextResponse.json({ error: 'Title card not found' }, { status: 404 });
  }

  return NextResponse.json({ card: toPublicTitleCard(card) });
}
