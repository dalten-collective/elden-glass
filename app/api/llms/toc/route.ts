import { NextResponse } from 'next/server';

import { getLlmRoutes } from '@/lib/llms';

/**
 * Returns the machine-readable site inventory for LLM clients.
 */
export async function GET() {
  return NextResponse.json({
    site: 'Elden Glass',
    generatedAt: new Date().toISOString(),
    entries: getLlmRoutes(),
  });
}
