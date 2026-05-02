'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookText } from 'lucide-react';
import { captureSearchResultClick, captureSearchSubmit } from '@/lib/analytics/browser-capture';
import { dispatchSearchTarget, savePendingSearchTarget } from '@/lib/search-navigation';

interface SearchResult {
  id: string;
  sentence: string;
  context: string;
  page: string;
  pageTitle: string;
  targetId?: string;
  type?: 'content' | 'itemcard';
  cardId?: string;
}

const SEARCH_PREVIEW_LIMIT = 8;
const SEARCH_PREVIEW_CANDIDATE_LIMIT = 64;
const SEARCH_PREVIEW_MAX_RESULTS_PER_PAGE = 2;

interface GlobalSearchProps {
  variant?: 'sidebar' | 'topbar';
  onSearchNavigate?: (navigate: () => void) => void;
  onResultNavigate?: (navigate: () => void) => void;
}

export function GlobalSearch({
  variant = 'topbar',
  onSearchNavigate,
  onResultNavigate,
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldShowPreview = variant !== 'sidebar' || Boolean(onResultNavigate);

  // Debounced search
  useEffect(() => {
    if (!shouldShowPreview || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=${SEARCH_PREVIEW_CANDIDATE_LIMIT}`
        );
        const data = await response.json();
        setResults(buildPreviewResults(data.results || []));
        setIsOpen(true); // Always show dropdown when searching
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, shouldShowPreview]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Go to search page
  const goToSearchPage = () => {
    const trimmed = query.trim();
    const destination = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search';

    if (trimmed) {
      captureSearchSubmit({ query: trimmed, via: 'global' });
    }

    const navigate = () => router.push(destination as any);

    if (trimmed) {
      setIsOpen(false);
      setQuery('');
    } else {
      setIsOpen(false);
    }

    if (onSearchNavigate) {
      onSearchNavigate(navigate);
      return;
    }

    navigate();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Always go to search page on Enter
      goToSearchPage();
      return;
    }

    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectResult = (result: SearchResult, rank: number) => {
    const submittedQuery = query;
    setIsOpen(false);
    setQuery('');

    const resultPath = result.type === 'itemcard' && result.cardId ? '/gatherer' : result.page;
    captureSearchResultClick({
      query: submittedQuery,
      resultPath,
      resultRank: rank,
      resultType: result.type === 'itemcard' ? 'itemcard' : 'content',
    });

    const navigate = () => {
      if (result.type === 'itemcard' && result.cardId) {
        router.push(
          `/gatherer?card=${encodeURIComponent(result.cardId)}&q=${encodeURIComponent(result.sentence)}`
        );
        return;
      }

      if (result.targetId) {
        if (window.location.pathname === result.page) {
          dispatchSearchTarget(result.targetId);
          return;
        }

        savePendingSearchTarget({ page: result.page, targetId: result.targetId });
        router.push(result.page as any, { scroll: false });
        return;
      }

      router.push(result.page as any);
    };

    if (onResultNavigate) {
      onResultNavigate(navigate);
      return;
    }

    navigate();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <button
          onClick={goToSearchPage}
          type="button"
          className="global-search-icon-button absolute left-3 top-1/2 z-10 -translate-y-1/2"
        >
          <Search className="h-4 w-4" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            shouldShowPreview && query.length >= 2 && results.length > 0 && setIsOpen(true)
          }
          placeholder="Search the site..."
          className="global-search-input w-full py-2 pl-10 pr-10 text-sm focus:outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="global-search-clear absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {shouldShowPreview && isOpen && (
        <div
          className={
            variant === 'sidebar'
              ? 'global-search-dropdown global-search-dropdown--sidebar absolute left-0 right-0 top-full z-[100] mt-2 max-h-[60vh] overflow-y-auto'
              : 'global-search-dropdown global-search-dropdown--topbar absolute top-full z-50 mt-2 max-h-[70vh] w-full overflow-hidden overflow-y-auto'
          }
        >
          {isLoading ? (
            <div className="global-search-empty p-4 text-center text-sm">Searching...</div>
          ) : results.length === 0 ? (
            <div className="global-search-empty p-4 text-center text-sm">No results found</div>
          ) : (
            <div>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result, index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`global-search-result w-full px-4 py-3 text-left ${
                    index === selectedIndex ? 'is-selected' : ''
                  }`}
                >
                  {/* Item Card badge or Page Title */}
                  <div className="flex items-center gap-2 mb-1">
                    {result.type === 'itemcard' ? (
                      <span className="global-search-badge inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]">
                        <BookText className="h-3 w-3" />
                        Definition
                      </span>
                    ) : (
                      <span className="global-search-result-page text-[10px] font-light uppercase tracking-[0.15em]">
                        {result.pageTitle}
                      </span>
                    )}
                    {result.type === 'itemcard' && result.pageTitle && (
                      <span className="global-search-result-meta text-[10px]">
                        {result.pageTitle}
                      </span>
                    )}
                  </div>

                  {/* Sentence/Match */}
                  <div className="global-search-result-sentence mb-1 line-clamp-2 text-sm font-medium">
                    {highlightMatch(result.sentence, query)}
                  </div>

                  {/* Context */}
                  <div className="global-search-result-context line-clamp-2 text-xs">
                    {result.context}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Footer with keyboard shortcuts */}
          <div className="global-search-footer flex items-center justify-between px-4 py-2 text-[10px]">
            {results.length > 0 ? (
              <>
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </>
            ) : (
              <span>↵ Enter to see all results</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function buildPreviewResults(results: SearchResult[]): SearchResult[] {
  const pageCounts = new Map<string, number>();
  const preview: SearchResult[] = [];

  for (const result of results) {
    const count = pageCounts.get(result.page) ?? 0;
    if (count >= SEARCH_PREVIEW_MAX_RESULTS_PER_PAGE) {
      continue;
    }

    pageCounts.set(result.page, count + 1);
    preview.push(result);

    if (preview.length >= SEARCH_PREVIEW_LIMIT) {
      return preview;
    }
  }

  return preview;
}

// Helper function to highlight matching text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="global-search-highlight px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
