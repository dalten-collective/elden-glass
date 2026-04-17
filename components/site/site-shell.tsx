import type { ReactNode } from 'react';

import { getContentPageBySlug } from '@/lib/content';
import { buildSidebar } from '@/lib/sidebar';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ScrollToText } from './scroll-to-text';

export async function SiteShell({ children }: { children: ReactNode }) {
  const navigation = buildSidebar();
  const livingThesis = getContentPageBySlug('living-thesis');

  if (!livingThesis) {
    throw new Error('Missing required content page living-thesis under content/pages/.');
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <ScrollToText />
      <Sidebar navigation={navigation} />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-[280px]">
        <TopBar navigation={navigation} livingThesisUpdatedIso={livingThesis.updated} />
        <main className="flex-1 px-4 py-10 lg:px-16">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
