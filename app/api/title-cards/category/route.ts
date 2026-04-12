import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const splitDir = path.join(process.cwd(), 'data', 'title-cards-split');

// GET - Retrieve title cards for a specific category file
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 });
    }

    // Validate filename to prevent directory traversal
    if (file.includes('..') || file.includes('/') || !file.endsWith('.json')) {
      return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
    }

    const filePath = path.join(splitDir, file);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Category file not found' }, { status: 404 });
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading category file:', error);
    return NextResponse.json({ error: 'Failed to read category' }, { status: 500 });
  }
}
