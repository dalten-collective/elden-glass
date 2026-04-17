'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface VocabSearchProps {
  placeholder?: string;
}

export function VocabSearch({ placeholder = 'Filter vocabulary...' }: VocabSearchProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Get all table rows in the vocab sections
    const tables = document.querySelectorAll('table');
    const lowerQuery = query.toLowerCase().trim();

    tables.forEach((table) => {
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        const text = row.textContent?.toLowerCase() || '';
        if (lowerQuery === '' || text.includes(lowerQuery)) {
          (row as HTMLElement).style.display = '';
        } else {
          (row as HTMLElement).style.display = 'none';
        }
      });

      // Show/hide table headers based on if any rows are visible
      const visibleRows = table.querySelectorAll('tbody tr:not([style*="display: none"])');
      const tableContainer = table.closest('.space-y-4');
      if (tableContainer) {
        if (visibleRows.length === 0 && lowerQuery !== '') {
          (tableContainer as HTMLElement).style.display = 'none';
        } else {
          (tableContainer as HTMLElement).style.display = '';
        }
      }
    });

    // Also filter section headers
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      const visibleTables = section.querySelectorAll('.space-y-4:not([style*="display: none"])');
      if (visibleTables.length === 0 && lowerQuery !== '') {
        (section as HTMLElement).style.opacity = '0.3';
      } else {
        (section as HTMLElement).style.opacity = '1';
      }
    });

    // Filter DefinitionItem cards (for pages like /vocab that render
    // definitions as DefinitionItem components rather than markdown tables).
    const definitionItems = document.querySelectorAll('[data-definition-item]');
    definitionItems.forEach((item) => {
      const text = item.textContent?.toLowerCase() || '';
      if (lowerQuery === '' || text.includes(lowerQuery)) {
        (item as HTMLElement).style.display = '';
      } else {
        (item as HTMLElement).style.display = 'none';
      }
    });
  }, [query]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
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
      {query && (
        <p className="absolute -bottom-6 left-0 text-xs text-[var(--text-tertiary)]">
          Filtering by &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}
