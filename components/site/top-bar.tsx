import Link from 'next/link';
import { Search } from 'lucide-react';

import { MobileSidebar } from './mobile-sidebar';
import { TopBarActions } from './top-bar-actions';
import type { SidebarData } from '@/lib/content';

interface TopBarProps {
  data: SidebarData;
}

export function TopBar({ data }: TopBarProps) {
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-4 lg:py-6 relative z-[60]">
      {/* Desktop: Title with actions */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between gap-4">
          <MobileSidebar data={data} />
          <Link href="/" className="flex-1 text-center">
            <span className="text-3xl xl:text-4xl font-serif text-[var(--accent-gold)] leading-tight">
              Elden Ring is Marcel Duchamp&apos;s The Bride Stripped Bare by her Bachelors, Even
            </span>
          </Link>
          <TopBarActions updatedIso={data.livingThesis.updated} />
        </div>
      </div>

      {/* Mobile: Stacked layout */}
      <div className="lg:hidden space-y-1">
        {/* Top row: Menu, name and search */}
        <div className="flex items-stretch gap-2">
          <div className="border border-[var(--border-subtle)] rounded-lg p-0.5 flex items-center">
            <MobileSidebar data={data} />
          </div>
          <div className="flex-1 flex flex-col justify-end gap-1">
            <div className="font-mono font-bold text-white text-2xl leading-none whitespace-nowrap">
              ~dashus-navnul
            </div>
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-2 bg-[rgb(var(--bg-secondary-rgb)/0.5)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)] transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search the site...</span>
            </Link>
          </div>
        </div>

        {/* Title */}
        <Link href="/" className="block font-serif text-[var(--accent-gold)] leading-tight text-center text-4xl pb-2 text-4xl">
          Elden Ring Is Marcel Duchamp&apos;s <em>The Bride Stripped Bare By Her Bachelors, Even</em>
        </Link>
      </div>
    </header>
  );
}
