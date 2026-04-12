import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const catalogPath = path.join(process.cwd(), 'data', 'title-cards-split', 'index.json');

// GET - Retrieve the title cards catalog (sections and categories)
export async function GET() {
  try {
    const data = fs.readFileSync(catalogPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading title cards catalog:', error);
    return NextResponse.json({ error: 'Failed to read catalog' }, { status: 500 });
  }
}
