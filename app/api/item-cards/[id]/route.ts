import { NextResponse } from 'next/server';

import { getItemCardById, toPublicItemCard } from '@/lib/item-cards';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Returns one read-only item card by id.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const card = getItemCardById(id);

  if (!card) {
    return NextResponse.json({ error: 'Item card not found' }, { status: 404 });
  }

  return NextResponse.json({ card: toPublicItemCard(card) });
}
