'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { SidebarLink } from './sidebar-link';
import type { NavGroupItem, NavItem, NavSectionItem, SiteNavigation } from './site-navigation';

interface NavigationMenuProps {
  navigation: SiteNavigation;
  onNavigate?: () => void;
  className?: string;
}

/**
 * Shared recursive navigation renderer used by both the desktop sidebar and
 * the mobile sheet drawer.
 */
export function NavigationMenu({ navigation, onNavigate, className }: NavigationMenuProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    collectOpenSections(navigation.secondary, pathname)
  );

  useEffect(() => {
    const activeSections = collectOpenSections(navigation.secondary, pathname);
    setOpenSections((previous) => ({ ...previous, ...activeSections }));
  }, [navigation.secondary, pathname]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId],
    }));
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2 border-b border-[var(--border-subtle)] pb-4">
        {navigation.primary.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            label={link.label}
            meta={link.meta}
            external={link.external}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[var(--accent-gold)]">
          {navigation.secondaryLabel}
        </p>
      </div>

      {renderItems({
        items: navigation.secondary,
        onNavigate,
        onToggleSection: toggleSection,
        openSections,
      })}
    </div>
  );
}

function renderItems({
  items,
  onNavigate,
  onToggleSection,
  openSections,
  level = 0,
}: {
  items: NavItem[];
  onNavigate?: () => void;
  onToggleSection: (sectionId: string) => void;
  openSections: Record<string, boolean>;
  level?: number;
}) {
  return (
    <div
      className={cn('space-y-3', level > 0 && 'ml-3 border-l border-[var(--border-subtle)] pl-3')}
    >
      {items.map((item) => {
        if (item.type === 'link') {
          return (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              meta={item.meta}
              external={item.external}
              onNavigate={onNavigate}
            />
          );
        }

        if (item.type === 'group') {
          return (
            <NavigationGroup
              key={`${level}-group-${item.children.map(getItemKey).join('-')}`}
              item={item}
              level={level}
              onNavigate={onNavigate}
              onToggleSection={onToggleSection}
              openSections={openSections}
            />
          );
        }

        return (
          <NavigationSection
            key={item.id}
            item={item}
            level={level}
            onNavigate={onNavigate}
            onToggleSection={onToggleSection}
            openSections={openSections}
          />
        );
      })}
    </div>
  );
}

function NavigationGroup({
  item,
  level,
  onNavigate,
  onToggleSection,
  openSections,
}: {
  item: NavGroupItem;
  level: number;
  onNavigate?: () => void;
  onToggleSection: (sectionId: string) => void;
  openSections: Record<string, boolean>;
}) {
  return renderItems({
    items: item.children,
    onNavigate,
    onToggleSection,
    openSections,
    level: level + 1,
  });
}

function NavigationSection({
  item,
  level,
  onNavigate,
  onToggleSection,
  openSections,
}: {
  item: NavSectionItem;
  level: number;
  onNavigate?: () => void;
  onToggleSection: (sectionId: string) => void;
  openSections: Record<string, boolean>;
}) {
  const isOpen = !!openSections[item.id];

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggleSection(item.id)}
        aria-expanded={isOpen}
        className="mb-2 flex w-full items-center gap-1 text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
      >
        {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span>{item.label}</span>
      </button>

      {isOpen && (
        <>
          {item.children.length ? (
            renderItems({
              items: item.children,
              onNavigate,
              onToggleSection,
              openSections,
              level: level + 1,
            })
          ) : item.emptyLabel ? (
            <p className="ml-3 text-sm text-[var(--text-tertiary)]">{item.emptyLabel}</p>
          ) : null}
        </>
      )}
    </div>
  );
}

function collectOpenSections(items: NavItem[], pathname: string): Record<string, boolean> {
  return items.reduce<Record<string, boolean>>((accumulator, item) => {
    if (item.type === 'link') {
      return accumulator;
    }

    if (item.type === 'group') {
      return {
        ...accumulator,
        ...collectOpenSections(item.children, pathname),
      };
    }

    const childSections = collectOpenSections(item.children, pathname);
    const shouldOpen = item.children.some((child) => itemMatchesPath(child, pathname));

    return {
      ...accumulator,
      ...childSections,
      [item.id]: shouldOpen,
    };
  }, {});
}

function itemMatchesPath(item: NavItem, pathname: string): boolean {
  if (item.type === 'link') {
    return !item.external && item.href.split('#')[0] === pathname;
  }

  if (item.type === 'group') {
    return item.children.some((child) => itemMatchesPath(child, pathname));
  }

  return item.children.some((child) => itemMatchesPath(child, pathname));
}

function getItemKey(item: NavItem): string {
  if (item.type === 'link') {
    return item.href;
  }

  if (item.type === 'section') {
    return item.id;
  }

  return item.children.map(getItemKey).join('-');
}
