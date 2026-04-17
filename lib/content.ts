import * as contentlayerGenerated from 'contentlayer/generated';
import { allCritiques, type Critique } from 'contentlayer/generated';

const WORDS_PER_MINUTE = 220;

type ContentPageHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

export type ContentPage = {
  body: { raw: string; code: string };
  headings: ContentPageHeading[];
  readingMinutes?: number;
  slug: string;
  url: string;
  title: string;
  summary: string;
  updated: string;
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

const allContentPages =
  (
    contentlayerGenerated as typeof contentlayerGenerated & {
      allContentPages?: ContentPage[];
    }
  ).allContentPages ?? [];

function minutesFromBody(raw: string, fallback = 6) {
  const words = raw.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE)) || fallback;
}

function withComputedReadingTime<T extends { body: { raw: string }; readingMinutes?: number }>(doc: T) {
  return {
    ...doc,
    readingMinutes: doc.readingMinutes ?? minutesFromBody(doc.body.raw),
  };
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
  const doc = allContentPages.find((page) => page.slug === slug);
  return doc ? withComputedReadingTime(doc) : null;
}

/**
 * Returns content pages in deterministic slug order.
 */
export function allContentPagesSorted(): ContentPage[] {
  return allContentPages.slice().sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getCritiques(): Array<Critique & { readingMinutes: number }> {
  return allCritiques
    .slice()
    .sort(
      (a: Critique, b: Critique) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
    )
    .map((critique) => withComputedReadingTime(critique));
}

export function getCritiqueBySlug(slug: string) {
  const match = allCritiques.find((critique: Critique) => critique.slug === slug);
  return match ? withComputedReadingTime(match) : null;
}
