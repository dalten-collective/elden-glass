import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';

import { z } from 'zod';

export const CONTENT_PAGES_DIR = path.join(process.cwd(), 'content', 'pages');
const LAYOUT_CONFIG_FILE = 'layout.json';

export type ContentEntry = {
  kind: 'directory' | 'page';
  name: string;
};

export type LayoutLink = {
  href: string;
  label: string;
  summary: string;
  kind: 'interactive' | 'index';
  external?: boolean;
  hidden?: boolean;
};

export type LayoutConfig = {
  primary: string[];
  order: string[];
  hidden: string[];
  links: Record<string, LayoutLink>;
};

const layoutLinkSchema = z
  .object({
    href: z.string().min(1),
    label: z.string().optional(),
    summary: z.string().min(1),
    kind: z.enum(['interactive', 'index']).default('interactive'),
    external: z.boolean().optional(),
    hidden: z.boolean().optional(),
  })
  .strict()
  .transform((link) => ({
    ...link,
    label: link.label ?? '',
  }));

const layoutConfigSchema = z
  .object({
    primary: z.array(z.string().min(1)).optional(),
    order: z.array(z.string().min(1)).optional(),
    hidden: z.array(z.string().min(1)).optional(),
    links: z.record(z.string().regex(/^[A-Za-z0-9_-]+$/), layoutLinkSchema).optional(),
  })
  .strict()
  .transform((config) => ({
    primary: config.primary ?? [],
    order: config.order ?? [],
    hidden: config.hidden ?? [],
    links: Object.fromEntries(
      Object.entries(config.links ?? {}).map(([key, link]) => [
        key,
        {
          ...link,
          label: link.label || key,
        },
      ])
    ),
  }));

/**
 * Returns the first content page slug within a folder, using layout.json order
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
 * Reads and validates the layout.json schema used by the content tree.
 */
export function readLayoutConfig(directoryPath: string): LayoutConfig {
  const layoutPath = path.join(directoryPath, LAYOUT_CONFIG_FILE);

  if (!existsSync(layoutPath)) {
    return { primary: [], order: [], hidden: [], links: {} };
  }

  let parsed: unknown;
  const source = readFileSync(layoutPath, 'utf8');

  try {
    parsed = JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid layout config JSON in ${formatLayoutPath(layoutPath)}: ${error}`);
  }

  assertNoDuplicateJsonKeys(source, layoutPath);

  const result = layoutConfigSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Invalid layout config in ${formatLayoutPath(layoutPath)}: ${result.error.message}`
    );
  }

  return result.data;
}

function formatLayoutPath(layoutPath: string): string {
  return path.relative(process.cwd(), layoutPath);
}

/**
 * JSON.parse accepts duplicate object keys, so inspect the valid source text to
 * keep navigation config failures explicit.
 */
function assertNoDuplicateJsonKeys(source: string, layoutPath: string): void {
  let index = 0;

  function skipWhitespace(): void {
    while (/\s/.test(source[index] ?? '')) {
      index += 1;
    }
  }

  function parseString(): string {
    const start = index;
    index += 1;

    while (index < source.length) {
      const char = source[index];

      if (char === '"') {
        index += 1;
        return JSON.parse(source.slice(start, index)) as string;
      }

      if (char === '\\') {
        index += 1;

        if (index < source.length) {
          index += 1;
        }

        continue;
      }

      index += 1;
    }

    return '';
  }

  function parsePrimitive(): void {
    while (index < source.length && !/[,\]}]/.test(source[index])) {
      index += 1;
    }
  }

  function parseArray(): void {
    index += 1;
    skipWhitespace();

    while (index < source.length && source[index] !== ']') {
      parseValue();
      skipWhitespace();

      if (source[index] === ',') {
        index += 1;
        skipWhitespace();
      }
    }

    index += 1;
  }

  function parseObject(): void {
    const keys = new Set<string>();
    index += 1;
    skipWhitespace();

    while (index < source.length && source[index] !== '}') {
      const key = parseString();

      if (keys.has(key)) {
        throw new Error(`Duplicate key "${key}" in ${formatLayoutPath(layoutPath)}`);
      }

      keys.add(key);
      skipWhitespace();
      index += 1;
      skipWhitespace();
      parseValue();
      skipWhitespace();

      if (source[index] === ',') {
        index += 1;
        skipWhitespace();
      }
    }

    index += 1;
  }

  function parseValue(): void {
    skipWhitespace();

    if (source[index] === '{') {
      parseObject();
      return;
    }

    if (source[index] === '[') {
      parseArray();
      return;
    }

    if (source[index] === '"') {
      parseString();
      return;
    }

    parsePrimitive();
  }

  parseValue();
}
