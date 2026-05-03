'use client';

import { useState, useEffect, Suspense, useCallback, memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, FileText, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { captureSearchResultClick, captureSearchSubmit } from '@/lib/analytics/browser-capture';

interface SearchResult {
  id: string;
  sentence: string;
  context: string;
  page: string;
  pageTitle: string;
  targetId?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const urlQuery = searchParams.get('q') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sync input with URL on mount/change
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  // Build URL from params
  const buildUrl = useCallback(
    (params: { q?: string; page?: number }) => {
      const newParams = new URLSearchParams();
      const query = params.q ?? urlQuery;
      const page = params.page ?? urlPage;

      if (query) newParams.set('q', query);
      if (page > 1) newParams.set('page', String(page));

      const queryString = newParams.toString();
      return queryString ? `/search?${queryString}` : '/search';
    },
    [urlQuery, urlPage]
  );

  // Fetch results when URL params change
  useEffect(() => {
    if (!urlQuery) {
      setResults([]);
      setTotal(0);
      setTotalPages(0);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('q', urlQuery);
        params.set('page', String(urlPage));
        params.set('limit', '20');

        const response = await fetch(`/api/search?${params.toString()}`);
        if (response.ok) {
          const data: SearchResponse = await response.json();
          setResults(data.results);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [urlQuery, urlPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      captureSearchSubmit({ query: trimmed, via: 'page' });
      router.push(buildUrl({ q: trimmed, page: 1 }) as '/search');
    } else {
      router.push('/search');
    }
  };

  const handleClear = () => {
    setSearchInput('');
    router.push('/search');
  };

  const handlePageChange = (newPage: number) => {
    router.push(buildUrl({ page: newPage }) as '/search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="dig-page-band px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="dig-page-title mb-4">Search</h1>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <Search className="dig-muted absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search the site..."
              autoFocus
              className="dig-input w-full py-4 pl-12 pr-12 text-lg focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="dig-icon-button absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          <p className="dig-muted mt-3 text-sm">
            Search through all documents and pages. For item cards, use{' '}
            <Link href="/gatherer" className="dig-link">
              Item Cards
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ResultSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results List */}
        {!loading && results.length > 0 && (
          <div className="space-y-1">
            <p className="dig-muted mb-6 text-sm">
              Showing {(urlPage - 1) * 20 + 1}-{Math.min(urlPage * 20, total)} of {total} result
              {total !== 1 ? 's' : ''} for &quot;{urlQuery}&quot;
            </p>
            {results.map((result, index) => (
              <SearchResultItem
                key={result.id}
                result={result}
                query={urlQuery}
                rank={(urlPage - 1) * 20 + index}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={urlPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && urlQuery && results.length === 0 && (
          <div className="text-center py-16">
            <FileText className="dig-muted mx-auto mb-4 h-12 w-12" />
            <p className="dig-copy mb-2">No results found for &quot;{urlQuery}&quot;</p>
            <p className="dig-muted text-sm">Try different keywords or check your spelling</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !urlQuery && (
          <div className="text-center py-16">
            <Search className="dig-muted mx-auto mb-4 h-12 w-12" />
            <p className="dig-copy">Enter a search term to find content across the site</p>
          </div>
        )}
      </div>
    </div>
  );
}

const SearchResultItem = memo(function SearchResultItem({
  result,
  query,
  rank,
}: {
  result: SearchResult;
  query: string;
  rank: number;
}) {
  const href = result.targetId ? `${result.page}#${result.targetId}` : result.page;

  return (
    <Link
      href={href as any}
      onClick={() =>
        captureSearchResultClick({
          query,
          resultPath: result.page,
          resultRank: rank,
          resultType: 'content',
        })
      }
      className="dig-hover-row group -mx-4 block p-4"
    >
      {/* Page Title */}
      <div className="flex items-center gap-2 mb-2">
        <FileText className="dig-link h-4 w-4" />
        <span className="dig-link text-sm font-medium">{result.pageTitle}</span>
        <ArrowRight className="dig-muted h-3 w-3 opacity-0 transition group-hover:opacity-100" />
      </div>

      {/* Matched Sentence */}
      <p className="dig-copy mb-1">{highlightMatch(result.sentence, query)}</p>

      {/* Context */}
      <p className="dig-muted line-clamp-2 text-sm">{result.context}</p>
    </Link>
  );
});

const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="dig-pagination mt-8 flex items-center justify-center gap-2 pt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="dig-page-button p-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="dig-muted px-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`dig-page-button h-10 min-w-[40px] ${
              page === currentPage ? 'is-active' : ''
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="dig-page-button p-2"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
});

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="dig-highlight px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="dig-page-band px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="dig-skeleton mb-4 h-9 w-32 animate-pulse" />
          <div className="dig-skeleton h-14 w-full animate-pulse" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ResultSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="dig-skeleton mb-3 h-4 w-32" />
      <div className="dig-skeleton mb-2 h-5 w-full" />
      <div className="dig-skeleton h-4 w-3/4" />
    </div>
  );
}
