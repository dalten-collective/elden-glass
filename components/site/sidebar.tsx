'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import type { SidebarData } from '@/lib/content';
import { GlobalSearch } from './global-search';
import { NavigationMenu } from './navigation-menu';
import { getSiteNavigation } from './site-navigation';

interface SidebarProps {
  data: SidebarData;
}

export function Sidebar({ data }: SidebarProps) {
  const navigation = useMemo(() => getSiteNavigation(data), [data]);

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-[70] hidden w-[280px] flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] pt-safe lg:flex">
      <div className="sticky top-0 flex-shrink-0 bg-[var(--bg-secondary)]">
        <Link href="/" className="flex items-center gap-3 border-b border-[var(--border-subtle)] p-3">
          <Image
            src="/images/dashusnavnulsigil.png"
            alt="DashusNavnul Sigil"
            width={48}
            height={48}
            className="flex-shrink-0 opacity-90"
          />
          <span className="font-mono text-base font-bold leading-none text-white whitespace-nowrap">
            ~dashus-navnul
          </span>
        </Link>

        <div className="border-b border-[var(--border-subtle)] p-4">
          <GlobalSearch variant="sidebar" />
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <nav className="px-4 py-6">
          <NavigationMenu navigation={navigation} />
        </nav>
      </div>
    </aside>
  );
}
