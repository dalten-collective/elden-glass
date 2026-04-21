'use client';

/**
 * Stair — the site's pataphysical staircase.
 *
 * Every row on the stair carries a single § marker. Inactive rows render
 * in paper-dimmer; the row that matches the reader's path renders the §
 * in bold gold. No numbered rungs, no mixed glyphs, no square nodes —
 * the voice is scholarly-serif apparatus end to end.
 *
 * Secondary sections ("Pataphysics", "Duchamp", etc.) are collapsible.
 * A section auto-opens when the reader's path is inside it, and can be
 * toggled manually via its chevron. Nested sections recurse with the
 * same rules.
 */

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { GlobalSearch } from '@/components/site/global-search';
import type { NavItem, NavLinkItem, NavSectionItem, SiteNavigation } from '@/lib/sidebar';
import { EthSeal } from './seal';

type StairSealCopy = {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
};

type StairNavProps = {
  navigation: SiteNavigation;
  /** Optional bottom-of-stair seal — e.g. "LIVING · THESIS / Updated Apr 21". */
  seal?: StairSealCopy;
};

// Single marker for every rung and section header. Changing the glyph
// in one place ripples through the whole stair.
const RUNG_MARKER = '§';

export function StairNav({ navigation, seal }: StairNavProps) {
  const pathname = usePathname() ?? '/';

  return (
    <div className="stair">
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          marginBottom: 14,
        }}
      >
        <Image
          src="/images/dashusnavnulsigil.png"
          alt=""
          width={40}
          height={40}
          style={{ opacity: 0.85, flexShrink: 0 }}
        />
        <span className="stair-brand">
          <i>Elden Ring</i> is
          <br />
          The Large Glass
        </span>
      </Link>

      <div className="stair-sub">
        ~dashus-navnul · <b>thesis index</b>
      </div>

      <div style={{ margin: '0 0 24px', paddingRight: 8 }}>
        <GlobalSearch variant="sidebar" />
      </div>

      {navigation.primary.map((item) => (
        <LinkRung key={item.href} link={item} currentPath={pathname} />
      ))}

      {navigation.secondary.length > 0 && (
        <>
          <div className="stair-section-label">{navigation.secondaryLabel}</div>
          {navigation.secondary.map((item) => (
            <SecondaryEntry key={keyForItem(item)} item={item} currentPath={pathname} />
          ))}
        </>
      )}

      {seal && (
        <div className="stair-seal">
          <EthSeal size={40} />
          <div className="sealed-kv">
            <span className="k">{seal.label}</span>
            <span className="v">{seal.value}</span>
            {seal.sub && (
              <span className="v" style={{ color: 'var(--paper-dimmer)' }}>
                {seal.sub}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Rungs — plain navigation links
// ─────────────────────────────────────────────────────────────

function LinkRung({ link, currentPath }: { link: NavLinkItem; currentPath: string }) {
  const isActive = !link.external && matchesPath(link.href, currentPath);
  const cls = ['stair-rung', isActive && 'active'].filter(Boolean).join(' ');

  return (
    <Link
      href={link.href as never}
      className={cls}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="num" aria-hidden="true">
        {RUNG_MARKER}
      </span>
      <div className="body">
        <div className="title">{link.label}</div>
        {link.meta && <div className="kind">{link.meta}</div>}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Secondary entries — links delegate to LinkRung; sections render as
// collapsible groups; groups (a non-visible wrapper from lib/sidebar)
// flatten through.
// ─────────────────────────────────────────────────────────────

function SecondaryEntry({ item, currentPath }: { item: NavItem; currentPath: string }) {
  if (item.type === 'link') {
    return <LinkRung link={item} currentPath={currentPath} />;
  }
  if (item.type === 'group') {
    return (
      <>
        {item.children.map((child) => (
          <SecondaryEntry key={keyForItem(child)} item={child} currentPath={currentPath} />
        ))}
      </>
    );
  }
  return <SectionGroup section={item} currentPath={currentPath} />;
}

function SectionGroup({ section, currentPath }: { section: NavSectionItem; currentPath: string }) {
  // A section auto-opens when any of its descendants matches the active
  // path. If the reader navigates into or out of the section, we re-sync
  // with the auto state — but we never stomp a user's manual toggle
  // while they stay inside the section.
  const hasActive = useMemo(
    () => section.children.some((child) => itemMatchesPath(child, currentPath)),
    [section.children, currentPath]
  );
  const [open, setOpen] = useState(hasActive);

  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  const headerCls = ['stair-group-header', hasActive && 'has-active'].filter(Boolean).join(' ');

  return (
    <div>
      <button
        type="button"
        className={headerCls}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="num" aria-hidden="true">
          {RUNG_MARKER}
        </span>
        <span className="title">{section.label}</span>
        <ChevronDown className="chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="stair-group-children">
          {section.children.length === 0 ? (
            <div className="stair-empty">{section.emptyLabel ?? 'Nothing here yet.'}</div>
          ) : (
            section.children.map((child) => (
              <SecondaryEntry key={keyForItem(child)} item={child} currentPath={currentPath} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function matchesPath(href: string, pathname: string): boolean {
  const normalized = href.split('#')[0].split('?')[0];
  if (normalized === '/') return pathname === '/';
  return pathname === normalized || pathname.startsWith(`${normalized}/`);
}

function itemMatchesPath(item: NavItem, pathname: string): boolean {
  if (item.type === 'link') {
    return !item.external && matchesPath(item.href, pathname);
  }
  if (item.type === 'group') {
    return item.children.some((child) => itemMatchesPath(child, pathname));
  }
  return item.children.some((child) => itemMatchesPath(child, pathname));
}

function keyForItem(item: NavItem): string {
  if (item.type === 'link') return item.href;
  if (item.type === 'section') return `section:${item.id}`;
  return `group:${item.children.map(keyForItem).join(',')}`;
}
