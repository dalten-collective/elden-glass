'use client';

import { useState, useEffect, Suspense, useCallback, memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, FileText, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchResult {
  id: string;
  sentence: string;
  context: string;
  page: string;
  pageTitle: string;
  textToFind: string;
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
    if (searchInput.trim()) {
      router.push(buildUrl({ q: searchInput.trim(), page: 1 }) as '/search');
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
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif text-[var(--accent-gold)] mb-4">Search</h1>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search the site..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg text-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          <p className="text-sm text-[var(--text-tertiary)] mt-3">
            Search through all documents and pages. For title cards, use the{' '}
            <Link href="/gatherer" className="text-[var(--accent-gold)] hover:underline">
              Gatherer
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
            <p className="text-sm text-[var(--text-tertiary)] mb-6">
              Showing {(urlPage - 1) * 20 + 1}-{Math.min(urlPage * 20, total)} of {total} result
              {total !== 1 ? 's' : ''} for &quot;{urlQuery}&quot;
            </p>
            {results.map((result) => (
              <SearchResultItem key={result.id} result={result} query={urlQuery} />
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
            <FileText className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] mb-2">
              No results found for &quot;{urlQuery}&quot;
            </p>
            <p className="text-sm text-[var(--text-tertiary)]">
              Try different keywords or check your spelling
            </p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !urlQuery && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">
              Enter a search term to find content across the site
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const SearchResultItem = memo(function SearchResultItem({
  result,
  query,
}: {
  result: SearchResult;
  query: string;
}) {
  const textFragment = encodeURIComponent(result.textToFind);
  const href = `${result.page}#:~:text=${textFragment}`;

  return (
    <Link
      href={href as any}
      className="block p-4 -mx-4 rounded-lg hover:bg-[var(--bg-secondary)] transition group"
    >
      {/* Page Title */}
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4 text-[var(--accent-gold)]" />
        <span className="text-sm font-medium text-[var(--accent-gold)]">{result.pageTitle}</span>
        <ArrowRight className="h-3 w-3 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition" />
      </div>

      {/* Matched Sentence */}
      <p className="text-[var(--text-primary)] mb-1">{highlightMatch(result.sentence, query)}</p>

      {/* Context */}
      <p className="text-sm text-[var(--text-tertiary)] line-clamp-2">{result.context}</p>
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
    <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[var(--border-subtle)]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-[var(--text-tertiary)]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] h-10 rounded-lg border transition ${
              page === currentPage
                ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]'
                : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition"
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
      <mark
        key={index}
        className="bg-[var(--accent-gold)]/30 text-[var(--text-primary)] px-0.5 rounded"
      >
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
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-9 w-32 bg-[var(--bg-primary)] rounded animate-pulse mb-4" />
          <div className="h-14 w-full bg-[var(--bg-primary)] rounded-lg animate-pulse" />
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
      <div className="h-4 w-32 bg-[var(--bg-secondary)] rounded mb-3" />
      <div className="h-5 w-full bg-[var(--bg-secondary)] rounded mb-2" />
      <div className="h-4 w-3/4 bg-[var(--bg-secondary)] rounded" />
    </div>
  );
}
