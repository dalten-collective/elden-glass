import { NextResponse } from 'next/server';
import { searchItemCards } from '@/lib/search-index';
import { getItemCards, toPublicItemCard } from '@/lib/item-cards';

export const dynamic = 'force-dynamic';

// GET - Retrieve item cards with server-side filtering and pagination.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '48', 10)));

    // Filter params
    const query = searchParams.get('q')?.toLowerCase() || '';
    const section = searchParams.get('section') || '';
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const source = searchParams.get('source') || '';

    // Special param to get just metadata (sections, categories, etc.)
    const metaOnly = searchParams.get('meta') === 'true';

    const allCards = getItemCards();
    let cards = allCards;

    // If meta only, return filter options quickly
    if (metaOnly) {
      const sections = Array.from(new Set(cards.map((c) => c.section).filter(Boolean))).sort();
      return NextResponse.json({
        total: cards.length,
        sections,
      });
    }

    // Apply filters
    if (query) {
      cards = searchItemCards(query);
    }

    if (section) {
      cards = cards.filter((card) => card.section === section);
    }

    if (category) {
      cards = cards.filter((card) => card.category === category);
    }

    if (subcategory) {
      cards = cards.filter((card) => card.subcategory === subcategory);
    }

    if (source) {
      if (source === 'base') {
        cards = cards.filter((card) => card.source === 'base');
      } else if (source === 'dlc') {
        cards = cards.filter((card) => card.source === 'dlc');
      } else if (source === 'other') {
        cards = cards.filter((card) => card.source !== 'base' && card.source !== 'dlc');
      }
    }

    // Get totals before pagination
    const total = cards.length;
    const totalPages = Math.ceil(total / limit);

    // Get unique values for filter dropdowns (from filtered results where appropriate)
    const sections = Array.from(new Set(allCards.map((c) => c.section).filter(Boolean))).sort();

    // Categories depend on section filter
    const cardsForCategories = section ? allCards.filter((c) => c.section === section) : allCards;
    const categories = Array.from(
      new Set(cardsForCategories.map((c) => c.category).filter(Boolean))
    ).sort();

    // Subcategories depend on section and category filter
    let cardsForSubcategories = allCards;
    if (section) cardsForSubcategories = cardsForSubcategories.filter((c) => c.section === section);
    if (category)
      cardsForSubcategories = cardsForSubcategories.filter((c) => c.category === category);
    const subcategories = Array.from(
      new Set(cardsForSubcategories.map((c) => c.subcategory).filter(Boolean))
    ).sort();

    // Apply pagination
    const start = (page - 1) * limit;
    const paginatedCards = cards.slice(start, start + limit);

    return NextResponse.json({
      cards: paginatedCards.map(toPublicItemCard),
      total,
      page,
      limit,
      totalPages,
      sections,
      categories,
      subcategories,
    });
  } catch (error) {
    console.error('Error retrieving item cards:', error);
    return NextResponse.json({ error: 'Failed to retrieve item cards' }, { status: 500 });
  }
}
