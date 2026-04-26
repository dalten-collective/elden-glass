'use client';

/**
 * SealStrip — the mobile top chrome.
 *
 * Three columns: [seal] [where-you-are] [menu]. A thin gold progress rule
 * runs immediately below the strip. Tapping "menu" opens a sheet whose
 * contents are the Stair (desktop sidebar) rendered full-height.
 *
 * The "where" copy is currently derived from the active page label found
 * in the navigation tree. No section-index at the moment — that arrives
 * when the stair learns about page headings.
 */

import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import type { NavItem, SiteNavigation } from '@/lib/sidebar';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StairNav } from './stair';

type SealStripProps = {
  navigation: SiteNavigation;
  /** Optional bottom-of-stair seal — forwarded to the sheet's StairNav. */
  stairSeal?: React.ComponentProps<typeof StairNav>['seal'];
};

export function SealStrip({ navigation, stairSeal }: SealStripProps) {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  const where = useMemo(() => findActiveNode(navigation, pathname), [navigation, pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.pointerEvents = '';
    }
  }, [open]);

  useEffect(() => {
    const restoreAfterPageShow = () => {
      setOpen(false);
      document.body.style.pointerEvents = '';
    };

    window.addEventListener('pageshow', restoreAfterPageShow);

    return () => {
      window.removeEventListener('pageshow', restoreAfterPageShow);
      document.body.style.pointerEvents = '';
    };
  }, []);

  // Progress tick — how far through the primary stack the reader is.
  const progress = useMemo(() => {
    const total = navigation.primary.length;
    if (total === 0) return 0;
    const idx = navigation.primary.findIndex((item) => !item.external && item.href === where.href);
    if (idx < 0) return 0;
    return ((idx + 1) / total) * 100;
  }, [navigation.primary, where.href]);

  return (
    <>
      <div className="seal-strip">
        <div className="ss-seal" aria-hidden="true" />
        <div className="ss-where">
          {where.section && <span className="ss-section">{where.section}</span>}
          <span className="ss-title">{where.title}</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="ss-menu"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              menu
            </button>
          </SheetTrigger>
          <SheetContent className="w-[min(26rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] p-0">
            <SheetTitle className="sr-only">Elden Glass Navigation</SheetTitle>
            <div onClick={(event) => handleSheetNav(event, () => setOpen(false))}>
              <StairNav
                navigation={navigation}
                seal={stairSeal}
                onSearchNavigate={(navigate) => {
                  setOpen(false);
                  window.setTimeout(navigate, 180);
                }}
                onSearchResultNavigate={(navigate) => {
                  setOpen(false);
                  window.setTimeout(navigate, 180);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="seal-progress" aria-hidden="true">
        <div className="fill" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
}

// Close the sheet whenever the user taps a navigation link inside it. The
// handler lives on a wrapper around StairNav so the stair doesn't need to
// know about the sheet.
function handleSheetNav(event: React.MouseEvent<HTMLDivElement>, close: () => void) {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  if (target.closest('a[href]')) {
    close();
  }
}

type WhereCopy = { section: ReactNode | null; title: ReactNode; href: string };

function findActiveNode(navigation: SiteNavigation, pathname: string): WhereCopy {
  const primaryIndex = navigation.primary.findIndex(
    (item) => !item.external && matchesPath(item.href, pathname)
  );
  if (primaryIndex >= 0) {
    const item = navigation.primary[primaryIndex];
    return {
      section: `§ ${String(primaryIndex).padStart(2, '0')}`,
      title: item.label,
      href: item.href,
    };
  }

  const deep = findDeepActive(navigation.secondary, pathname, null);
  if (deep) return deep;

  return {
    section: null,
    title: pathname === '/' ? 'Home' : 'Elden Glass',
    href: pathname,
  };
}

function findDeepActive(
  items: NavItem[],
  pathname: string,
  sectionLabel: string | null
): WhereCopy | null {
  for (const item of items) {
    if (item.type === 'link') {
      if (!item.external && matchesPath(item.href, pathname)) {
        return { section: sectionLabel, title: item.label, href: item.href };
      }
      continue;
    }

    const nextLabel = item.type === 'section' ? item.label : sectionLabel;
    const inside = findDeepActive(item.children, pathname, nextLabel);
    if (inside) return inside;
  }
  return null;
}

function matchesPath(href: string, pathname: string): boolean {
  const normalized = href.split('#')[0].split('?')[0];
  if (normalized === '/') return pathname === '/';
  return pathname === normalized || pathname.startsWith(`${normalized}/`);
}
