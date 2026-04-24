import type { ReactNode } from 'react';

import { SealStrip } from '@/components/delay/seal-strip';
import { StairNav } from '@/components/delay/stair';
import { getContentPageBySlug } from '@/lib/content';
import { formatShortDate } from '@/lib/dates';
import { buildSidebar } from '@/lib/sidebar';

/**
 * SiteShell — the desktop Stair + mobile Seal Strip that wraps every
 * `(site)` route. Desktop gets a fixed-width stair on the left; mobile
 * gets a seal strip with a sheet that opens the stair.
 *
 * The `seal` passed to the Stair surfaces the Living Thesis's last update
 * as the scholarly "sealed" marker at the bottom of the rail.
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const navigation = buildSidebar();
  const livingThesis = getContentPageBySlug('living-thesis');

  if (!livingThesis) {
    throw new Error('Missing required content page living-thesis under content/pages/.');
  }

  const updatedLabel = formatShortDate(livingThesis.updated);
  const stairSeal = {
    label: 'Living · Thesis',
    value: (
      <>
        Updated <span style={{ color: 'var(--paper)' }}>{updatedLabel}</span>
      </>
    ),
    sub: 'sealed · eth + btc',
  };

  return (
    <div className="min-h-screen">
      {/* Desktop stair — fixed rail */}
      <aside
        className="scrollbar-thin fixed bottom-0 left-0 top-0 z-[70] hidden w-[300px] flex-col overflow-y-auto border-r border-[var(--pane-edge)] pt-safe lg:flex"
        aria-label="Site navigation"
      >
        <StairNav navigation={navigation} seal={stairSeal} />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-[300px]">
        {/* Mobile seal strip — sticky so the menu stays reachable deep
            into long-read scrolls. `pt-safe` keeps the strip below any
            notch; the ink background extends up into the safe-area so
            the status-bar region stays on the same ground. */}
        <header
          className="sticky top-0 z-[60] pt-safe lg:hidden"
          style={{ background: 'var(--ink)' }}
        >
          <SealStrip navigation={navigation} stairSeal={stairSeal} />
        </header>

        <main className="flex-1 px-4 py-10 lg:px-16">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
