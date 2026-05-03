'use client';

import { useState, useEffect, useCallback, memo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Database,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ItemCard } from '@/types/item-cards';
import { CardDetailModal } from '@/components/item-cards/card-detail-modal';
import { captureItemCardOpen } from '@/lib/analytics/browser-capture';

const CARDS_PER_PAGE = 48;

interface ApiResponse {
  cards: ItemCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sections: string[];
  categories: string[];
  subcategories: string[];
}

interface CardResponse {
  card?: ItemCard;
  error?: string;
}

const SHOW_LOCAL_FEDWIKI_LINK = process.env.NODE_ENV === 'development';

function isApiResponse(value: unknown): value is ApiResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ApiResponse>;
  return (
    Array.isArray(candidate.cards) &&
    typeof candidate.total === 'number' &&
    typeof candidate.page === 'number' &&
    typeof candidate.limit === 'number' &&
    typeof candidate.totalPages === 'number' &&
    Array.isArray(candidate.sections) &&
    Array.isArray(candidate.categories) &&
    Array.isArray(candidate.subcategories)
  );
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
  const urlCardId = searchParams.get('card') || '';

  // Local input state (for debouncing)
  const [searchInput, setSearchInput] = useState(urlQuery);

  // API response state
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCard, setSelectedCard] = useState<ItemCard | null>(null);

  // Update URL with new params
  const updateUrl = useCallback(
    (params: Record<string, string | number | undefined>) => {
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
    },
    [router, urlQuery, urlPage, urlSection, urlCategory, urlSubcategory, urlSource]
  );

  const updateSelectedCardUrl = useCallback(
    (cardId: string | null) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (cardId) {
        newParams.set('card', cardId);
      } else {
        newParams.delete('card');
      }

      const queryString = newParams.toString();
      window.history.replaceState(null, '', queryString ? `/gatherer?${queryString}` : '/gatherer');
    },
    [searchParams]
  );

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

        const response = await fetch(`/api/item-cards?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch cards');

        const result = await response.json();
        if (!isApiResponse(result)) {
          throw new Error('Item card API returned an unexpected response shape');
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [urlQuery, urlPage, urlSection, urlCategory, urlSubcategory, urlSource]);

  useEffect(() => {
    if (!urlCardId) {
      setSelectedCard(null);
      return;
    }

    if (selectedCard?.id === urlCardId) {
      return;
    }

    const pageCard = data?.cards.find((card) => card.id === urlCardId);
    if (pageCard) {
      captureItemCardOpen({
        cardId: pageCard.id,
        cardSection: pageCard.section ?? null,
        cardCategory: pageCard.category ?? null,
        cardSubcategory: pageCard.subcategory ?? null,
        source: 'deep_link',
      });
      setSelectedCard(pageCard);
      return;
    }

    const controller = new AbortController();

    async function fetchSelectedCard() {
      try {
        const response = await fetch(`/api/item-cards/${encodeURIComponent(urlCardId)}`, {
          signal: controller.signal,
        });
        const result = (await response.json()) as CardResponse;

        if (response.ok && result.card) {
          const fetched = result.card;
          captureItemCardOpen({
            cardId: fetched.id,
            cardSection: fetched.section ?? null,
            cardCategory: fetched.category ?? null,
            cardSubcategory: fetched.subcategory ?? null,
            source: 'deep_link',
          });
          setSelectedCard(fetched);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        console.error('Failed to fetch selected item card:', err);
      }
    }

    fetchSelectedCard();

    return () => controller.abort();
  }, [data?.cards, selectedCard?.id, urlCardId]);

  // Filter handlers that reset cascading filters
  const handleSectionChange = (section: string) => {
    updateUrl({
      section: section || undefined,
      category: undefined,
      subcategory: undefined,
      page: 1,
    });
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

  const handleCardClick = useCallback(
    (card: ItemCard) => {
      captureItemCardOpen({
        cardId: card.id,
        cardSection: card.section ?? null,
        cardCategory: card.category ?? null,
        cardSubcategory: card.subcategory ?? null,
        source: 'gatherer_grid',
      });
      setSelectedCard(card);
      updateSelectedCardUrl(card.id);
    },
    [updateSelectedCardUrl]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="dig-page-band px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="dig-page-title mb-2 text-4xl">Item Cards</h1>
          <p className="dig-muted">
            Browse and search {data?.total?.toLocaleString() || '...'} structured item cards
          </p>
          {SHOW_LOCAL_FEDWIKI_LINK && (
            <a
              href="http://localhost:3000/assets/gatherer.html"
              target="_blank"
              rel="noopener noreferrer"
              className="dig-link mt-3 inline-flex items-center gap-2 text-sm"
            >
              <Globe className="h-4 w-4" />
              Open local Federated Wiki export
            </a>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="dig-muted absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cards by name, term, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="dig-input dig-input--subtle w-full py-3 pl-10 pr-4 focus:outline-none"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="dig-icon-button absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`dig-control-button flex items-center gap-2 px-4 py-3 ${
              showFilters || hasActiveFilters ? 'is-active' : ''
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Filters{hasActiveFilters ? ' •' : ''}</span>
            <ChevronDown className={`h-4 w-4 transition ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="dig-control-panel mb-6 p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {/* Section Filter */}
              <div>
                <label className="dig-muted mb-1 block text-[0.65rem] uppercase tracking-wider sm:mb-2 sm:text-xs">
                  Section
                </label>
                <select
                  value={urlSection}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className="dig-select w-full rounded px-2 py-1.5 text-sm focus:outline-none sm:rounded-lg sm:px-3 sm:py-2"
                >
                  <option value="">All Sections</option>
                  {data?.sections?.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="dig-muted mb-1 block text-[0.65rem] uppercase tracking-wider sm:mb-2 sm:text-xs">
                  Category
                </label>
                <select
                  value={urlCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="dig-select w-full rounded px-2 py-1.5 text-sm focus:outline-none sm:rounded-lg sm:px-3 sm:py-2"
                >
                  <option value="">All Categories</option>
                  {data?.categories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              <div>
                <label className="dig-muted mb-1 block text-[0.65rem] uppercase tracking-wider sm:mb-2 sm:text-xs">
                  Subcategory
                </label>
                <select
                  value={urlSubcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="dig-select w-full rounded px-2 py-1.5 text-sm focus:outline-none sm:rounded-lg sm:px-3 sm:py-2"
                >
                  <option value="">All Subcategories</option>
                  {data?.subcategories?.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="dig-muted mb-1 block text-[0.65rem] uppercase tracking-wider sm:mb-2 sm:text-xs">
                  Source
                </label>
                <select
                  value={urlSource}
                  onChange={(e) => handleSourceChange(e.target.value)}
                  className="dig-select w-full rounded px-2 py-1.5 text-sm focus:outline-none sm:rounded-lg sm:px-3 sm:py-2"
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
              <div className="mt-3 border-t border-[var(--pane-edge)] pt-3 sm:mt-4 sm:pt-4">
                <label className="dig-muted mb-2 block text-[0.65rem] uppercase tracking-wider sm:text-xs">
                  Quick Filters
                </label>
                <div className="-mx-3 flex max-h-11 gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:max-h-none sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                  {data.sections.map((section) => (
                    <button
                      key={section}
                      onClick={() => handleSectionChange(section === urlSection ? '' : section)}
                      className={`dig-filter-chip shrink-0 px-3 py-1 text-xs sm:py-1.5 sm:text-sm ${
                        urlSection === section ? 'is-active' : ''
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasActiveFilters && (
              <div className="mt-4 flex items-center justify-between border-t border-[var(--pane-edge)] pt-4">
                <span className="dig-muted text-sm">
                  {data
                    ? `Showing ${data.cards.length} of ${data.total.toLocaleString()} matching cards`
                    : 'Loading...'}
                </span>
                <button onClick={clearFilters} className="dig-link text-sm">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="dig-error mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="dig-link">
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
              <div className="dig-muted text-sm">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    Showing {(data.page - 1) * CARDS_PER_PAGE + 1}–
                    {Math.min(data.page * CARDS_PER_PAGE, data.total)} of{' '}
                    {data.total.toLocaleString()} cards
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
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${loading ? 'opacity-50' : ''}`}
            >
              {data.cards.map((card) => (
                <CardTile key={card.id} card={card} onClick={handleCardClick} />
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
                <Database className="dig-link mx-auto mb-6 h-16 w-16 opacity-30" />
                <p className="dig-muted mb-4">No cards match your filters</p>
                <button onClick={clearFilters} className="dig-link">
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
          onClose={() => {
            setSelectedCard(null);
            updateSelectedCardUrl(null);
          }}
        />
      )}
    </div>
  );
}

// Full page skeleton for Suspense fallback
function GathererSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="dig-page-band px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="dig-skeleton mb-2 h-10 w-48 animate-pulse" />
          <div className="dig-skeleton h-5 w-72 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="dig-skeleton mb-6 h-12 w-full animate-pulse" />
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
const CardTile = memo(function CardTile({
  card,
  onClick,
}: {
  card: ItemCard;
  onClick: (card: ItemCard) => void;
}) {
  const isDLC = card.source === 'dlc';
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [card.image]);

  return (
    <button
      onClick={() => onClick(card)}
      className={`text-left bg-[var(--bg-secondary)] border rounded-lg p-4 transition-all duration-150 hover:shadow-lg hover:scale-[1.02] group ${
        isDLC
          ? 'border-[var(--accent-red)]/30 hover:border-[var(--accent-red)]'
          : 'border-[var(--accent-gold)]/30 hover:border-[var(--accent-gold)]'
      }`}
    >
      {card.image && !imageFailed && (
        <div className="relative w-full h-32 mb-3 rounded overflow-hidden bg-[var(--bg-primary)]">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-contain"
            loading="lazy"
            onError={() => setImageFailed(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      )}

      <h3
        className={`font-serif text-lg group-hover:underline mb-1 line-clamp-1 ${
          isDLC ? 'text-[var(--accent-red)]' : 'text-[var(--accent-gold)]'
        }`}
      >
        {card.title}
      </h3>

      <div className="text-xs text-[var(--text-tertiary)] mb-2 line-clamp-1">
        {card.category}
        {card.subcategory && ` — ${card.subcategory}`}
      </div>

      <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{card.description || ''}</p>

      {card.source && (
        <div
          className={`mt-3 inline-block px-2 py-0.5 rounded text-xs ${
            isDLC
              ? 'bg-[var(--accent-red)]/10 text-[var(--accent-red)]'
              : 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]'
          }`}
        >
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
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
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
        className="dig-page-button p-2 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="dig-muted px-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`dig-page-button dig-page-button--solid-active h-9 min-w-[36px] text-sm font-medium ${
              currentPage === page ? 'is-active' : ''
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="dig-page-button p-2 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
