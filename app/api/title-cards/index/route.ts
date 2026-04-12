import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const indexPath = path.join(process.cwd(), 'data', 'title-cards-split', 'index.json');

// GET - Retrieve the title cards index (sections and categories)
export async function GET() {
  try {
    const data = fs.readFileSync(indexPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading title cards index:', error);
    return NextResponse.json({ error: 'Failed to read index' }, { status: 500 });
  }
}
