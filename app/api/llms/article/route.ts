import { NextResponse } from 'next/server';

import {
  getLlmReadableDocument,
  getLlmRouteByPath,
  LLM_ARTICLE_PAGE_SIZE_CHARS,
  paginateLlmDocument,
} from '@/lib/llms';

/**
 * Returns one page of raw MDX for a readable route from the LLM catalog.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const pageValue = searchParams.get('page') ?? '1';
  const page = Number.parseInt(pageValue, 10);

  if (!path) {
    return NextResponse.json(
      {
        error: 'missing_path',
        message: 'Query parameter "path" is required.',
      },
      { status: 400 }
    );
  }

  if (!Number.isInteger(page) || page < 1) {
    return NextResponse.json(
      {
        error: 'invalid_page',
        message: 'Query parameter "page" must be a positive integer.',
      },
      { status: 400 }
    );
  }

  const route = getLlmRouteByPath(path);

  if (!route) {
    return NextResponse.json(
      {
        error: 'unknown_path',
        message: `No LLM catalog entry exists for "${path}".`,
      },
      { status: 404 }
    );
  }

  if (!route.readable) {
    return NextResponse.json(
      {
        error: 'non_readable_path',
        message: `The route "${path}" is not retrievable through this endpoint.`,
        kind: route.kind,
        reason:
          route.kind === 'interactive'
            ? 'This route is interactive and does not have a stable MDX article body.'
            : 'This route is an index page and does not have a single canonical MDX article body.',
      },
      { status: 409 }
    );
  }

  const document = getLlmReadableDocument(path);

  if (!document) {
    return NextResponse.json(
      {
        error: 'unknown_path',
        message: `No readable MDX document exists for "${path}".`,
      },
      { status: 404 }
    );
  }

  const pages = paginateLlmDocument(document.content, LLM_ARTICLE_PAGE_SIZE_CHARS);
  const pageCount = pages.length;

  if (page > pageCount) {
    return NextResponse.json(
      {
        error: 'page_out_of_range',
        message: `Page ${page} does not exist for "${path}".`,
        pageCount,
      },
      { status: 404 }
    );
  }

  const content = pages[page - 1];
  const charStart = pages.slice(0, page - 1).reduce((sum, segment) => sum + segment.length, 0);
  const charEnd = charStart + content.length;

  return NextResponse.json({
    path: document.path,
    title: document.title,
    summary: document.summary,
    format: document.format,
    updated: document.updated,
    page,
    pageCount,
    pageSizeChars: LLM_ARTICLE_PAGE_SIZE_CHARS,
    charStart,
    charEnd,
    nextPage: page < pageCount ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    content,
  });
}
