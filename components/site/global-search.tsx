'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookText } from 'lucide-react';
import { useTitleCards } from '@/components/title-cards/title-card-provider';

interface SearchResult {
  id: string;
  sentence: string;
  context: string;
  page: string;
  pageTitle: string;
  textToFind: string;
  type?: 'content' | 'titlecard';
  cardId?: string;
}

interface GlobalSearchProps {
  variant?: 'sidebar' | 'topbar';
}

export function GlobalSearch({ variant = 'topbar' }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showCardById } = useTitleCards();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        // Get top 8 results for dropdown preview
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true); // Always show dropdown when searching
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

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

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Go to search page
  const goToSearchPage = () => {
    if (query.trim()) {
      setIsOpen(false);
      setQuery('');
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
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

  const handleSelectResult = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');

    // Handle title card results - show the card popup
    if (result.type === 'titlecard' && result.cardId) {
      showCardById(result.cardId);
      return;
    }

    // Navigate to page with text fragment
    const textFragment = encodeURIComponent(result.textToFind);
    router.push(`${result.page}#:~:text=${textFragment}`);
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--accent-gold)] transition-colors z-10"
        >
          <Search className="h-4 w-4" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="Search the site..."
          className="w-full pl-10 pr-10 py-2 bg-[rgb(var(--bg-secondary-rgb)/0.5)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          className={
            variant === 'sidebar'
              ? 'fixed left-[280px] top-[120px] w-[500px] bg-[var(--bg-secondary)] border border-[var(--border-emphasis)] rounded-lg shadow-2xl overflow-hidden z-[100] max-h-[70vh] overflow-y-auto'
              : 'absolute top-full mt-2 w-full bg-[var(--bg-secondary)] border border-[var(--border-emphasis)] rounded-lg shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto'
          }
        >
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[var(--text-tertiary)]">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-[var(--text-tertiary)]">
              No results found
            </div>
          ) : (
            <div>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-3 border-b border-[var(--border-subtle)] last:border-b-0 transition-colors ${
                    index === selectedIndex
                      ? 'bg-[rgb(var(--accent-gold-rgb)/0.1)] border-l-2 border-l-[var(--accent-gold)]'
                      : 'hover:bg-[rgb(var(--bg-primary-rgb)/0.5)]'
                  }`}
                >
                  {/* Title Card badge or Page Title */}
                  <div className="flex items-center gap-2 mb-1">
                    {result.type === 'titlecard' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[rgb(var(--accent-gold-rgb)/0.2)] text-[var(--accent-gold)] text-[10px] uppercase tracking-[0.1em] font-medium rounded">
                        <BookText className="h-3 w-3" />
                        Definition
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--accent-gold)] font-light">
                        {result.pageTitle}
                      </span>
                    )}
                    {result.type === 'titlecard' && result.pageTitle && (
                      <span className="text-[10px] text-[var(--text-tertiary)]">
                        {result.pageTitle}
                      </span>
                    )}
                  </div>

                  {/* Sentence/Match */}
                  <div className="text-sm text-[var(--text-primary)] font-medium mb-1 line-clamp-2">
                    {highlightMatch(result.sentence, query)}
                  </div>

                  {/* Context */}
                  <div className="text-xs text-[var(--text-tertiary)] line-clamp-2">
                    {result.context}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Footer with keyboard shortcuts */}
          <div className="px-4 py-2 bg-[rgb(var(--bg-primary-rgb)/0.5)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
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

// Helper function to highlight matching text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-[var(--accent-gold)] text-[var(--bg-primary)] px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
