import { NextResponse } from 'next/server';
import { searchContent, getSearchIndex } from '@/lib/search-index';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // Pagination params
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

  if (!query || query.length < 2) {
    return NextResponse.json({
      results: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 0
    });
  }

  // Get ALL matching results for total count
  const allResults = searchContent(query, 1000); // Get up to 1000 matches
  const total = allResults.length;
  const totalPages = Math.ceil(total / limit);

  // Apply pagination
  const start = (page - 1) * limit;
  const paginatedResults = allResults.slice(start, start + limit);

  return NextResponse.json({
    results: paginatedResults,
    total,
    page,
    limit,
    totalPages
  });
}
