import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SENSE_INDEX_PATH = join(process.cwd(), 'data/sense-index.json');

export async function GET() {
  try {
    if (!existsSync(SENSE_INDEX_PATH)) {
      return NextResponse.json({}, { status: 200 });
    }

    const data = readFileSync(SENSE_INDEX_PATH, 'utf-8');
    const index = JSON.parse(data);

    return NextResponse.json(index);
  } catch (error) {
    console.error('Error loading sense index:', error);
    return NextResponse.json({}, { status: 200 });
  }
}
