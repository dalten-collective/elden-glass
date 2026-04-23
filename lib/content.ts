import fs from 'fs';
import path from 'path';

import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import { z } from 'zod';

const WORDS_PER_MINUTE = 220;
const CONTENT_DIR = path.join(process.cwd(), 'content');
const CONTENT_PAGES_DIR = path.join(CONTENT_DIR, 'pages');
const CRITIQUES_DIR = path.join(CONTENT_DIR, 'critiques');
const SHOULD_CACHE_CONTENT = process.env.NODE_ENV !== 'development';

type ContentPageHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

type ContentBody = {
  raw: string;
};

export type ContentPage = {
  body: ContentBody;
  headings: ContentPageHeading[];
  readingMinutes?: number;
  slug: string;
  url: string;
  title: string;
  summary: string;
  updated: string;
  date: string;
  subtitle?: string;
  eyebrow?: string;
  navMeta?: string;
  documentHash?: string;
  hashableFile?: string;
  sealedDate?: string;
  ethereumAttestation?: string;
  bitcoinOts?: string;
  verificationSubject?: string;
  vocabSearch?: boolean;
  vocabSearchPlaceholder?: string;
};

export type Critique = {
  body: ContentBody;
  readingMinutes?: number;
  slug: string;
  title: string;
  summary: string;
  targetUrl: string;
  targetTitle: string;
  published: string;
  updated: string;
  date: string;
};

const dateField = z.union([z.string(), z.date()]).transform((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
});

const optionalStringField = z.string().optional();

const contentPageFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  updated: dateField,
  subtitle: optionalStringField,
  eyebrow: optionalStringField,
  readingMinutes: z.number().optional(),
  navMeta: optionalStringField,
  documentHash: optionalStringField,
  hashableFile: optionalStringField,
  sealedDate: optionalStringField,
  ethereumAttestation: optionalStringField,
  bitcoinOts: optionalStringField,
  verificationSubject: optionalStringField,
  vocabSearch: z.boolean().optional(),
  vocabSearchPlaceholder: optionalStringField,
});

const critiqueFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  targetUrl: z.string(),
  targetTitle: z.string(),
  published: dateField,
  updated: dateField,
});

let contentPagesCache: ContentPage[] | null = null;
let critiquesCache: Critique[] | null = null;

function minutesFromBody(raw: string, fallback = 6) {
  const words = raw.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE)) || fallback;
}

function withComputedReadingTime<T extends { body: { raw: string }; readingMinutes?: number }>(
  doc: T
) {
  return {
    ...doc,
    readingMinutes: doc.readingMinutes ?? minutesFromBody(doc.body.raw),
  };
}

function listMdxFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listMdxFiles(entryPath);
      }

      return entry.isFile() && /\.mdx?$/.test(entry.name) ? [entryPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function parseMdxFile(filePath: string) {
  const file = fs.readFileSync(filePath, 'utf8');
  return matter(file);
}

function fileSlug(filePath: string, baseDirectory: string) {
  return path
    .relative(baseDirectory, filePath)
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '');
}

function extractHeadings(raw: string): ContentPageHeading[] {
  const slugger = new GithubSlugger();
  const matches = Array.from(raw.matchAll(/^(#{2,3})\s+(.+)$/gm));

  return matches.map((match) => ({
    level: match[1].length as 2 | 3,
    text: match[2].trim(),
    id: slugger.slug(match[2].trim()),
  }));
}

function getContentPages(): ContentPage[] {
  if (SHOULD_CACHE_CONTENT && contentPagesCache) {
    return contentPagesCache;
  }

  const pages = listMdxFiles(CONTENT_PAGES_DIR).map((filePath) => {
    const slug = fileSlug(filePath, CONTENT_PAGES_DIR);
    const parsed = parseMdxFile(filePath);
    const frontmatter = contentPageFrontmatterSchema.parse(parsed.data);

    return {
      ...frontmatter,
      body: { raw: parsed.content },
      headings: extractHeadings(parsed.content),
      slug,
      url: `/${slug}`,
      date: frontmatter.updated,
    };
  });

  if (SHOULD_CACHE_CONTENT) {
    contentPagesCache = pages;
  }

  return pages;
}

function getAllCritiques(): Critique[] {
  if (SHOULD_CACHE_CONTENT && critiquesCache) {
    return critiquesCache;
  }

  const critiques = listMdxFiles(CRITIQUES_DIR).map((filePath) => {
    const slug = fileSlug(filePath, CRITIQUES_DIR);
    const parsed = parseMdxFile(filePath);
    const frontmatter = critiqueFrontmatterSchema.parse(parsed.data);

    return {
      ...frontmatter,
      body: { raw: parsed.content },
      slug,
      date: frontmatter.updated || frontmatter.published,
    };
  });

  if (SHOULD_CACHE_CONTENT) {
    critiquesCache = critiques;
  }

  return critiques;
}

/**
 * Adds a computed reading time to a ContentPage when frontmatter does not
 * already provide one.
 */
export function withReadingTime(doc: ContentPage): ContentPage & { readingMinutes: number } {
  return withComputedReadingTime(doc);
}

/**
 * Returns a content page by its filesystem-derived slug, with reading time
 * computed from the body when the author did not specify it in frontmatter.
 */
export function getContentPageBySlug(slug: string): ContentPage | null {
  const doc = getContentPages().find((page) => page.slug === slug);
  return doc ? withComputedReadingTime(doc) : null;
}

/**
 * Returns content pages in deterministic slug order.
 */
export function allContentPagesSorted(): ContentPage[] {
  return getContentPages()
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Returns published critique documents ordered by most recent update.
 */
export function getCritiques(): Array<Critique & { readingMinutes: number }> {
  return getAllCritiques()
    .slice()
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .map((critique) => withComputedReadingTime(critique));
}

/**
 * Returns one critique document by its filesystem-derived slug.
 */
export function getCritiqueBySlug(slug: string) {
  const match = getAllCritiques().find((critique) => critique.slug === slug);
  return match ? withComputedReadingTime(match) : null;
}
