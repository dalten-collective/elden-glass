import type { ReactNode } from 'react';

import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ScrollToText } from './scroll-to-text';
import { getSidebarData } from '@/lib/content';

export async function SiteShell({ children }: { children: ReactNode }) {
  const data = getSidebarData();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <ScrollToText />
      <Sidebar data={data} />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-[280px]">
        <TopBar data={data} />
        <main className="flex-1 px-4 py-10 lg:px-16">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
