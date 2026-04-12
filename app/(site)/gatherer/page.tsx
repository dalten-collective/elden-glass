'use client';

import { useState, useEffect, useCallback, memo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, Filter, X, ChevronDown, Database, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TitleCard } from '@/types/title-cards';
import { CardDetailModal } from '@/components/title-cards/card-detail-modal';

const CARDS_PER_PAGE = 48;

interface ApiResponse {
  cards: TitleCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sections: string[];
  categories: string[];
  subcategories: string[];
}

// Wrap in Suspense for useSearchParams
export default function GathererPage() {
  return (
    <Suspense fallback={<GathererSkeleton />}>
      <GathererContent />
    </Suspense>
  );
}

function GathererContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL
  const urlQuery = searchParams.get('q') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const urlSection = searchParams.get('section') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlSubcategory = searchParams.get('subcategory') || '';
  const urlSource = searchParams.get('source') || '';

  // Local input state (for debouncing)
  const [searchInput, setSearchInput] = useState(urlQuery);

  // API response state
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TitleCard | null>(null);

  // Update URL with new params
  const updateUrl = useCallback((params: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams();

    // Merge current params with new ones
    const current = {
      q: urlQuery,
      page: urlPage,
      section: urlSection,
      category: urlCategory,
      subcategory: urlSubcategory,
      source: urlSource,
      ...params,
    };

    // Only add non-empty params
    if (current.q) newParams.set('q', String(current.q));
    if (current.page && current.page !== 1) newParams.set('page', String(current.page));
    if (current.section) newParams.set('section', String(current.section));
    if (current.category) newParams.set('category', String(current.category));
    if (current.subcategory) newParams.set('subcategory', String(current.subcategory));
    if (current.source) newParams.set('source', String(current.source));

    const queryString = newParams.toString();
    router.push(queryString ? `/gatherer?${queryString}` : '/gatherer', { scroll: false });
  }, [router, urlQuery, urlPage, urlSection, urlCategory, urlSubcategory, urlSource]);

  // Debounce search input -> URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlQuery) {
        updateUrl({ q: searchInput, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, urlQuery, updateUrl]);

  // Sync input with URL on external changes
  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  // Fetch data when URL params change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('page', String(urlPage));
        params.set('limit', String(CARDS_PER_PAGE));
        if (urlQuery) params.set('q', urlQuery);
        if (urlSection) params.set('section', urlSection);
        if (urlCategory) params.set('category', urlCategory);
        if (urlSubcategory) params.set('subcategory', urlSubcategory);
        if (urlSource) params.set('source', urlSource);

        const response = await fetch(`/api/title-cards?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch cards');

        const result: ApiResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [urlQuery, urlPage, urlSection, urlCategory, urlSubcategory, urlSource]);

  // Filter handlers that reset cascading filters
  const handleSectionChange = (section: string) => {
    updateUrl({ section: section || undefined, category: undefined, subcategory: undefined, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    updateUrl({ category: category || undefined, subcategory: undefined, page: 1 });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    updateUrl({ subcategory: subcategory || undefined, page: 1 });
  };

  const handleSourceChange = (source: string) => {
    updateUrl({ source: source || undefined, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchInput('');
    router.push('/gatherer', { scroll: false });
  };

  const hasActiveFilters = urlQuery || urlSection || urlCategory || urlSubcategory || urlSource;

  const handleCardClick = useCallback((card: TitleCard) => {
    setSelectedCard(card);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif text-[var(--accent-gold)] mb-2">Gatherer</h1>
          <p className="text-[var(--text-secondary)]">
            Browse and search {data?.total?.toLocaleString() || '...'} title cards in the database
          </p>
          <a
            href="http://localhost:3000/assets/gatherer.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-sm text-[var(--accent-gold)] hover:underline"
          >
            <Globe className="h-4 w-4" />
            Open in Federated Wiki
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search cards by name, term, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition ${
              showFilters || hasActiveFilters
                ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Filters{hasActiveFilters ? ' •' : ''}</span>
            <ChevronDown className={`h-4 w-4 transition ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Section Filter */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                  Section
                </label>
                <select
                  value={urlSection}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                >
                  <option value="">All Sections</option>
                  {data?.sections?.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                  Category
                </label>
                <select
                  value={urlCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                >
                  <option value="">All Categories</option>
                  {data?.categories?.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                  Subcategory
                </label>
                <select
                  value={urlSubcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                >
                  <option value="">All Subcategories</option>
                  {data?.subcategories?.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                  Source
                </label>
                <select
                  value={urlSource}
                  onChange={(e) => handleSourceChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                >
                  <option value="">All Sources</option>
                  <option value="base">Base Game</option>
                  <option value="dlc">Shadow of the Erdtree</option>
                  <option value="other">Other (Duchamp, References)</option>
                </select>
              </div>
            </div>

            {/* Quick Section Filters */}
            {data?.sections && data.sections.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                  Quick Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  {data.sections.map(section => (
                    <button
                      key={section}
                      onClick={() => handleSectionChange(section === urlSection ? '' : section)}
                      className={`px-3 py-1.5 rounded-full text-sm transition ${
                        urlSection === section
                          ? 'bg-[var(--accent-gold)] text-black'
                          : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">
                  {data ? `Showing ${data.cards.length} of ${data.total.toLocaleString()} matching cards` : 'Loading...'}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--accent-gold)] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[var(--accent-gold)] hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State with Skeleton */}
        {loading && !data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {data && !error && (
          <>
            {/* Results Header with Pagination */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-[var(--text-secondary)]">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    Showing {((data.page - 1) * CARDS_PER_PAGE) + 1}–{Math.min(data.page * CARDS_PER_PAGE, data.total)} of {data.total.toLocaleString()} cards
                  </>
                )}
              </div>
              {data.totalPages > 1 && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>

            {/* Card Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${loading ? 'opacity-50' : ''}`}>
              {data.cards.map(card => (
                <CardTile
                  key={card.id}
                  card={card}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {/* Bottom Pagination */}
            {data.totalPages > 1 && data.cards.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* No Results */}
            {data.cards.length === 0 && !loading && (
              <div className="text-center py-20">
                <Database className="h-16 w-16 text-[var(--accent-gold)]/30 mx-auto mb-6" />
                <p className="text-[var(--text-secondary)] mb-4">No cards match your filters</p>
                <button
                  onClick={clearFilters}
                  className="text-[var(--accent-gold)] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Card Detail Modal — read-only view */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}

// Full page skeleton for Suspense fallback
function GathererSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-48 bg-[var(--bg-primary)] rounded animate-pulse mb-2" />
          <div className="h-5 w-72 bg-[var(--bg-primary)] rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="h-12 w-full bg-[var(--bg-secondary)] rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Memoized Card Tile
const CardTile = memo(function CardTile({ card, onClick }: { card: TitleCard; onClick: (card: TitleCard) => void }) {
  const isDLC = card.source === 'dlc';

  return (
    <button
      onClick={() => onClick(card)}
      className={`text-left bg-[var(--bg-secondary)] border rounded-lg p-4 transition-all duration-150 hover:shadow-lg hover:scale-[1.02] group ${
        isDLC ? 'border-[var(--accent-red)]/30 hover:border-[var(--accent-red)]' : 'border-[var(--accent-gold)]/30 hover:border-[var(--accent-gold)]'
      }`}
    >
      {card.image && (
        <div className="relative w-full h-32 mb-3 rounded overflow-hidden bg-[var(--bg-primary)]">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-contain"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      )}

      <h3 className={`font-serif text-lg group-hover:underline mb-1 line-clamp-1 ${
        isDLC ? 'text-[var(--accent-red)]' : 'text-[var(--accent-gold)]'
      }`}>
        {card.title}
      </h3>

      <div className="text-xs text-[var(--text-tertiary)] mb-2 line-clamp-1">
        {card.category}{card.subcategory && ` — ${card.subcategory}`}
      </div>

      <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
        {card.description || ''}
      </p>

      {card.source && (
        <div className={`mt-3 inline-block px-2 py-0.5 rounded text-xs ${
          isDLC
            ? 'bg-[var(--accent-red)]/10 text-[var(--accent-red)]'
            : 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]'
        }`}>
          {isDLC ? 'DLC' : 'Base Game'}
        </div>
      )}
    </button>
  );
});

// Skeleton loader
function CardSkeleton() {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-4 animate-pulse">
      <div className="w-full h-32 mb-3 rounded bg-[var(--bg-primary)]" />
      <div className="h-5 w-3/4 bg-[var(--bg-primary)] rounded mb-2" />
      <div className="h-3 w-1/2 bg-[var(--bg-primary)] rounded mb-3" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-[var(--bg-primary)] rounded" />
        <div className="h-3 w-full bg-[var(--bg-primary)] rounded" />
        <div className="h-3 w-2/3 bg-[var(--bg-primary)] rounded" />
      </div>
    </div>
  );
}

// Pagination
function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, i) => (
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[var(--text-tertiary)]">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`min-w-[36px] h-9 rounded text-sm font-medium transition ${
              currentPage === page
                ? 'bg-[var(--accent-gold)] text-black'
                : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
            }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
