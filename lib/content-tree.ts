import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';

export const CONTENT_PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

export type ContentEntry = {
  kind: 'directory' | 'page';
  name: string;
};

export type LayoutLink = {
  href: string;
  label: string;
  external?: boolean;
  hidden?: boolean;
};

export type LayoutConfig = {
  primary: string[];
  order: string[];
  hidden: string[];
  links: Record<string, LayoutLink>;
};

/**
 * Returns the first content page slug within a folder, using layout.yaml order
 * when present and alphabetical fallback otherwise.
 */
export function getFirstContentPageSlugInFolder(folderSlug: string): string | null {
  const normalizedSlug = folderSlug.replace(/^\/+|\/+$/g, '');
  const folderPath = path.join(CONTENT_PAGES_DIR, normalizedSlug);

  if (!existsSync(folderPath) || !statSync(folderPath).isDirectory()) {
    return null;
  }

  return getFirstContentPageSlugFromDirectory(folderPath, normalizedSlug);
}

/**
 * Finds the first reachable content page from a directory by walking ordered
 * entries until a page is found.
 */
function getFirstContentPageSlugFromDirectory(
  directoryPath: string,
  directorySlug: string
): string | null {
  const entries = getOrderedContentEntries(directoryPath);

  for (const entry of entries) {
    if (entry.kind === 'page') {
      return `${directorySlug}/${entry.name}`;
    }

    const nestedSlug = `${directorySlug}/${entry.name}`;
    const nestedPath = path.join(directoryPath, entry.name);
    const nestedFirstPage = getFirstContentPageSlugFromDirectory(nestedPath, nestedSlug);

    if (nestedFirstPage) {
      return nestedFirstPage;
    }
  }

  return null;
}

/**
 * Lists a directory's content pages and subdirectories in layout order when
 * specified, otherwise alphabetically.
 */
export function getOrderedContentEntries(directoryPath: string): ContentEntry[] {
  const layout = readLayoutConfig(directoryPath);
  const entries = readdirSync(directoryPath, { withFileTypes: true })
    .flatMap((entry): ContentEntry[] => {
      if (entry.isDirectory()) {
        return [{ kind: 'directory', name: entry.name }];
      }

      if (entry.isFile() && entry.name.endsWith('.mdx')) {
        return [{ kind: 'page', name: entry.name.replace(/\.mdx$/, '') }];
      }

      return [];
    })
    .filter((entry) => !layout.hidden.includes(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name));

  if (!layout.order.length) {
    return entries;
  }

  const entryMap = new Map(entries.map((entry) => [entry.name, entry]));
  const orderedEntries = layout.order
    .map((name) => entryMap.get(name))
    .filter((entry): entry is ContentEntry => entry !== undefined);
  const remainingEntries = entries.filter((entry) => !layout.order.includes(entry.name));

  return [...orderedEntries, ...remainingEntries];
}

/**
 * Reads the limited layout.yaml schema used by the content tree.
 */
export function readLayoutConfig(directoryPath: string): LayoutConfig {
  const layoutPath = path.join(directoryPath, 'layout.yaml');

  if (!existsSync(layoutPath)) {
    return { primary: [], order: [], hidden: [], links: {} };
  }

  const lines = readFileSync(layoutPath, 'utf8').split('\n');
  const config: LayoutConfig = { primary: [], order: [], hidden: [], links: {} };
  let section: 'primary' | 'order' | 'hidden' | 'links' | null = null;
  let currentLink: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const indent = line.match(/^\s*/)?.[0].length ?? 0;

    if (indent === 0) {
      currentLink = null;

      if (/^order:\s*$/.test(trimmed)) {
        section = 'order';
        continue;
      }

      if (/^primary:\s*$/.test(trimmed)) {
        section = 'primary';
        continue;
      }

      if (/^hidden:\s*$/.test(trimmed)) {
        section = 'hidden';
        continue;
      }

      if (/^links:\s*$/.test(trimmed)) {
        section = 'links';
        continue;
      }

      section = null;
      continue;
    }

    if (section === 'primary' || section === 'order' || section === 'hidden') {
      const itemMatch = trimmed.match(/^-\s+(.+?)\s*$/);

      if (itemMatch) {
        const target =
          section === 'primary'
            ? config.primary
            : section === 'order'
              ? config.order
              : config.hidden;
        target.push(stripYamlValue(itemMatch[1]));
      }

      continue;
    }

    if (section === 'links') {
      if (indent === 2) {
        const linkMatch = trimmed.match(/^([A-Za-z0-9_-]+):\s*$/);

        if (linkMatch) {
          currentLink = linkMatch[1];
          config.links[currentLink] = {
            href: '',
            label: currentLink,
          };
        }

        continue;
      }

      if (indent === 4 && currentLink) {
        const propertyMatch = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.+?)\s*$/);

        if (!propertyMatch) {
          continue;
        }

        const [, property, rawValue] = propertyMatch;
        const value = stripYamlValue(rawValue);

        if (property === 'external' || property === 'hidden') {
          config.links[currentLink][property] = value === 'true';
          continue;
        }

        if (property === 'href' || property === 'label') {
          config.links[currentLink][property] = value;
        }
      }
    }
  }

  return config;
}

function stripYamlValue(value: string): string {
  return value.replace(/^['"]|['"]$/g, '').trim();
}
