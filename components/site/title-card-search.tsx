'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Database, X } from 'lucide-react';

export function TitleCardSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/gatherer?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/gatherer');
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--accent-gold)] transition-colors z-10"
          title="Search title cards in Gatherer"
        >
          <Database className="h-4 w-4" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Title Card Search"
          className="w-full pl-10 pr-10 py-2 bg-[rgb(var(--bg-secondary-rgb)/0.5)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] focus:border-transparent transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
    </div>
  );
}
