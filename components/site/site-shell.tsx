import type { ReactNode } from 'react';

import { SealStrip } from '@/components/delay/seal-strip';
import { StairNav } from '@/components/delay/stair';
import { getContentPageBySlug } from '@/lib/content';
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
        {/* Mobile seal strip — carries the menu on phones */}
        <header className="lg:hidden">
          <SealStrip navigation={navigation} stairSeal={stairSeal} />
        </header>

        <main className="flex-1 px-4 py-10 lg:px-16">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function formatShortDate(iso: string): string {
  const dateOnly = iso.split('T')[0];
  const [, monthStr, dayStr] = dateOnly.split('-');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthIndex = Number(monthStr) - 1;
  const day = Number(dayStr);
  return `${months[monthIndex] ?? ''} ${day}`;
}
