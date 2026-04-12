import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { TitleCardDatabase, TitleCard, CreateTitleCardRequest } from '@/types/title-cards';

export const dynamic = 'force-dynamic';

const titleCardsPath = path.join(process.cwd(), 'data', 'title-cards.json');

function readDatabase(): TitleCardDatabase {
  try {
    const data = fs.readFileSync(titleCardsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading title cards:', error);
    return { cards: [] };
  }
}

function writeDatabase(db: TitleCardDatabase): void {
  fs.writeFileSync(titleCardsPath, JSON.stringify(db, null, 2), 'utf-8');
}

// GET - Retrieve title cards with server-side filtering and pagination
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

    const db = readDatabase();
    let cards = db.cards;

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
      cards = cards.filter(
        (card) =>
          (card.title && card.title.toLowerCase().includes(query)) ||
          (card.term && card.term.toLowerCase().includes(query)) ||
          (card.description && card.description.toLowerCase().includes(query))
      );
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
    const allCards = db.cards;
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
      cards: paginatedCards,
      total,
      page,
      limit,
      totalPages,
      sections,
      categories,
      subcategories,
    });
  } catch (error) {
    console.error('Error retrieving title cards:', error);
    return NextResponse.json({ error: 'Failed to retrieve title cards' }, { status: 500 });
  }
}

// POST - Create a new title card
export async function POST(request: Request) {
  try {
    const body: CreateTitleCardRequest = await request.json();

    // Validate required fields
    if (!body.term || !body.title || !body.description || !body.scope) {
      return NextResponse.json(
        { error: 'Missing required fields: term, title, description, and scope are required' },
        { status: 400 }
      );
    }

    const db = readDatabase();

    // Create new card
    const newCard: TitleCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      term: body.term.toLowerCase(), // Store lowercase for case-insensitive matching
      scope: body.scope,
      instanceId: body.instanceId,
      title: body.title,
      description: body.description,
      image: body.image,
      images: (body as any).images,
      section: (body as any).section,
      category: (body as any).category,
      subcategory: (body as any).subcategory,
      links: body.links || [],
      isSplit: (body as any).isSplit,
      splitCardIds: (body as any).splitCardIds,
      headerPopup: (body as any).headerPopup,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.cards.push(newCard);
    writeDatabase(db);

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error('Error creating title card:', error);
    return NextResponse.json({ error: 'Failed to create title card' }, { status: 500 });
  }
}

// DELETE - Delete a title card by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const db = readDatabase();
    const initialLength = db.cards.length;
    db.cards = db.cards.filter((card) => card.id !== id);

    if (db.cards.length === initialLength) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    writeDatabase(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting title card:', error);
    return NextResponse.json({ error: 'Failed to delete title card' }, { status: 500 });
  }
}

// PUT - Replace all title cards (bulk save)
export async function PUT(request: Request) {
  try {
    const cards: TitleCard[] = await request.json();

    if (!Array.isArray(cards)) {
      return NextResponse.json(
        { error: 'Request body must be an array of cards' },
        { status: 400 }
      );
    }

    const db: TitleCardDatabase = { cards };
    writeDatabase(db);

    return NextResponse.json({ success: true, count: cards.length });
  } catch (error) {
    console.error('Error saving title cards:', error);
    return NextResponse.json({ error: 'Failed to save title cards' }, { status: 500 });
  }
}

// PATCH - Update a title card
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const db = readDatabase();
    const cardIndex = db.cards.findIndex((card) => card.id === id);

    if (cardIndex === -1) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Update the card
    db.cards[cardIndex] = {
      ...db.cards[cardIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writeDatabase(db);
    return NextResponse.json(db.cards[cardIndex]);
  } catch (error) {
    console.error('Error updating title card:', error);
    return NextResponse.json({ error: 'Failed to update title card' }, { status: 500 });
  }
}
