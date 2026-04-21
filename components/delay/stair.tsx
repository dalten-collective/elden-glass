'use client';

/**
 * Stair — the desktop sidebar as a pataphysical staircase.
 *
 * Each primary thesis page is a numbered rung on a hairline rail. The
 * reader's position is a gold node; pages whose href sits before the
 * active page render in the `done` state (dimmed rail node). Secondary
 * sections stack below, each under a small gold label.
 *
 * Data source is the existing `SiteNavigation` produced by buildSidebar().
 * No kinds in this first pass — adding a `navKind` frontmatter field to
 * ContentPage is a natural follow-up that would slot into this component
 * without structural change.
 */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';

import type { NavItem, NavLinkItem, SiteNavigation } from '@/lib/sidebar';
import { GlobalSearch } from '@/components/site/global-search';
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

export function StairNav({ navigation, seal }: StairNavProps) {
  const pathname = usePathname() ?? '/';

  // Which primary rung is active — rungs before it render `done`.
  const activePrimaryIndex = useMemo(
    () =>
      navigation.primary.findIndex((item) => !item.external && matchesPath(item.href, pathname)),
    [navigation.primary, pathname]
  );

  return (
    <div className="stair">
      {/* rail runs the full height of the stair */}
      <div className="stair-rail" aria-hidden="true" />

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

      {navigation.primary.map((item, index) => (
        <PrimaryRung
          key={item.href}
          item={item}
          index={index}
          activeIndex={activePrimaryIndex}
          currentPath={pathname}
        />
      ))}

      {navigation.secondary.length > 0 && (
        <>
          <div className="stair-section-label">{navigation.secondaryLabel}</div>
          {navigation.secondary.map((item) => (
            <SecondaryItem key={keyForItem(item)} item={item} currentPath={pathname} />
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

function PrimaryRung({
  item,
  index,
  activeIndex,
  currentPath,
}: {
  item: NavLinkItem;
  index: number;
  activeIndex: number;
  currentPath: string;
}) {
  const isActive = activeIndex === index;
  const isDone = activeIndex > -1 && index < activeIndex;
  const cls = ['stair-rung', isActive && 'active', isDone && 'done'].filter(Boolean).join(' ');

  const num = String(index).padStart(2, '0');

  return (
    <Link
      href={item.href as never}
      className={cls}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      // `aria-current` uses "page" for the single active rung so screen
      // readers announce the stair's notion of "where you are."
      aria-current={isActive ? 'page' : undefined}
      data-path={currentPath}
    >
      <span className="num">{num}</span>
      <div className="body">
        <div className="title">{item.label}</div>
        {item.meta && (
          <div className="kind" style={{ fontStyle: 'normal', fontSize: 11 }}>
            {item.meta}
          </div>
        )}
      </div>
    </Link>
  );
}

function SecondaryItem({ item, currentPath }: { item: NavItem; currentPath: string }) {
  if (item.type === 'link') {
    return <SecondaryLink link={item} currentPath={currentPath} />;
  }

  if (item.type === 'group') {
    return (
      <>
        {item.children.map((child) => (
          <SecondaryItem key={keyForItem(child)} item={child} currentPath={currentPath} />
        ))}
      </>
    );
  }

  // section: label + recursive children
  const isSectionActive = item.children.some((child) => itemMatchesPath(child, currentPath));
  const cls = ['stair-rung', isSectionActive && 'active'].filter(Boolean).join(' ');

  return (
    <div className={cls} role="group" aria-label={item.label}>
      <span className="num" aria-hidden="true">
        §
      </span>
      <div className="body">
        <div className="title">{item.label}</div>
        <ul className="stair-sub-list">
          {item.children.length > 0 ? (
            item.children.map((child) => (
              <SectionSubItem key={keyForItem(child)} item={child} currentPath={currentPath} />
            ))
          ) : (
            <li style={{ fontStyle: 'italic' }}>{item.emptyLabel ?? 'Nothing here yet.'}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function SecondaryLink({ link, currentPath }: { link: NavLinkItem; currentPath: string }) {
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
        —
      </span>
      <div className="body">
        <div className="title">{link.label}</div>
      </div>
    </Link>
  );
}

function SectionSubItem({ item, currentPath }: { item: NavItem; currentPath: string }): ReactNode {
  if (item.type === 'link') {
    const isActive = !item.external && matchesPath(item.href, currentPath);
    const cls = isActive ? 'active' : undefined;
    return (
      <li className={cls}>
        <Link
          href={item.href as never}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          aria-current={isActive ? 'page' : undefined}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  if (item.type === 'group') {
    return (
      <>
        {item.children.map((child) => (
          <SectionSubItem key={keyForItem(child)} item={child} currentPath={currentPath} />
        ))}
      </>
    );
  }

  // Nested section — render label + nested list.
  return (
    <li>
      <span
        className="spec"
        style={{ display: 'block', color: 'var(--paper-dimmer)', marginTop: 6 }}
      >
        {item.label}
      </span>
      <ul className="stair-sub-list" style={{ marginTop: 4 }}>
        {item.children.map((child) => (
          <SectionSubItem key={keyForItem(child)} item={child} currentPath={currentPath} />
        ))}
      </ul>
    </li>
  );
}

function matchesPath(href: string, pathname: string): boolean {
  const normalizedHref = href.split('#')[0].split('?')[0];
  if (normalizedHref === '/') return pathname === '/';
  // Exact match is the stair's default semantic; subpages belonging to a
  // primary page would count as that primary rung being active.
  return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
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
