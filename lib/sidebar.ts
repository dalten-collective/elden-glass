import { existsSync, statSync } from 'fs';
import path from 'path';

import { getContentPageBySlug, getCritiques, type ContentPage } from '@/lib/content';
import {
  CONTENT_PAGES_DIR,
  getOrderedContentEntries,
  readLayoutConfig,
  type ContentEntry,
  type LayoutConfig,
  type LayoutLink,
} from '@/lib/content-tree';

export type NavLinkItem = {
  type: 'link';
  href: string;
  label: string;
  meta?: string;
  external?: boolean;
};

export type NavSectionItem = {
  type: 'section';
  id: string;
  label: string;
  children: NavItem[];
  emptyLabel?: string;
};

export type NavGroupItem = {
  type: 'group';
  children: NavItem[];
};

export type NavItem = NavLinkItem | NavSectionItem | NavGroupItem;

export type SiteNavigation = {
  primary: NavLinkItem[];
  secondaryLabel: string;
  secondary: NavItem[];
};

/**
 * Builds sidebar navigation from the content tree, using layout.yaml only for
 * ordering and injected link entries.
 */
export function buildSidebar(): SiteNavigation {
  const rootLayout = readLayoutConfig(CONTENT_PAGES_DIR);
  const rootEntries = getOrderedContentEntries(CONTENT_PAGES_DIR);
  const rootEntryMap = new Map(rootEntries.map((entry) => [entry.name, entry] as const));
  const primaryRootNames = getPrimaryRootNames(rootLayout, rootEntries);
  const primary: NavLinkItem[] = [];
  const secondary: NavItem[] = [];
  const consumed = new Set<string>();
  const orderedNames = getRootOrder(rootLayout.order);

  for (const name of orderedNames) {
    const item = buildRootItem(name, rootEntryMap.get(name), rootLayout.links[name]);

    if (!item) {
      continue;
    }

    consumed.add(name);

    if (isPrimaryRootItem(name, item, primaryRootNames)) {
      primary.push(item);
      continue;
    }

    secondary.push(item);
  }

  for (const entry of rootEntries) {
    if (consumed.has(entry.name)) {
      continue;
    }

    const item = buildRootItem(entry.name, entry);

    if (!item) {
      continue;
    }

    consumed.add(entry.name);

    if (isPrimaryRootItem(entry.name, item, primaryRootNames)) {
      primary.push(item);
      continue;
    }

    secondary.push(item);
  }

  for (const [name, link] of Object.entries(rootLayout.links).sort(([left], [right]) =>
    left.localeCompare(right)
  )) {
    if (consumed.has(name) || link.hidden) {
      continue;
    }

    const item = buildRootItem(name, undefined, link);

    if (!item) {
      continue;
    }

    consumed.add(name);

    if (isPrimaryRootItem(name, item, primaryRootNames)) {
      primary.push(item);
      continue;
    }

    secondary.push(item);
  }

  return {
    primary,
    secondaryLabel: 'Errata',
    secondary,
  };
}

/**
 * Resolves one root-level item into either a page link, a section, or an
 * injected/generative navigation node.
 */
function buildRootItem(name: string, entry?: ContentEntry, link?: LayoutLink): NavItem | null {
  if (name === 'home') {
    return { type: 'link', href: '/', label: 'Home Page' };
  }

  if (name === 'critiques') {
    return buildCritiquesSection();
  }

  if (link && !link.hidden) {
    return {
      type: 'link',
      href: link.href,
      label: link.label,
      external: link.external,
    };
  }

  if (entry?.kind === 'directory') {
    return buildSection(name);
  }

  if (entry?.kind === 'page') {
    return buildPageLink(name);
  }

  const folderPath = path.join(CONTENT_PAGES_DIR, name);

  if (existsSync(folderPath) && statSync(folderPath).isDirectory()) {
    return buildSection(name);
  }

  return buildPageLink(name);
}

/**
 * Builds a section recursively from a folder in content/pages/.
 */
function buildSection(folderSlug: string): NavSectionItem {
  const folderPath = path.join(CONTENT_PAGES_DIR, folderSlug);
  const layout = readLayoutConfig(folderPath);
  const entryMap = new Map(
    getOrderedContentEntries(folderPath).map((entry) => [entry.name, entry] as const)
  );
  const children: NavItem[] = [];
  const consumed = new Set<string>();

  for (const name of layout.order) {
    const item = buildSectionChild(folderSlug, entryMap.get(name), layout.links[name]);

    if (!item) {
      continue;
    }

    consumed.add(name);
    children.push(item);
  }

  for (const entry of Array.from(entryMap.values())) {
    if (consumed.has(entry.name)) {
      continue;
    }

    const item = buildSectionChild(folderSlug, entry);

    if (item) {
      children.push(item);
    }
  }

  for (const [name, link] of Object.entries(layout.links).sort(([left], [right]) =>
    left.localeCompare(right)
  )) {
    if (consumed.has(name) || link.hidden) {
      continue;
    }

    children.push({
      type: 'link',
      href: link.href,
      label: link.label,
      external: link.external,
    });
  }

  return {
    type: 'section',
    id: folderSlug,
    label: folderNameToLabel(path.basename(folderSlug)),
    children,
  };
}

/**
 * Resolves either a real filesystem child or an injected YAML link into a nav
 * item.
 */
function buildSectionChild(
  folderSlug: string,
  entry?: ContentEntry,
  link?: LayoutLink
): NavItem | null {
  if (link && !link.hidden) {
    return {
      type: 'link',
      href: link.href,
      label: link.label,
      external: link.external,
    };
  }

  if (!entry) {
    return null;
  }

  if (entry.kind === 'page') {
    return buildPageLink(`${folderSlug}/${entry.name}`);
  }

  return buildSection(`${folderSlug}/${entry.name}`);
}

function buildPageLink(slug: string): NavLinkItem | null {
  const doc = getContentPageBySlug(slug);

  if (!doc) {
    return null;
  }

  return {
    type: 'link',
    href: doc.url,
    label: doc.title,
    meta: getPrimaryMeta(doc),
  };
}

function buildCritiquesSection(): NavSectionItem {
  const critiques = getCritiques();

  return {
    type: 'section',
    id: 'critiques',
    label: 'Critiques',
    emptyLabel: 'No critiques yet.',
    children: [
      { type: 'link', href: '/critiques', label: 'Critiques Index' },
      ...critiques.map((critique) => ({
        type: 'link' as const,
        href: `/critiques/${critique.slug}`,
        label: critique.title,
      })),
    ],
  };
}

function getRootOrder(explicitOrder: string[]): string[] {
  if (explicitOrder.includes('home')) {
    return explicitOrder;
  }

  return ['home', ...explicitOrder];
}

function getPrimaryRootNames(layout: LayoutConfig, entries: ContentEntry[]): Set<string> {
  if (layout.primary.length) {
    return new Set(layout.primary);
  }

  const primaryNames = ['home'];

  for (const entry of entries) {
    if (entry.kind === 'page') {
      primaryNames.push(entry.name);
    }
  }

  return new Set(primaryNames);
}

function isPrimaryRootItem(
  name: string,
  item: NavItem,
  primaryRootNames: Set<string>
): item is NavLinkItem {
  return item.type === 'link' && primaryRootNames.has(name);
}

function getPrimaryMeta(doc: ContentPage): string | undefined {
  if (doc.navMeta) {
    return doc.navMeta;
  }

  if (doc.slug === 'living-thesis') {
    return formatShortDate(doc.updated);
  }

  if (doc.slug === 'master-list') {
    const count = doc.body.raw.match(/^- /gm)?.length ?? 0;
    return `${count} correspondences`;
  }

  if (doc.slug === 'tldr' && doc.bitcoinOts) {
    return 'Bitcoin';
  }

  if (doc.slug === 'initial-thesis' && doc.ethereumAttestation) {
    return 'Ethereum';
  }

  return undefined;
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

function folderNameToLabel(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
